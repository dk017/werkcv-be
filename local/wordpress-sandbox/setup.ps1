$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path -Parent $root
$sandboxDir = $PSScriptRoot
$pluginDir = Join-Path $repoRoot "wordpress-plugin\\werkcv-salaris-tools"
$artifactDir = Join-Path $sandboxDir "artifacts"
$pluginZip = Join-Path $artifactDir "werkcv-salaris-tools.zip"
$siteUrl = "http://localhost:8088"
$pageSlug = "werkcv-netto-bruto-test"

if (-not (Test-Path $pluginDir)) {
  throw "Plugin directory not found at $pluginDir"
}

New-Item -ItemType Directory -Force -Path $artifactDir | Out-Null

if (Test-Path $pluginZip) {
  try {
    Remove-Item $pluginZip -Force
  } catch {
    $pluginZip = Join-Path $artifactDir ("werkcv-salaris-tools-{0}.zip" -f (Get-Date -Format "yyyyMMdd-HHmmss"))
  }
}

Compress-Archive -Path (Join-Path $pluginDir "*") -DestinationPath $pluginZip -Force
Write-Output "Plugin zip created at $pluginZip"

Push-Location $sandboxDir
try {
  docker compose up -d

  $ready = $false
  for ($i = 0; $i -lt 30; $i++) {
    try {
      $response = Invoke-WebRequest -Uri $siteUrl -UseBasicParsing -TimeoutSec 5
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        $ready = $true
        break
      }
    } catch {
      Start-Sleep -Seconds 2
    }
  }

  if (-not $ready) {
    throw "WordPress did not become reachable at $siteUrl"
  }

  $wp = "docker compose exec -T cli wp --allow-root"

  try {
    Invoke-Expression "$wp core is-installed" | Out-Null
    Write-Output "WordPress is already installed."
  } catch {
    Invoke-Expression "$wp core install --url=$siteUrl --title=`"WerkCV WP Sandbox`" --admin_user=admin --admin_password=`"admin123!`" --admin_email=admin@local.test --skip-email"
    Write-Output "WordPress installed."
  }

  Invoke-Expression "$wp plugin activate werkcv-salaris-tools"
  Write-Output "Plugin activated."

  Invoke-Expression "$wp option update werkcv_tools_default_theme light"
  Invoke-Expression "$wp option update werkcv_tools_enable_cta 0"
  Invoke-Expression "$wp option update werkcv_tools_enable_footer_credit 0"

  $existingId = Invoke-Expression "$wp post list --post_type=page --name=$pageSlug --field=ID"

  if ([string]::IsNullOrWhiteSpace($existingId)) {
    $pageId = Invoke-Expression "$wp post create --post_type=page --post_status=publish --post_title=`"WerkCV Netto Bruto Test`" --post_name=$pageSlug --post_content=`"[werkcv_netto_bruto]`" --porcelain"
    Write-Output "Created test page with ID $pageId"
  } else {
    Invoke-Expression "$wp post update $existingId --post_content=`"[werkcv_netto_bruto]`""
    $pageId = $existingId
    Write-Output "Updated existing test page with ID $pageId"
  }

  Write-Output ""
  Write-Output "WordPress admin: $siteUrl/wp-admin"
  Write-Output "Admin user: admin"
  Write-Output "Admin password: admin123!"
  Write-Output "Plugin settings: $siteUrl/wp-admin/options-general.php?page=werkcv-salaris-tools"
  Write-Output "Shortcode test page: $siteUrl/$pageSlug/"
} finally {
  Pop-Location
}
