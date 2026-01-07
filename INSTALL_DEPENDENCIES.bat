@echo off
echo ========================================
echo   Installing All Project Dependencies
echo ========================================
echo.

REM MERN App Server
echo Installing MERN App Server dependencies...
cd mern-app\server
if exist package.json (
    call npm install
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] MERN App Server dependencies installed
    ) else (
        echo [ERROR] Failed to install MERN App Server dependencies
    )
) else (
    echo [WARNING] No package.json found in mern-app\server
)
cd ..\..
echo.

REM MERN App Client
echo Installing MERN App Client dependencies...
cd mern-app\client
if exist package.json (
    call npm install
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] MERN App Client dependencies installed
    ) else (
        echo [ERROR] Failed to install MERN App Client dependencies
    )
) else (
    echo [WARNING] No package.json found in mern-app\client
)
cd ..\..
echo.

REM Monastery Backend
echo Installing Monastery Preservation Backend dependencies...
cd Monastery-Preservation\backend
if exist package.json (
    call npm install
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Monastery Backend dependencies installed
    ) else (
        echo [ERROR] Failed to install Monastery Backend dependencies
    )
) else (
    echo [WARNING] No package.json found in Monastery-Preservation\backend
)
cd ..\..
echo.

REM Monastery Frontend
echo Installing Monastery Preservation Frontend dependencies...
cd Monastery-Preservation\frontend
if exist package.json (
    call npm install
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Monastery Frontend dependencies installed
    ) else (
        echo [ERROR] Failed to install Monastery Frontend dependencies
    )
) else (
    echo [WARNING] No package.json found in Monastery-Preservation\frontend
)
cd ..\..
echo.

REM Python Service
echo Installing Python AI Service dependencies...
cd Monastery-Preservation\python-service
if exist requirements.txt (
    pip install -r requirements.txt
    if %ERRORLEVEL% EQU 0 (
        echo [SUCCESS] Python dependencies installed
    ) else (
        echo [ERROR] Failed to install Python dependencies
    )
) else (
    echo [WARNING] No requirements.txt found in Monastery-Preservation\python-service
)
cd ..\..
echo.

echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Review and update .env files with your credentials
echo 2. Run START_ALL_SERVICES.bat to start all services
echo 3. Access the applications at http://localhost:5173
echo.
pause
