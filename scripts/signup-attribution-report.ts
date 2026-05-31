import "dotenv/config";
import { prisma } from "../lib/prisma";

type SignupRow = {
  email: string;
  createdAt: Date;
  sourcePath: string | null;
  sourceCluster: string | null;
  sourceLocale: string | null;
  documentCount: number;
  sessionCount: number;
};

function bucketKey(path: string | null, cluster: string | null): string {
  if (path) return path;
  if (cluster) return `[cluster] ${cluster}`;
  return "(unattributed)";
}

async function main() {
  const daysArg = Number(process.argv[2]);
  const days = Number.isFinite(daysArg) && daysArg > 0 ? Math.floor(daysArg) : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    where: {
      createdAt: { gte: since },
    },
    select: {
      email: true,
      createdAt: true,
      sourcePath: true,
      sourceCluster: true,
      sourceLocale: true,
      _count: {
        select: {
          documents: true,
          sessions: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows: SignupRow[] = users.map((user) => ({
    email: user.email,
    createdAt: user.createdAt,
    sourcePath: user.sourcePath,
    sourceCluster: user.sourceCluster,
    sourceLocale: user.sourceLocale,
    documentCount: user._count.documents,
    sessionCount: user._count.sessions,
  }));

  const bySource = new Map<
    string,
    { signups: number; withDocs: number; locale: string; cluster: string }
  >();

  for (const row of rows) {
    const key = bucketKey(row.sourcePath, row.sourceCluster);
    const current = bySource.get(key) || {
      signups: 0,
      withDocs: 0,
      locale: row.sourceLocale || "",
      cluster: row.sourceCluster || "",
    };

    current.signups += 1;
    if (row.documentCount > 0) current.withDocs += 1;
    if (!current.locale && row.sourceLocale) current.locale = row.sourceLocale;
    if (!current.cluster && row.sourceCluster) current.cluster = row.sourceCluster;

    bySource.set(key, current);
  }

  console.log(`Signup attribution report (last ${days} days)`);
  console.log(`Window start: ${since.toISOString()}`);
  console.log("");

  console.table([
    {
      signups: rows.length,
      with_docs: rows.filter((row) => row.documentCount > 0).length,
      unattributed: rows.filter((row) => !row.sourcePath && !row.sourceCluster).length,
    },
  ]);

  if (rows.length === 0) {
    console.log("No signups found in the selected window.");
    return;
  }

  console.log("Signups by source");
  console.table(
    [...bySource.entries()]
      .map(([source, value]) => ({
        source,
        cluster: value.cluster,
        locale: value.locale,
        signups: value.signups,
        with_docs: value.withDocs,
      }))
      .sort((a, b) => b.signups - a.signups || a.source.localeCompare(b.source))
  );

  console.log("Latest signups");
  console.table(
    rows.map((row) => ({
      created_at: row.createdAt.toISOString(),
      email: row.email,
      source_path: row.sourcePath || "",
      source_cluster: row.sourceCluster || "",
      locale: row.sourceLocale || "",
      documents: row.documentCount,
      sessions: row.sessionCount,
    }))
  );
}

main()
  .catch((error) => {
    console.error("signup_attribution_report_failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
