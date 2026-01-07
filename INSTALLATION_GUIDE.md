# Installation and Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Python 3.8+ (for Monastery Preservation AI features)

## Quick Start

### 1. Install Dependencies

#### MERN App
```bash
# Install server dependencies
cd mern-app/server
npm install

# Install client dependencies
cd ../client
npm install
```

#### Monastery Preservation
```bash
# Install backend dependencies
cd Monastery-Preservation/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install Python dependencies
cd ../python-service
pip install -r requirements.txt
```

### 2. Environment Configuration

All `.env` files have been created with the MongoDB connection string. Update the following values:

#### mern-app/server/.env
- `JWT_SECRET`: Change to a secure random string
- `EMAIL_USER` and `EMAIL_PASS`: Add your email credentials for nodemailer
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`: Add your Razorpay credentials
- `OPENAI_API_KEY`: Add your OpenAI API key for chatbot features

#### mern-app/client/.env
- `VITE_RAZORPAY_KEY_ID`: Add your Razorpay public key

### 3. Start Services

#### Option 1: Use the PowerShell script
```bash
.\START_ALL_SERVICES.ps1
```

#### Option 2: Manual start

##### MERN App
```bash
# Terminal 1 - Server
cd mern-app/server
npm run dev

# Terminal 2 - Client
cd mern-app/client
npm run dev
```

##### Monastery Preservation
```bash
# Terminal 3 - Backend
cd Monastery-Preservation/backend
npm run dev

# Terminal 4 - Frontend
cd Monastery-Preservation/frontend
npm run dev

# Terminal 5 - Python Service
cd Monastery-Preservation/python-service
python app.py
```

### 4. Access the Applications

- **MERN App Frontend**: http://localhost:5173
- **MERN App Backend**: http://localhost:5001
- **Monastery Preservation Frontend**: http://localhost:5173 (different project)
- **Monastery Preservation Backend**: http://localhost:5000
- **Python AI Service**: http://localhost:5001

### 5. Seed Database (Optional)

```bash
cd mern-app/server
node seed.js
node seedProperties.js
```

## Troubleshooting

### Port Conflicts
If you encounter port conflicts, modify the PORT values in the respective `.env` files.

### MongoDB Connection Issues
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check that the connection string is correct
- Verify network connectivity

### Missing Dependencies
Run `npm install` in each directory if you encounter module not found errors.

## Project Structure

- `mern-app/`: Main tourism and heritage portal
  - `client/`: React frontend
  - `server/`: Express backend

- `Monastery-Preservation/`: AI-powered monastery preservation system
  - `frontend/`: React frontend
  - `backend/`: Express backend with GridFS
  - `python-service/`: Flask service for image processing

## Next Steps

1. Configure payment gateway (Razorpay)
2. Set up email service (Nodemailer)
3. Configure OpenAI API for chatbot
4. Test all features
5. Deploy to production

For detailed documentation, refer to:
- `README.md`
- `HOMESTAY_BOOKING_SYSTEM_DOCUMENTATION.md`
- `PRESERVATION_AI_GUIDE.md`
