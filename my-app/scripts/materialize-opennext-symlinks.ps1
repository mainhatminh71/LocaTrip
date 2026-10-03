$ErrorActionPreference = "Continue"
$root = Join-Path (Get-Location) ".open-next\server-functions"
if (-not (Test-Path $root)) { Write-Host "no server-functions"; exit 0 }

function Replace-Link([string]$path) {
  if (-not (Test-Path $path)) { return }
  $item = Get-Item $path -Force
  if (-not ($item.Attributes -band [IO.FileAttributes]::ReparsePoint)) { return }
  # Already a junction? keep
  if ($item.LinkType -eq "Junction") { return }

  $targetRel = ($item.Target | Select-Object -First 1)
  if (-not $targetRel) { return }
  $parent = Split-Path $path -Parent
  $targetAbs = if ([IO.Path]::IsPathRooted($targetRel)) { $targetRel } else { [IO.Path]::GetFullPath((Join-Path $parent $targetRel)) }
  if (-not (Test-Path $targetAbs)) { return }

  cmd /c "rmdir `"$path`"" | Out-Null
  if (Test-Path $path) { cmd /c "del /f /q `"$path`"" | Out-Null }
  if (Test-Path $path) { Remove-Item $path -Force -Recurse -ErrorAction SilentlyContinue }

  # Junctions are readable by esbuild on Windows; copies break pnpm layout.
  cmd /c "mklink /J `"$path`" `"$targetAbs`"" | Out-Null
}

$fixed = 0
Get-ChildItem $root -Directory | ForEach-Object {
  $nm = Join-Path $_.FullName "node_modules"
  if (-not (Test-Path $nm)) { return }
  $links = @(Get-ChildItem $nm -Recurse -Force -ErrorAction SilentlyContinue | Where-Object {
    ($_.Attributes -band [IO.FileAttributes]::ReparsePoint) -and ($_.LinkType -ne "Junction")
  } | Sort-Object { $_.FullName.Length } -Descending)
  foreach ($l in $links) { Replace-Link $l.FullName; $fixed++ }
}
Write-Host "[materialize-opennext-symlinks] converted $fixed symlink(s) to junctions"
