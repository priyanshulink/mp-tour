# Install All Dependencies Script
# This script installs all Node.js dependencies for the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing All Project Dependencies  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$currentDir = Get-Location

# Function to install npm dependencies
function Install-NpmDependencies {
    param (
        [string]$path,
        [string]$name
    )
    
    Write-Host "Installing dependencies for: $name" -ForegroundColor Yellow
    Write-Host "Location: $path" -ForegroundColor Gray
    
    if (Test-Path $path) {
        Set-Location $path
        
        if (Test-Path "package.json") {
            Write-Host "  Running npm install..." -ForegroundColor Cyan
            npm install
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Successfully installed $name dependencies`n" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Failed to install $name dependencies`n" -ForegroundColor Red
            }
        } else {
            Write-Host "  ⚠️ No package.json found in $path`n" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ⚠️ Directory not found: $path`n" -ForegroundColor Yellow
    }
    
    Set-Location $currentDir
}

# Function to install Python dependencies
function Install-PythonDependencies {
    param (
        [string]$path,
        [string]$name
    )
    
    Write-Host "Installing Python dependencies for: $name" -ForegroundColor Yellow
    Write-Host "Location: $path" -ForegroundColor Gray
    
    if (Test-Path $path) {
        Set-Location $path
        
        if (Test-Path "requirements.txt") {
            Write-Host "  Running pip install..." -ForegroundColor Cyan
            pip install -r requirements.txt
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ✅ Successfully installed $name Python dependencies`n" -ForegroundColor Green
            } else {
                Write-Host "  ❌ Failed to install $name Python dependencies`n" -ForegroundColor Red
            }
        } else {
            Write-Host "  ⚠️ No requirements.txt found in $path`n" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ⚠️ Directory not found: $path`n" -ForegroundColor Yellow
    }
    
    Set-Location $currentDir
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MERN App - Server Dependencies       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Install-NpmDependencies -path "mern-app\server" -name "MERN App Server"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MERN App - Client Dependencies       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Install-NpmDependencies -path "mern-app\client" -name "MERN App Client"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Monastery Preservation - Backend     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Install-NpmDependencies -path "Monastery-Preservation\backend" -name "Monastery Backend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Monastery Preservation - Frontend    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Install-NpmDependencies -path "Monastery-Preservation\frontend" -name "Monastery Frontend"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Monastery Preservation - Python      " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Install-PythonDependencies -path "Monastery-Preservation\python-service" -name "Python AI Service"

Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installation Complete!               " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review and update .env files with your credentials" -ForegroundColor White
Write-Host "2. Run START_ALL_SERVICES.ps1 to start all services" -ForegroundColor White
Write-Host "3. Access the applications at http://localhost:5173" -ForegroundColor White
Write-Host ""

Set-Location $currentDir
