$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot
try {
  docker compose down -v
  if (Test-Path ".\\artifacts") {
    Remove-Item ".\\artifacts" -Recurse -Force
  }
} finally {
  Pop-Location
}
