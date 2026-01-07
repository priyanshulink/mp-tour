#!/usr/bin/env pwsh
# MP Tourism Hackathon - Start All Services
# This script starts all required services for the application

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  MP Heritage Tourism Platform" -ForegroundColor Yellow
Write-Host "  Starting All Services..." -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Function to start a service in a new window
function Start-ServiceWindow {
    param (
        [string]$Title,
        [string]$Path,
        [string]$Command,
        [string]$Color
    )
    
    Write-Host "🚀 Starting $Title..." -ForegroundColor $Color
    
    $fullPath = Join-Path $rootDir $Path
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; Write-Host '$Title' -ForegroundColor $Color; $Command"
    
    Start-Sleep -Seconds 2
}

# Start main services only (Preservation services commented out)
Start-ServiceWindow -Title "Main Backend API (Port 5000)" -Path "mern-app\server" -Command "npm start" -Color "Green"
Start-ServiceWindow -Title "Main Frontend (Port 5173+)" -Path "mern-app\client" -Command "npm run dev" -Color "Blue"

# Uncomment below to enable Preservation services
# Start-ServiceWindow -Title "Preservation Backend (Port 5002)" -Path "Monastery-Preservation\backend" -Command "npm start" -Color "Magenta"
# Start-ServiceWindow -Title "Preservation Frontend (Port 5174+)" -Path "Monastery-Preservation\frontend" -Command "npm run dev" -Color "Cyan"
# Start-ServiceWindow -Title "Python AI Service (Port 5001)" -Path "Monastery-Preservation\python-service" -Command "python app.py" -Color "Yellow"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ All Services Started!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor White
Write-Host "  📱 Main Portal:        http://localhost:5176/" -ForegroundColor Cyan
Write-Host "  � Main API:           http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  (Preservation services are disabled by default)" -ForegroundColor Gray
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor White
Write-Host "  Admin: admin@mpheritage.com / admin123" -ForegroundColor Yellow
Write-Host "  User:  user@mpheritage.com / user123" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
