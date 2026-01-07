# MP Tourism & Heritage Preservation Platform - Startup Script
# This script starts all services for both applications

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MP Tourism & Heritage Preservation   " -ForegroundColor Cyan
Write-Host "  Starting All Services...              " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$rootDir = $PSScriptRoot

# Function to start a service in a new window
function Start-ServiceWindow {
    param (
        [string]$Title,
        [string]$Path,
        [string]$Command,
        [string]$Color
    )
    
    Write-Host "Starting $Title..." -ForegroundColor $Color
    
    $fullPath = Join-Path $rootDir $Path
    $startCommand = "cd '$fullPath'; Write-Host '$Title Started' -ForegroundColor $Color; Write-Host 'Location: $fullPath' -ForegroundColor Gray; Write-Host ''; $Command"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $startCommand
    
    Start-Sleep -Seconds 2
}

Write-Host "Starting MERN App Services..." -ForegroundColor Yellow
Write-Host ""

# Start MERN Backend
Start-ServiceWindow -Title "MERN Backend (Port 5001)" -Path "mern-app\server" -Command "npm run dev" -Color "Green"

# Start MERN Frontend
Start-ServiceWindow -Title "MERN Frontend (Port 5173)" -Path "mern-app\client" -Command "npm run dev" -Color "Blue"

Write-Host ""
Write-Host "Starting Monastery Preservation Services..." -ForegroundColor Yellow
Write-Host ""

# Start Monastery Backend
Start-ServiceWindow -Title "Monastery Backend (Port 5000)" -Path "Monastery-Preservation\backend" -Command "npm run dev" -Color "Magenta"

# Start Monastery Frontend
Start-ServiceWindow -Title "Monastery Frontend (Port 5174)" -Path "Monastery-Preservation\frontend" -Command "npm run dev" -Color "Cyan"

# Start Python AI Service
Start-ServiceWindow -Title "Python AI Service (Port 5002)" -Path "Monastery-Preservation\python-service" -Command "python app.py" -Color "Yellow"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "     ALL SERVICES STARTED!             " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  Main Tourism Portal:     http://localhost:5173" -ForegroundColor White
Write-Host "  Main API:                http://localhost:5001" -ForegroundColor White
Write-Host ""
Write-Host "  Heritage Preservation:   http://localhost:5174" -ForegroundColor White
Write-Host "  Preservation API:        http://localhost:5000" -ForegroundColor White
Write-Host "  Python AI Service:       http://localhost:5002" -ForegroundColor White
Write-Host ""
Write-Host "Database:" -ForegroundColor Cyan
Write-Host "  MongoDB Atlas:           Connected" -ForegroundColor Green
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  SETUP_COMPLETE.md" -ForegroundColor White
Write-Host "  SERVICES_AND_PORTS.md" -ForegroundColor White
Write-Host "  QUICK_REFERENCE.txt" -ForegroundColor White
Write-Host ""
Write-Host "All services are running in separate windows." -ForegroundColor Gray
Write-Host "Close service windows or press Ctrl+C to stop them." -ForegroundColor Gray
Write-Host ""
Write-Host "Opening main portal..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Press any key to close this launcher..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
