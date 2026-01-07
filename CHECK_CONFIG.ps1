# Quick Configuration Check Script
# Verifies all .env files are properly configured

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuration Verification           " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

function Check-EnvFile {
    param (
        [string]$path,
        [string]$name,
        [string[]]$requiredVars
    )
    
    Write-Host "Checking: $name" -ForegroundColor Yellow
    Write-Host "  Location: $path" -ForegroundColor Gray
    
    if (Test-Path $path) {
        Write-Host "  ✅ File exists" -ForegroundColor Green
        
        $content = Get-Content $path -Raw
        $missingVars = @()
        
        foreach ($var in $requiredVars) {
            if ($content -notmatch "$var=.+") {
                $missingVars += $var
            }
        }
        
        if ($missingVars.Count -eq 0) {
            Write-Host "  ✅ All required variables are set`n" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️ Missing or empty variables: $($missingVars -join ', ')" -ForegroundColor Yellow
            Write-Host "     Please update these in $path`n" -ForegroundColor Yellow
            $script:allGood = $false
        }
    } else {
        Write-Host "  ❌ File not found!`n" -ForegroundColor Red
        $script:allGood = $false
    }
}

# Check MERN App Server .env
Check-EnvFile -path "mern-app\server\.env" -name "MERN App Server" -requiredVars @(
    "MONGODB_URI",
    "PORT",
    "JWT_SECRET",
    "CLIENT_URL"
)

# Check MERN App Client .env
Check-EnvFile -path "mern-app\client\.env" -name "MERN App Client" -requiredVars @(
    "VITE_API_URL"
)

# Check Monastery Backend .env
Check-EnvFile -path "Monastery-Preservation\backend\.env" -name "Monastery Backend" -requiredVars @(
    "MONGODB_URI",
    "PORT",
    "PYTHON_SERVICE_URL"
)

# Check Monastery Frontend .env
Check-EnvFile -path "Monastery-Preservation\frontend\.env" -name "Monastery Frontend" -requiredVars @(
    "VITE_API_URL"
)

# Check Python Service .env
Check-EnvFile -path "Monastery-Preservation\python-service\.env" -name "Python AI Service" -requiredVars @(
    "PORT"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Dependencies Check                   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js installed: $nodeVersion`n" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js not found! Please install Node.js`n" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✅ npm installed: $npmVersion`n" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm not found!`n" -ForegroundColor Red
    $allGood = $false
}

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "  ✅ Python installed: $pythonVersion`n" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️ Python not found! Required for AI features`n" -ForegroundColor Yellow
}

# Check pip
Write-Host "Checking pip..." -ForegroundColor Yellow
try {
    $pipVersion = pip --version
    Write-Host "  ✅ pip installed: $pipVersion`n" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️ pip not found! Required for AI features`n" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Node Modules Check                   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$directories = @(
    @{Path="mern-app\server"; Name="MERN Server"},
    @{Path="mern-app\client"; Name="MERN Client"},
    @{Path="Monastery-Preservation\backend"; Name="Monastery Backend"},
    @{Path="Monastery-Preservation\frontend"; Name="Monastery Frontend"}
)

foreach ($dir in $directories) {
    Write-Host "Checking: $($dir.Name)" -ForegroundColor Yellow
    if (Test-Path "$($dir.Path)\node_modules") {
        Write-Host "  ✅ Dependencies installed`n" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ Dependencies not installed. Run INSTALL_DEPENDENCIES.ps1`n" -ForegroundColor Yellow
        $allGood = $false
    }
}

Write-Host "========================================" -ForegroundColor $(if ($allGood) { "Green" } else { "Yellow" })
if ($allGood) {
    Write-Host "  ✅ All checks passed!                " -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You're ready to start the services!" -ForegroundColor Green
    Write-Host "Run: .\START_ALL_SERVICES.ps1" -ForegroundColor Cyan
} else {
    Write-Host "  ⚠️ Some issues need attention        " -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please fix the issues above before starting services." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Cyan
    Write-Host "  1. Run INSTALL_DEPENDENCIES.ps1 to install packages" -ForegroundColor White
    Write-Host "  2. Update .env files with your credentials" -ForegroundColor White
    Write-Host "  3. Ensure Node.js and Python are installed" -ForegroundColor White
}
Write-Host ""
