# 🌐 Services and Ports Configuration

## Port Assignments

| Service | Port | URL | Status |
|---------|------|-----|--------|
| **MERN App Frontend** | 5173 | http://localhost:5173 | Main tourism portal |
| **MERN App Backend** | 5001 | http://localhost:5001 | Main API server |
| **Monastery Frontend** | 5174 | http://localhost:5174 | Heritage preservation UI |
| **Monastery Backend** | 5000 | http://localhost:5000 | Heritage preservation API |
| **Python AI Service** | 5002 | http://localhost:5002 | Image processing service |

## Database Configuration

**MongoDB Atlas Connection:**
```
mongodb+srv://ompriyanshu12_db_user:D98W4Z0ptmQgMyna@cluster0.l1w91pk.mongodb.net/myapp?retryWrites=true&w=majority
```

**Database Name:** `myapp`

## Service Dependencies

### MERN App Backend (Port 5001)
- **Requires:** MongoDB
- **Environment Variables:**
  - `MONGODB_URI` ✅ Configured
  - `PORT=5001` ✅ Configured
  - `JWT_SECRET` ⚠️ Needs update
  - `CLIENT_URL=http://localhost:5173` ✅ Configured
  - `RAZORPAY_KEY_ID` ⚠️ Needs configuration
  - `RAZORPAY_KEY_SECRET` ⚠️ Needs configuration
  - `OPENAI_API_KEY` ⚠️ Optional
  - `EMAIL_USER` ⚠️ Needs configuration
  - `EMAIL_PASS` ⚠️ Needs configuration

### MERN App Frontend (Port 5173)
- **Requires:** MERN Backend (5001)
- **Environment Variables:**
  - `VITE_API_URL=http://localhost:5001` ✅ Configured
  - `VITE_RAZORPAY_KEY_ID` ⚠️ Needs configuration

### Monastery Backend (Port 5000)
- **Requires:** MongoDB, Python Service (5002)
- **Environment Variables:**
  - `MONGODB_URI` ✅ Configured
  - `PORT=5000` ✅ Configured
  - `PYTHON_SERVICE_URL=http://localhost:5002` ✅ Configured
  - `CLIENT_URL=http://localhost:5173` ✅ Configured

### Monastery Frontend (Port 5174)
- **Requires:** Monastery Backend (5000)
- **Environment Variables:**
  - `VITE_API_URL=http://localhost:5000` ✅ Configured

### Python AI Service (Port 5002)
- **Requires:** Python 3.8+, OpenCV, scikit-image
- **Environment Variables:**
  - `PORT=5002` ✅ Configured
  - `MAX_IMAGE_SIZE=10485760` ✅ Configured
  - `ALLOWED_EXTENSIONS=jpg,jpeg,png,webp` ✅ Configured

## Service Start Order

For best results, start services in this order:

1. **MongoDB** (Already running on Atlas)
2. **MERN App Backend** (5001)
3. **Python AI Service** (5002)
4. **Monastery Backend** (5000)
5. **MERN App Frontend** (5173)
6. **Monastery Frontend** (5174)

## Health Check Endpoints

Test if services are running:

```powershell
# MERN Backend
curl http://localhost:5001/api/health

# Monastery Backend
curl http://localhost:5000/health

# Python Service
curl http://localhost:5002/health

# MERN Frontend
Start-Process http://localhost:5173

# Monastery Frontend
Start-Process http://localhost:5174
```

## Common Issues and Solutions

### Port Already in Use
```powershell
# Find process using a port (e.g., 5001)
netstat -ano | findstr :5001

# Kill the process (use PID from above)
taskkill /PID <PID> /F
```

### MongoDB Connection Issues
- Ensure IP whitelist includes your current IP in MongoDB Atlas
- Check internet connection
- Verify connection string is correct

### Python Service Not Starting
```powershell
# Check Python installation
python --version

# Install/reinstall dependencies
cd Monastery-Preservation\python-service
pip install -r requirements.txt
```

### CORS Errors
- Verify `CLIENT_URL` in backend .env files matches frontend ports
- Check CORS configuration in backend app.js/server.js files

## API Endpoints Overview

### MERN App Backend (5001)
- `/api/auth/*` - Authentication
- `/api/events/*` - Events management
- `/api/stories/*` - Story sharing
- `/api/itinerary/*` - Trip planning
- `/api/properties/*` - Homestay properties
- `/api/bookings/*` - Booking management
- `/api/payments/*` - Payment processing
- `/api/chatbot/*` - AI chatbot
- `/api/admin/*` - Admin functions

### Monastery Backend (5000)
- `/api/images/*` - Image upload/retrieval
- `/api/comparisons/*` - Image comparisons
- `/health` - Health check

### Python Service (5002)
- `/api/compare` - Compare two images (SSIM)
- `/health` - Health check

## Next Steps

1. ✅ All configuration files created
2. ⚠️ Install dependencies: `.\INSTALL_DEPENDENCIES.ps1`
3. ⚠️ Update API keys in .env files
4. ⚠️ Start services: `.\START_ALL_SERVICES.ps1`
5. ⚠️ Test endpoints and functionality

## Configuration Checklist

- [x] MongoDB connection string configured
- [x] All .env files created
- [x] Ports assigned (no conflicts)
- [x] Service dependencies mapped
- [ ] Install Node.js dependencies
- [ ] Install Python dependencies
- [ ] Configure JWT secret
- [ ] Configure Razorpay keys
- [ ] Configure email service
- [ ] Configure OpenAI API (optional)
- [ ] Test all services

## Support

Run configuration check:
```powershell
.\CHECK_CONFIG.ps1
```

For detailed setup instructions:
```powershell
Get-Content INSTALLATION_GUIDE.md
Get-Content SETUP_COMPLETE.md
```
