# LOCUS Workspace Cleanup Script (PowerShell)
Write-Host "Cleaning temporary Python bytecode and test caches..." -ForegroundColor Cyan

$pycacheFolders = Get-ChildItem -Path . -Recurse -Directory -Filter "__pycache__" -ErrorAction SilentlyContinue
foreach ($folder in $pycacheFolders) {
    Write-Host "Removing: $($folder.FullName)" -ForegroundColor DarkGray
    Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
}

$pytestCache = Get-ChildItem -Path . -Recurse -Directory -Filter ".pytest_cache" -ErrorAction SilentlyContinue
foreach ($folder in $pytestCache) {
    Write-Host "Removing: $($folder.FullName)" -ForegroundColor DarkGray
    Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
}

$pycFiles = Get-ChildItem -Path . -Recurse -File -Include "*.pyc", "*.pyo" -ErrorAction SilentlyContinue
foreach ($file in $pycFiles) {
    Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
}

Write-Host "Workspace clean complete!" -ForegroundColor Green
