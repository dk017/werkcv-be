import "dotenv/config";
import nodemailer from "nodemailer";
import { prisma } from "../lib/prisma";

type FollowupTask = {
  id: string;
  email: string;
  type: string;
  status: string;
  reason: string;
  draftSubject: string | null;
  draftBody: string | null;
  dueAt: Date;
  sentAt: Date | null;
  createdAt: Date;
  relatedCvId: string | null;
  relatedOrderId: string | null;
};

type ParseArgsResult = {
  dryRun: boolean;
  includeDrafts: boolean;
  limit: number;
};

function parseArgs(): ParseArgsResult {
  const args = new Set(process.argv.slice(2));
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limitValue = limitArg ? Number(limitArg.replace("--limit=", "")) : 20;
  const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.floor(limitValue) : 20;

  return {
    dryRun: args.has("--dry-run"),
    includeDrafts: args.has("--include-drafts"),
    limit,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getTransporter() {
  const host = process.env.FOLLOWUP_SMTP_HOST;
  const user = process.env.FOLLOWUP_SMTP_USER;
  const pass = process.env.FOLLOWUP_SMTP_PASSWORD;
  const port = Number(process.env.FOLLOWUP_SMTP_PORT || 465);
  const secure = process.env.FOLLOWUP_SMTP_SECURE !== "false";

  if (!host || !user || !pass) {
    throw new Error("FOLLOWUP_SMTP_HOST, FOLLOWUP_SMTP_USER and FOLLOWUP_SMTP_PASSWORD are required");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    auth: {
      user,
      pass,
    },
  });
}

function fromName(): string {
  return process.env.FOLLOWUP_FROM_NAME || "WerkCV";
}

function fromEmail(): string {
  return process.env.FOLLOWUP_FROM_EMAIL || process.env.FOLLOWUP_SMTP_USER || "contact@werkcv.nl";
}

function replyToEmail(): string {
  return process.env.FOLLOWUP_REPLY_TO || fromEmail();
}

async function getContactStatus(email: string): Promise<string> {
  const contact = await prisma.followupContact.findUnique({
    where: { email },
    select: { status: true },
  });

  return contact?.status || "active";
}

async function hasInboundReplyAfter(email: string, after: Date): Promise<boolean> {
  const message = await prisma.emailMessage.findFirst({
    where: {
      email,
      direction: "inbound",
      OR: [{ receivedAt: { gte: after } }, { createdAt: { gte: after } }],
    },
    select: { id: true },
  });

  return Boolean(message);
}

async function main() {
  const { dryRun, includeDrafts, limit } = parseArgs();
  const now = new Date();

  const tasks = await prisma.followupTask.findMany({
    where: {
      dueAt: { lte: now },
      status: includeDrafts ? { in: ["draft", "approved"] } : "approved",
      sentAt: null,
    },
    orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }],
    take: limit,
  });

  if (tasks.length === 0) {
    console.log("No followup tasks due for sending.");
    return;
  }

  const transporter = dryRun ? null : getTransporter();
  const summary: Array<{ id: string; email: string; status: string; messageId?: string }> = [];

  for (const task of tasks as FollowupTask[]) {
    const email = normalizeEmail(task.email);
    const subject = task.draftSubject || "Quick follow-up";
    const body = task.draftBody || "";

    const contactStatus = await getContactStatus(email);
    if (contactStatus === "paused" || contactStatus === "do_not_contact") {
      console.log(`Skipping ${task.id} (${email}) because contact is ${contactStatus}.`);
      await prisma.followupTask.update({
        where: { id: task.id },
        data: {
          status: "paused",
          skippedReason: `contact_${contactStatus}`,
        },
      });
      continue;
    }

    if (await hasInboundReplyAfter(email, task.createdAt)) {
      console.log(`Skipping ${task.id} (${email}) because an inbound reply exists after the task was created.`);
      await prisma.followupTask.update({
        where: { id: task.id },
        data: {
          status: "paused",
          skippedReason: "recent_inbound_reply",
        },
      });
      continue;
    }

    if (!body.trim()) {
      console.log(`Skipping ${task.id} (${email}) because it has no draft body.`);
      continue;
    }

    if (dryRun) {
      console.log(`DRY RUN: would send ${task.type} to ${email} (${task.id})`);
      continue;
    }

    const info = await transporter!.sendMail({
      from: `${fromName()} <${fromEmail()}>`,
      to: email,
      replyTo: replyToEmail(),
      subject,
      text: body,
    });

    await prisma.followupTask.update({
      where: { id: task.id },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
    });

    await prisma.emailMessage.create({
      data: {
        email,
        direction: "outbound",
        subject,
        bodyPreview: body,
        messageId: Array.isArray(info.messageId) ? info.messageId[0] : info.messageId || undefined,
        sentAt: new Date(),
      },
    });

    summary.push({
      id: task.id,
      email,
      status: "sent",
      messageId: Array.isArray(info.messageId) ? info.messageId[0] : info.messageId || undefined,
    });
  }

  console.table(summary);
}

main()
  .catch((error) => {
    console.error("followups_send_failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
