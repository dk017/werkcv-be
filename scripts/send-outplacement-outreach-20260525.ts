import "dotenv/config";
import fs from "fs";
import nodemailer from "nodemailer";

type OutreachRow = {
  Rank: string;
  Company: string;
  ContactName: string;
  Email: string;
  Subject: string;
  Body: string;
};

const INPUT_FILE = "OUTPLACEMENT_LOOPBAAN_OUTREACH_BATCH_2026-05-25.csv";
const SENT_LOG_FILE = "OUTPLACEMENT_LOOPBAAN_OUTREACH_SENT_LOG_2026-05-25.csv";
const REQUIRED_FROM_EMAIL = "contact@werkcv.nl";

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

function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
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
  return process.env.FOLLOWUP_FROM_EMAIL || process.env.AUTH_FROM_EMAIL || process.env.SMTP_USER || "";
}

function replyToEmail(): string {
  return process.env.FOLLOWUP_REPLY_TO || REQUIRED_FROM_EMAIL;
}

function assertOfficialSender() {
  const sender = fromEmail().toLowerCase();

  if (sender !== REQUIRED_FROM_EMAIL) {
    throw new Error(`Refusing to send outreach from ${sender || "empty sender"}. Set FOLLOWUP_FROM_EMAIL=${REQUIRED_FROM_EMAIL}`);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.replace("--limit=", "")) : 10;
  const rows = parseCsv(fs.readFileSync(INPUT_FILE, "utf8")).slice(0, limit);

  assertOfficialSender();

  const transporter = dryRun ? null : getTransporter();
  const sentRows = ["rank,company,email,subject,status,message_id,error"];

  for (const row of rows) {
    const email = row.Email.trim().toLowerCase();
    const subject = row.Subject.trim();

    if (!email || !email.includes("@")) {
      sentRows.push([row.Rank, row.Company, email, subject, "skipped", "", "invalid_email"].map(csvCell).join(","));
      continue;
    }

    if (dryRun) {
      console.log(`DRY RUN ${row.Rank}: ${row.Company} <${email}> - ${subject}`);
      continue;
    }

    try {
      const info = await transporter!.sendMail({
        from: `${fromName()} <${REQUIRED_FROM_EMAIL}>`,
        to: email,
        replyTo: replyToEmail(),
        subject,
        text: row.Body,
      });

      const messageId = Array.isArray(info.messageId) ? info.messageId[0] : info.messageId || "";
      console.log(`SENT ${row.Rank}: ${row.Company} <${email}> ${messageId}`);
      sentRows.push([row.Rank, row.Company, email, subject, "sent", messageId, ""].map(csvCell).join(","));
      await sleep(3500);
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown_error";
      console.error(`FAILED ${row.Rank}: ${row.Company} <${email}> ${message}`);
      sentRows.push([row.Rank, row.Company, email, subject, "failed", "", message].map(csvCell).join(","));
    }
  }

  if (!dryRun) {
    fs.writeFileSync(SENT_LOG_FILE, `${sentRows.join("\n")}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
