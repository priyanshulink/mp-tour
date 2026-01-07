# 🚀 MP Tourism and Heritage Preservation Platform

Complete MERN stack platform for Madhya Pradesh tourism with AI-powered heritage preservation.

## ✅ Setup Complete!

All configuration files have been created with your MongoDB connection:
```
mongodb+srv://ompriyanshu12_db_user:D98W4Z0ptmQgMyna@cluster0.l1w91pk.mongodb.net/myapp
```

## 📋 Quick Start

### 1️⃣ Install All Dependencies
```powershell
# PowerShell
.\INSTALL_DEPENDENCIES.ps1

# Or CMD
INSTALL_DEPENDENCIES.bat
```

### 2️⃣ Configure Credentials
Update the following in `mern-app/server/.env`:
- `JWT_SECRET` - Set a secure secret key
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` - For payments
- `OPENAI_API_KEY` - For chatbot features (optional)
- `EMAIL_USER` and `EMAIL_PASS` - For email notifications

### 3️⃣ Verify Configuration
```powershell
.\CHECK_CONFIG.ps1
```

### 4️⃣ Start All Services
```powershell
.\START_ALL_SERVICES.ps1
```

## 🌐 Access Points

After starting services:

| Service | URL | Description |
|---------|-----|-------------|
| **Main App** | http://localhost:5173 | Tourism portal frontend |
| **Main API** | http://localhost:5001 | Backend API |
| **Preservation App** | http://localhost:5174 | Heritage AI frontend |
| **Preservation API** | http://localhost:5000 | Heritage AI backend |
| **Python AI Service** | http://localhost:5001 | Image processing |

## 📁 Project Structure

```
MP-Tourism-and-heritage-preservation-main/
├── mern-app/                          # Main tourism platform
│   ├── client/                        # React frontend
│   │   └── .env                       # ✅ Created
│   └── server/                        # Express backend
│       ├── .env                       # ✅ Created
│       ├── config/
│       │   └── database.js            # ✅ Created
│       └── uploads/                   # Upload directory
│
├── Monastery-Preservation/            # AI heritage system
│   ├── frontend/                      # React frontend
│   │   └── .env                       # ✅ Created
│   ├── backend/                       # Express + GridFS
│   │   └── .env                       # ✅ Created
│   └── python-service/                # Flask AI service
│       └── .env                       # ✅ Created
│
├── INSTALL_DEPENDENCIES.ps1           # ✅ Created - Install script
├── CHECK_CONFIG.ps1                   # ✅ Created - Config checker
└── INSTALLATION_GUIDE.md              # ✅ Created - Full guide
```

## 🔧 What Was Created

### Configuration Files (.env)
✅ `mern-app/server/.env` - Main backend config with MongoDB  
✅ `mern-app/client/.env` - Main frontend config  
✅ `Monastery-Preservation/backend/.env` - Preservation backend  
✅ `Monastery-Preservation/frontend/.env` - Preservation frontend  
✅ `Monastery-Preservation/python-service/.env` - Python AI service  

### Database & Config
✅ `mern-app/server/config/database.js` - MongoDB connection handler  
✅ `mern-app/server/uploads/.gitkeep` - Uploads directory marker  
✅ `mern-app/.gitignore` - Git ignore rules  

### Setup Scripts
✅ `INSTALL_DEPENDENCIES.ps1` - PowerShell install script  
✅ `INSTALL_DEPENDENCIES.bat` - Batch install script  
✅ `CHECK_CONFIG.ps1` - Configuration verification  
✅ `INSTALLATION_GUIDE.md` - Complete setup guide  

### Port Configuration
✅ Fixed vite.config.js proxy to point to correct backend port (5001)

## 🔐 Security Notes

**Important**: Update these values in `.env` files before deploying:

1. **JWT_SECRET** - Generate a strong secret:
   ```javascript
   require('crypto').randomBytes(64).toString('hex')
   ```

2. **Database Password** - Already configured with your provided connection

3. **API Keys** - Add your actual keys:
   - Razorpay (payment gateway)
   - OpenAI (chatbot)
   - Email service credentials

## 📦 Features

### Main Tourism Platform
- 🏛️ Heritage site exploration
- 🏠 Homestay booking system
- 📅 Event management
- 💰 Payment integration (Razorpay)
- 🤖 AI chatbot
- 📊 Analytics dashboard
- ✉️ Email notifications

### Heritage Preservation System
- 📸 Image upload and storage (GridFS)
- 🔍 AI-powered image comparison (SSIM)
- 📈 Degradation detection
- 📊 Before/after analysis
- 🗄️ Heritage documentation

## 🛠️ Tech Stack

**Frontend**: React 18, Vite, React Router  
**Backend**: Node.js, Express, MongoDB  
**AI Service**: Python, Flask, OpenCV, scikit-image  
**Storage**: MongoDB + GridFS  
**Payments**: Razorpay  
**Authentication**: JWT  

## 📚 Documentation

- `INSTALLATION_GUIDE.md` - Detailed setup instructions
- `HOMESTAY_BOOKING_SYSTEM_DOCUMENTATION.md` - Booking system guide
- `PRESERVATION_AI_GUIDE.md` - AI features documentation
- `README_STARTUP.md` - Original startup guide

## 🐛 Troubleshooting

### Port Already in Use
Change ports in respective `.env` files

### MongoDB Connection Failed
- Verify connection string
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

### Dependencies Not Installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -r node_modules
npm install
```

### Python Service Issues
```bash
# Ensure Python 3.8+ installed
python --version

# Install dependencies
pip install -r requirements.txt
```

## 📞 Support

For issues or questions, refer to:
1. Check `CHECK_CONFIG.ps1` output
2. Review `INSTALLATION_GUIDE.md`
3. Check service status in `SERVICES_RUNNING_STATUS.md`

## 🎉 Ready to Go!

All files are created and configured. Follow the Quick Start steps above to begin!

```powershell
# 1. Install dependencies
.\INSTALL_DEPENDENCIES.ps1

# 2. Check configuration
.\CHECK_CONFIG.ps1

# 3. Start services
.\START_ALL_SERVICES.ps1
```

**Happy Coding! 🚀**
