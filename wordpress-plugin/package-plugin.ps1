param(
  [string]$PluginSlug = "werkcv-salaris-tools",
  [string]$Version = "0.1.1",
  [switch]$Review = $true
)

$ErrorActionPreference = "Stop";

$pluginRoot = Join-Path $PSScriptRoot $PluginSlug;
$distRoot = Join-Path $PSScriptRoot "dist";
$stageRoot = Join-Path $distRoot $PluginSlug;
$suffix = if ($Review) { "-review" } else { "" };
$zipPath = Join-Path $distRoot ("{0}-{1}{2}.zip" -f $PluginSlug, $Version, $suffix);

if (-not (Test-Path $pluginRoot)) {
  throw "Plugin root not found: $pluginRoot";
}

$includePaths = @(
  "blocks",
  "includes",
  "languages",
  "templates",
  "composer.json",
  "package-lock.json",
  "package.json",
  "readme.txt",
  "uninstall.php",
  "webpack.config.js",
  "werkcv-salaris-tools.php"
);

New-Item -ItemType Directory -Force -Path $distRoot | Out-Null;

if (Test-Path $stageRoot) {
  Remove-Item -LiteralPath $stageRoot -Recurse -Force;
}

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force;
}

New-Item -ItemType Directory -Force -Path $stageRoot | Out-Null;

foreach ($relativePath in $includePaths) {
  $sourcePath = Join-Path $pluginRoot $relativePath;

  if (-not (Test-Path $sourcePath)) {
    throw "Missing required path: $sourcePath";
  }

  Copy-Item -LiteralPath $sourcePath -Destination $stageRoot -Recurse -Force;
}

Compress-Archive -Path $stageRoot -DestinationPath $zipPath -Force;

Write-Host "Packaged plugin:" $zipPath;
