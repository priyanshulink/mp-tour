@echo off
REM MP Tourism Hackathon - Start All Services (Batch Version)
REM This script starts all required services for the application

echo =====================================
echo   MP Heritage Tourism Platform
echo   Starting All Services...
echo =====================================
echo.

REM Start Main Backend API
echo Starting Main Backend API...
start "Main Backend API (Port 5000)" cmd /k "cd mern-app\server && npm start"
timeout /t 3 /nobreak >nul

REM Start Main Frontend
echo Starting Main Frontend...
start "Main Frontend (Port 5173+)" cmd /k "cd mern-app\client && npm run dev"
timeout /t 3 /nobreak >nul

REM Preservation services are commented out - uncomment to enable
REM REM Start Preservation Backend
REM echo Starting Preservation Backend...
REM start "Preservation Backend (Port 5002)" cmd /k "cd Monastery-Preservation\backend && npm start"
REM timeout /t 3 /nobreak >nul

REM REM Start Preservation Frontend
REM echo Starting Preservation Frontend...
REM start "Preservation Frontend (Port 5174+)" cmd /k "cd Monastery-Preservation\frontend && npm run dev"
REM timeout /t 3 /nobreak >nul

REM REM Start Python AI Service
REM echo Starting Python AI Service...
REM start "Python AI Service (Port 5001)" cmd /k "cd Monastery-Preservation\python-service && python app.py"

echo.
echo =====================================
echo All Services Started!
echo =====================================
echo.
echo Services:
echo   Main Portal:        http://localhost:5176/
echo   Main API:           http://localhost:5000
echo.
echo   (Preservation services are disabled by default)
echo.
echo Test Credentials:
echo   Admin: admin@mpheritage.com / admin123
echo   User:  user@mpheritage.com / user123
echo.
pause
