param(
  [Parameter(Mandatory = $true)]
  [string]$WorkingCopyPath,
  [string]$PluginSlug = "werkcv-salaris-tools",
  [string]$Version = "0.1.1"
)

$ErrorActionPreference = "Stop";

$scriptRoot = $PSScriptRoot;
$distPluginRoot = Join-Path $scriptRoot ("dist\{0}" -f $PluginSlug);
$wporgAssetsRoot = Join-Path $scriptRoot ("wporg-assets\{0}" -f $PluginSlug);
$svnRoot = (Resolve-Path $WorkingCopyPath).Path;
$svnTrunk = Join-Path $svnRoot "trunk";
$svnAssets = Join-Path $svnRoot "assets";
$svnTag = Join-Path $svnRoot ("tags\{0}" -f $Version);

if (-not (Test-Path $distPluginRoot)) {
  throw "Missing packaged plugin directory: $distPluginRoot. Run package-plugin.ps1 first.";
}

foreach ($requiredPath in @($svnTrunk, (Join-Path $svnRoot "tags"), $svnAssets)) {
  if (-not (Test-Path $requiredPath)) {
    throw "Missing SVN working-copy path: $requiredPath";
  }
}

function Clear-Directory {
  param([string]$Path)

  Get-ChildItem -LiteralPath $Path -Force | ForEach-Object {
    Remove-Item -LiteralPath $_.FullName -Recurse -Force;
  }
}

function Copy-DirectoryContents {
  param(
    [string]$SourcePath,
    [string]$DestinationPath
  )

  Get-ChildItem -LiteralPath $SourcePath -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $DestinationPath -Recurse -Force;
  }
}

Clear-Directory -Path $svnTrunk;
Copy-DirectoryContents -SourcePath $distPluginRoot -DestinationPath $svnTrunk;

if (Test-Path $svnTag) {
  Remove-Item -LiteralPath $svnTag -Recurse -Force;
}

New-Item -ItemType Directory -Force -Path $svnTag | Out-Null;
Copy-DirectoryContents -SourcePath $distPluginRoot -DestinationPath $svnTag;

if (Test-Path $wporgAssetsRoot) {
  Clear-Directory -Path $svnAssets;
  Copy-DirectoryContents -SourcePath $wporgAssetsRoot -DestinationPath $svnAssets;
}

Write-Host "Prepared SVN working copy:";
Write-Host "  trunk -> $svnTrunk";
Write-Host "  tag   -> $svnTag";
Write-Host "  assets-> $svnAssets";
