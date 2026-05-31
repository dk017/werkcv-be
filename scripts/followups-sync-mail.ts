import "dotenv/config";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { prisma } from "../lib/prisma";

type SyncArgs = {
  dryRun: boolean;
};

type SyncDirection = "inbound" | "outbound";

const INBOUND_HINTS = ["inbox"];
const OUTBOUND_HINTS = ["sent", "sent items", "sent messages", "sent mail", "outbox"];

function parseArgs(): SyncArgs {
  const args = new Set(process.argv.slice(2));
  return {
    dryRun: args.has("--dry-run"),
  };
}

function normalizeEmail(email: string | null | undefined): string {
  return (email || "").trim().toLowerCase();
}

function truncate(text: string, maxLength = 5000): string {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  return normalized.length > maxLength ? normalized.slice(0, maxLength) : normalized;
}

function mailboxNameMatches(path: string, hints: string[]): boolean {
  const lower = path.toLowerCase();
  const lastSegment = lower.split(/[./]/).filter(Boolean).pop() || lower;
  return hints.some((hint) => lastSegment === hint || lower === hint);
}

function firstAddress(field: unknown): string | null {
  if (!field || typeof field !== "object") {
    return null;
  }

  if (Array.isArray(field)) {
    const first = field[0] as { address?: unknown } | undefined;
    return normalizeEmail(typeof first?.address === "string" ? first.address : null);
  }

  const valueField = field as {
    value?: Array<{
      address?: unknown;
    }>;
  };

  const value = valueField.value?.[0]?.address;
  return normalizeEmail(typeof value === "string" ? value : null);
}

function contactBodyClassification(subject: string | null | undefined, body: string): "paused" | "do_not_contact" {
  const haystack = `${subject || ""}\n${body || ""}`.toLowerCase();

  if (
    haystack.includes("unsubscribe") ||
    haystack.includes("unsub") ||
    haystack.includes("stop emailing") ||
    haystack.includes("stop mail") ||
    haystack.includes("do not contact") ||
    haystack.includes("don't contact") ||
    haystack.includes("niet meer mailen") ||
    haystack.includes("geen mails") ||
    haystack.includes("geen email") ||
    haystack.includes("geen e-mail") ||
    haystack.includes("afmelden") ||
    haystack.includes("remove me")
  ) {
    return "do_not_contact";
  }

  return "paused";
}

function messageIdentity(folder: string, uid: number, uidValidity: number, messageId: string | null): string {
  return messageId || `imap:${folder}:${uidValidity}:${uid}`;
}

async function resolveMailboxChoices(client: ImapFlow): Promise<{ inbound: string[]; outbound: string[] }> {
  const listed = await client.list();
  const available = listed.map((mailbox) => ({
    path: mailbox.path,
    specialUse: mailbox.specialUse,
  }));

  const bySpecialUse = (flag: string) =>
    available
      .filter((mailbox) => mailbox.specialUse === flag)
      .map((mailbox) => mailbox.path);

  const byHint = (hints: string[]) =>
    available.filter((mailbox) => mailboxNameMatches(mailbox.path, hints)).map((mailbox) => mailbox.path);

  const inbound = Array.from(new Set([...bySpecialUse("\\Inbox"), ...byHint(INBOUND_HINTS)]));
  const outbound = Array.from(new Set([...bySpecialUse("\\Sent"), ...byHint(OUTBOUND_HINTS)]));

  return {
    inbound: inbound.length > 0 ? inbound : ["INBOX"],
    outbound: outbound.length > 0 ? outbound : ["Sent"],
  };
}

async function getState(folder: string): Promise<{ uidValidity: number | null; lastUid: number }> {
  const state = await prisma.mailboxSyncState.findUnique({
    where: { folder },
    select: { uidValidity: true, lastUid: true },
  });

  return {
    uidValidity: state?.uidValidity ?? null,
    lastUid: state?.lastUid ?? 0,
  };
}

async function saveState(folder: string, uidValidity: number, lastUid: number) {
  await prisma.mailboxSyncState.upsert({
    where: { folder },
    create: {
      folder,
      uidValidity,
      lastUid,
      lastSyncedAt: new Date(),
    },
    update: {
      uidValidity,
      lastUid,
      lastSyncedAt: new Date(),
    },
  });
}

async function updateConversationState(email: string, subject: string | null | undefined, body: string, folder: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return;

  const status = contactBodyClassification(subject, body);

  await prisma.followupContact.upsert({
    where: { email: normalized },
    create: {
      email: normalized,
      status,
      source: `imap:${folder}`,
      notes: `Synced inbound message from ${folder}.`,
    },
    update: {
      status,
      source: `imap:${folder}`,
      notes: `Synced inbound message from ${folder}.`,
    },
  });

  await prisma.followupTask.updateMany({
    where: {
      email: normalized,
      sentAt: null,
      status: { in: ["draft", "approved"] },
    },
    data: {
      status,
      skippedReason: status === "do_not_contact" ? "imap_do_not_contact" : "imap_inbound_reply",
    },
  });
}

