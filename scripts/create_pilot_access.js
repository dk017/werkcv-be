#!/usr/bin/env node
require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const [emailArg, daysArg, ...noteParts] = process.argv.slice(2);
  if (!emailArg) {
    console.error('Usage: node scripts/create_pilot_access.js <email> [days=14] [notes]');
    process.exit(1);
  }

  const days = Number.isFinite(Number(daysArg)) && Number(daysArg) > 0 ? Number(daysArg) : 14;
  const notes = noteParts.join(' ') || 'Pilot access';

  const user = await prisma.user.findUnique({ where: { email: emailArg } });
  if (!user) {
    console.error(`User with email ${emailArg} not found`);
    process.exit(1);
  }

  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const record = await prisma.pilotAccess.upsert({
    where: { userId: user.id },
    update: { expiresAt, notes },
    create: {
      userId: user.id,
      expiresAt,
      notes,
    },
  });

  console.log('Pilot access updated:', {
    email: user.email,
    expiresAt: record.expiresAt.toISOString(),
    notes: record.notes,
  });
}

main()
  .catch((error) => {
    console.error('pilot_access_failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
