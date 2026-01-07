# 🚀 Quick Start Guide

## Starting All Services

### Option 1: PowerShell Script (Recommended)
```powershell
.\start-all-services.ps1
```

### Option 2: Batch File
```cmd
start-all-services.bat
```

### Option 3: Manual Start (PowerShell)
```powershell
# Terminal 1 - Main Backend
cd mern-app\server
npm start

# Terminal 2 - Main Frontend
cd mern-app\client
npm run dev

# Terminal 3 - Preservation Backend
cd Monastery-Preservation\backend
npm start

# Terminal 4 - Preservation Frontend
cd Monastery-Preservation\frontend
npm run dev

# Terminal 5 - Python AI Service
cd Monastery-Preservation\python-service
python app.py
```

## 🌐 Service URLs

| Service | URL | Port |
|---------|-----|------|
| Main Portal | http://localhost:5176/ | 5176 |
| Preservation System | http://localhost:5174/ | 5174 |
| Main Backend API | http://localhost:5000 | 5000 |
| Preservation API | http://localhost:5002 | 5002 |
| Python AI Service | http://localhost:5001 | 5001 |

## 🔑 Test Credentials

**Admin Account:**
- Email: admin@mpheritage.com
- Password: admin123

**User Account:**
- Email: user@mpheritage.com
- Password: user123

## 📝 Notes

- Each service runs in a separate window
- Services start with 2-3 second delays to ensure proper initialization
- If a port is already in use, Vite will automatically try the next available port
- MongoDB must be running on `mongodb://localhost:27017`
- Python 3.x must be installed for the AI service

## 🛑 Stopping Services

Close each terminal window or press `Ctrl+C` in each terminal to stop the services.

## 🔧 Troubleshooting

**Port Already in Use:**
- Check if services are already running
- Kill processes using the ports: `netstat -ano | findstr :5000`
- Change port in respective `.env` files

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env` files

**Python Service Error:**
- Install dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (requires 3.7+)

**Module Not Found:**
- Run `npm install` in each directory with a `package.json`
- For Python: `pip install -r requirements.txt`
