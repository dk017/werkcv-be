import "dotenv/config";
import fs from "fs";
import nodemailer from "nodemailer";

type OutreachRow = {
  rank: string;
  company: string;
  contact_name: string;
  email: string;
  segment: string;
  source_url: string;
  qualification_signal: string;
  subject: string;
  body: string;
};

function parseCsv(content: string): OutreachRow[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  return dataRows.map((dataRow) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = dataRow[index] || "";
    });
    return record as OutreachRow;
  });
}

function getTransporter() {
  const host = process.env.FOLLOWUP_SMTP_HOST || process.env.SMTP_HOST;
  const user = process.env.FOLLOWUP_SMTP_USER || process.env.SMTP_USER;
  const pass = process.env.FOLLOWUP_SMTP_PASSWORD || process.env.SMTP_PASS;
  const port = Number(process.env.FOLLOWUP_SMTP_PORT || process.env.SMTP_PORT || 465);
  const secure =
    process.env.FOLLOWUP_SMTP_SECURE !== undefined
      ? process.env.FOLLOWUP_SMTP_SECURE !== "false"
      : port === 465;

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASS are required");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    auth: { user, pass },
  });
}

function fromName(): string {
  return process.env.FOLLOWUP_FROM_NAME || "Dhinesh van WerkCV";
}

function fromEmail(): string {
  return process.env.FOLLOWUP_FROM_EMAIL || process.env.AUTH_FROM_EMAIL || process.env.SMTP_USER || "contact@werkcv.nl";
}

function replyToEmail(): string {
  return process.env.FOLLOWUP_REPLY_TO || fromEmail();
}

function assertOfficialSender() {
  const sender = fromEmail().toLowerCase();
  const allowPersonalSender = process.env.ALLOW_PERSONAL_SMTP_SENDER === "true";

  if (!allowPersonalSender && sender.endsWith("@gmail.com")) {
    throw new Error(
      [
        `Refusing to send outreach from personal Gmail sender: ${sender}`,
        "Set FOLLOWUP_FROM_EMAIL=contact@werkcv.nl with an authorized SMTP alias/mailbox,",
        "or set ALLOW_PERSONAL_SMTP_SENDER=true only for an intentional one-off send.",
      ].join(" ")
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function prepareBody(body: string): string {
  const optOutLine = "Als dit niet relevant is, laat het gerust weten; dan laat ik het hierbij.";

  if (body.includes(optOutLine)) {
    return body;
  }

  return body.replace("\n\nGroet,\nDhinesh", `\n\n${optOutLine}\n\nGroet,\nDhinesh`);
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.replace("--limit=", "")) : 30;
  const rows = parseCsv(fs.readFileSync("B2B_COACH_OUTREACH_2026-05-15.csv", "utf8")).slice(0, limit);
  if (!dryRun) assertOfficialSender();
  const transporter = dryRun ? null : getTransporter();
  const sentRows: string[] = ["rank,company,email,subject,status,message_id,error"];

  for (const row of rows) {
    const email = row.email.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      sentRows.push(`${row.rank},"${row.company}",${email},"${row.subject}",skipped,,invalid_email`);
      continue;
    }

    if (dryRun) {
      console.log(`DRY RUN ${row.rank}: ${row.company} <${email}> - ${row.subject}`);
      continue;
    }

    try {
      const info = await transporter!.sendMail({
        from: `${fromName()} <${fromEmail()}>`,
        to: email,
        replyTo: replyToEmail(),
        subject: row.subject,
        text: prepareBody(row.body),
      });

      const messageId = Array.isArray(info.messageId) ? info.messageId[0] : info.messageId || "";
      console.log(`SENT ${row.rank}: ${row.company} <${email}> ${messageId}`);
      sentRows.push(`${row.rank},"${row.company}",${email},"${row.subject}",sent,"${messageId}",`);
      await sleep(3500);
    } catch (error) {
      const message = error instanceof Error ? error.message.replace(/"/g, "'") : "unknown_error";
      console.error(`FAILED ${row.rank}: ${row.company} <${email}> ${message}`);
      sentRows.push(`${row.rank},"${row.company}",${email},"${row.subject}",failed,,"${message}"`);
    }
  }

  if (!dryRun) {
    fs.writeFileSync("B2B_COACH_OUTREACH_SENT_LOG_2026-05-15.csv", `${sentRows.join("\n")}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
