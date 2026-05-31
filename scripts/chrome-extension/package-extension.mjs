import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const extensionRoot = path.join(repoRoot, "chrome-extension", "werkcv-vacature-keyword-highlighter");
const artifactRoot = path.join(repoRoot, "chrome-extension", "artifacts", "werkcv-vacature-keyword-highlighter");
const stagingDir = path.join(artifactRoot, "package");
const zipPath = path.join(artifactRoot, "werkcv-vacature-keyword-highlighter-chrome-web-store.zip");

const filesToCopy = [
  "manifest.json",
  "popup.html",
  "popup.css",
  "popup.js",
  "content.js",
  "highlighter.css",
  "shared.js",
  path.join("icons", "icon-16.png"),
  path.join("icons", "icon-32.png"),
  path.join("icons", "icon-48.png"),
  path.join("icons", "icon-128.png"),
];

async function resetDirectory(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

function escapePowerShellLiteral(value) {
  return value.replace(/'/g, "''");
}

await fs.mkdir(artifactRoot, { recursive: true });
await resetDirectory(stagingDir);

for (const relativePath of filesToCopy) {
  const sourcePath = path.join(extensionRoot, relativePath);
  const destinationPath = path.join(stagingDir, relativePath);
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.copyFile(sourcePath, destinationPath);
}

await fs.rm(zipPath, { force: true });

if (process.platform === "win32") {
  const stagingDirLiteral = escapePowerShellLiteral(stagingDir);
  const zipPathLiteral = escapePowerShellLiteral(zipPath);

  execFileSync("powershell", [
    "-NoProfile",
    "-Command",
    [
      `$src='${stagingDirLiteral}'`,
      `$dst='${zipPathLiteral}'`,
      "if (Test-Path $dst) { Remove-Item $dst -Force }",
      "Add-Type -AssemblyName System.IO.Compression.FileSystem",
      "[System.IO.Compression.ZipFile]::CreateFromDirectory($src, $dst, [System.IO.Compression.CompressionLevel]::Optimal, $false)",
    ].join("; "),
  ], {
    stdio: "inherit",
  });
} else {
  execFileSync("zip", ["-r", zipPath, "."], {
    cwd: stagingDir,
    stdio: "inherit",
  });
}

console.log(`Packaged extension zip at ${zipPath}`);