async function syncFolder(client: ImapFlow, folder: string, direction: SyncDirection, dryRun: boolean) {
  const mailbox = await client.mailboxOpen(folder);
  const uidValidity = Number(mailbox.uidValidity);
  const { uidValidity: storedUidValidity, lastUid } = await getState(folder);
  const startingUid = storedUidValidity !== uidValidity ? 1 : Math.max(1, lastUid + 1);

  console.log(`Syncing ${folder} (${direction}) from UID ${startingUid} of ${mailbox.uidNext - 1}`);

  if (mailbox.uidNext <= startingUid) {
    await client.mailboxClose();
    await saveState(folder, uidValidity, Math.max(lastUid, mailbox.uidNext - 1));
    return;
  }

  const fetched = await client.fetchAll(`${startingUid}:*`, {
    uid: true,
    source: true,
    envelope: true,
    internalDate: true,
    headers: true,
  }, {
    uid: true,
  });

  let highestUid = lastUid;

  for (const message of fetched) {
    if (!message.uid) continue;

    highestUid = Math.max(highestUid, message.uid);
    const source = message.source ?? Buffer.alloc(0);
    const parsed = await simpleParser(source);
    const subject = parsed.subject || message.envelope?.subject || null;
    const receivedAt = message.internalDate instanceof Date ? message.internalDate : new Date(message.internalDate || Date.now());
    const messageId = messageIdentity(folder, message.uid, uidValidity, normalizeEmail(parsed.messageId));
    const fromAddress = firstAddress(parsed.from || message.envelope?.from);
    const toAddress = firstAddress(parsed.to || message.envelope?.to);
    const correspondent = direction === "inbound" ? fromAddress : toAddress;
    const textBody = truncate(parsed.text || (typeof parsed.html === "string" ? parsed.html.replace(/<[^>]+>/g, " ") : "") || "", 5000);

    if (!correspondent) {
      continue;
    }

    if (!dryRun) {
      await prisma.emailMessage.upsert({
        where: { messageId },
        create: {
          email: correspondent,
          direction,
          folder,
          uid: message.uid,
          uidValidity,
          fromAddress,
          toAddress,
          subject,
          bodyPreview: textBody,
          messageId,
          inReplyTo: parsed.inReplyTo || null,
          sentAt: direction === "outbound" ? receivedAt : null,
          receivedAt: direction === "inbound" ? receivedAt : null,
        },
        update: {
          email: correspondent,
          direction,
          folder,
          uid: message.uid,
          uidValidity,
          fromAddress,
          toAddress,
          subject,
          bodyPreview: textBody,
          inReplyTo: parsed.inReplyTo || null,
          sentAt: direction === "outbound" ? receivedAt : null,
          receivedAt: direction === "inbound" ? receivedAt : null,
        },
      });
    }

    console.log(`${dryRun ? "DRY RUN " : ""}${direction} ${folder} uid=${message.uid} ${correspondent}`);

    if (direction === "inbound" && !dryRun) {
      await updateConversationState(correspondent, subject, textBody, folder);
    }
  }

  await client.mailboxClose();

  if (!dryRun) {
    await saveState(folder, uidValidity, highestUid);
  }
}

async function main() {
  const { dryRun } = parseArgs();
  const host = process.env.FOLLOWUP_IMAP_HOST;
  const user = process.env.FOLLOWUP_IMAP_USER;
  const pass = process.env.FOLLOWUP_IMAP_PASSWORD;
  const port = Number(process.env.FOLLOWUP_IMAP_PORT || 993);
  const secure = process.env.FOLLOWUP_IMAP_SECURE !== "false";

  if (!host || !user || !pass) {
    throw new Error("FOLLOWUP_IMAP_HOST, FOLLOWUP_IMAP_USER and FOLLOWUP_IMAP_PASSWORD are required");
  }

  const client = new ImapFlow({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    clientInfo: {
      name: "WerkCV followup sync",
    },
  });

  await client.connect();

  try {
    const { inbound, outbound } = await resolveMailboxChoices(client);
    console.log(`IMAP folders inbound=${inbound.join(",")} outbound=${outbound.join(",")}`);

    for (const folder of inbound) {
      try {
        await syncFolder(client, folder, "inbound", dryRun);
      } catch (error) {
        console.error(`imap_sync_folder_failed ${folder}`, error);
      }
    }

    for (const folder of outbound) {
      try {
        await syncFolder(client, folder, "outbound", dryRun);
      } catch (error) {
        console.error(`imap_sync_folder_failed ${folder}`, error);
      }
    }
  } finally {
    await client.logout().catch(() => client.close());
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("followups_imap_sync_failed", error);
  process.exitCode = 1;
});
