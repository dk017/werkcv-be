import { readdir, readFile } from "fs/promises";
import path from "path";

type CliOptions = {
  host: string;
  key: string;
  keyLocation: string;
  sitemapUrl: string;
  endpoint: string;
  batchSize: number;
  limit?: number;
  dryRun: boolean;
};

type PublicKeyDiscovery = {
  key: string;
  filename: string;
};

const DEFAULT_HOST = "werkcv.nl";
const DEFAULT_ENDPOINT = "https://api.indexnow.org/IndexNow";
const DEFAULT_BATCH_SIZE = 500;
const KEY_FILE_PATTERN = /^[a-f0-9]{32}\.txt$/i;

function parseArgs(argv: string[]): Partial<CliOptions> {
  const options: Partial<CliOptions> = {};

  for (const arg of argv) {
    if (!arg.startsWith("--")) continue;

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    const [rawKey, ...rawValueParts] = arg.slice(2).split("=");
    const rawValue = rawValueParts.join("=");
    if (!rawKey || !rawValue) continue;

    switch (rawKey) {
      case "host":
        options.host = rawValue;
        break;
      case "key":
        options.key = rawValue;
        break;
      case "key-location":
        options.keyLocation = rawValue;
        break;
      case "sitemap":
        options.sitemapUrl = rawValue;
        break;
      case "endpoint":
        options.endpoint = rawValue;
        break;
      case "batch-size":
        options.batchSize = Number(rawValue);
        break;
      case "limit":
        options.limit = Number(rawValue);
        break;
      default:
        break;
    }
  }

  return options;
}

async function discoverPublicKey(): Promise<PublicKeyDiscovery | null> {
  const publicDir = path.join(process.cwd(), "public");
  const entries = await readdir(publicDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !KEY_FILE_PATTERN.test(entry.name)) continue;

    const filenameKey = entry.name.replace(/\.txt$/i, "");
    const content = (await readFile(path.join(publicDir, entry.name), "utf8")).trim();
    if (content === filenameKey) {
      return { key: content, filename: entry.name };
    }
  }

  return null;
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function extractUrlsFromSitemap(xml: string): string[] {
  const matches = xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi);
  const urls: string[] = [];

  for (const match of matches) {
    const value = match[1]?.trim();
    if (!value) continue;
    urls.push(decodeXml(value));
  }

  return urls;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }

  return chunks;
}

async function loadUrlsFromSitemap(sitemapUrl: string, expectedHost: string): Promise<string[]> {
  const response = await fetch(sitemapUrl, {
    headers: {
      "User-Agent": "werkcv-indexnow-submit/1.0",
      "Accept": "application/xml,text/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap (${response.status}) ${sitemapUrl}`);
  }

  const xml = await response.text();
  const rawUrls = extractUrlsFromSitemap(xml);
  const uniqueUrls = [...new Set(rawUrls)];

  return uniqueUrls.filter((url) => {
    try {
      return new URL(url).host === expectedHost;
    } catch {
      return false;
    }
  });
}

async function submitBatch(options: CliOptions, urlList: string[], batchNumber: number, batchCount: number): Promise<void> {
  const payload = {
    host: options.host,
    key: options.key,
    keyLocation: options.keyLocation,
    urlList,
  };

  console.log(`Submitting batch ${batchNumber}/${batchCount} with ${urlList.length} URLs`);

  if (options.dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const response = await fetch(options.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "User-Agent": "werkcv-indexnow-submit/1.0",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`IndexNow submission failed for batch ${batchNumber} (${response.status}): ${body || "<empty>"}`);
  }

  console.log(`Batch ${batchNumber}/${batchCount} accepted with status ${response.status}`);
  if (body.trim()) {
    console.log(body.trim());
  }
}

async function buildOptions(): Promise<CliOptions> {
  const cli = parseArgs(process.argv.slice(2));
  const discovered = await discoverPublicKey();
  const host = cli.host || DEFAULT_HOST;
  const key = cli.key || discovered?.key || "";

  if (!key) {
    throw new Error("Missing IndexNow key. Pass --key=... or add a matching key file under public/.");
  }

  const batchSize = Number.isFinite(cli.batchSize) && (cli.batchSize ?? 0) > 0
    ? Math.floor(cli.batchSize as number)
    : DEFAULT_BATCH_SIZE;

  const limit = Number.isFinite(cli.limit) && (cli.limit ?? 0) > 0
    ? Math.floor(cli.limit as number)
    : undefined;

  return {
    host,
    key,
    keyLocation: cli.keyLocation || `https://${host}/${key}.txt`,
    sitemapUrl: cli.sitemapUrl || `https://${host}/sitemap.xml`,
    endpoint: cli.endpoint || DEFAULT_ENDPOINT,
    batchSize,
    limit,
    dryRun: Boolean(cli.dryRun),
  };
}

async function main(): Promise<void> {
  const options = await buildOptions();

  console.log(`Host: ${options.host}`);
  console.log(`Key location: ${options.keyLocation}`);
  console.log(`Sitemap: ${options.sitemapUrl}`);

  const urls = await loadUrlsFromSitemap(options.sitemapUrl, options.host);
  const limitedUrls = typeof options.limit === "number" ? urls.slice(0, options.limit) : urls;

  if (limitedUrls.length === 0) {
    console.log("No sitemap URLs found for the requested host.");
    return;
  }

  const batches = chunk(limitedUrls, options.batchSize);
  console.log(`Submitting ${limitedUrls.length} URLs in ${batches.length} batch(es)`);

  for (const [index, batch] of batches.entries()) {
    await submitBatch(options, batch, index + 1, batches.length);
  }

  console.log("IndexNow submission complete.");
}

main().catch((error) => {
  console.error("indexnow_submit_failed", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
