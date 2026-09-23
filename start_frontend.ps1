# Start Frontend in PowerShell
Write-Host "Starting InvisibleScore Frontend on http://127.0.0.1:5173..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\frontend"
npm run dev -- --host 127.0.0.1 --port 5173
