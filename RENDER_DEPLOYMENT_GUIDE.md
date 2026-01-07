# 🚀 Deploying MP Tourism Platform to Render

## Overview
This guide covers deploying both the **backend API** and **frontend client** to Render.

---

## 📋 Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **Render Account** - Sign up at https://render.com
3. **MongoDB Atlas** - Already configured ✅
4. **Environment Variables** - Ready in .env files

---

## 🔧 PART 1: Prepare Your Project

### Step 1: Create Production Build Scripts

The project needs slight modifications for production deployment.

#### Update Backend package.json

Already has the necessary scripts, but verify:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

#### Update Frontend package.json

Already configured with build script:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Create .gitignore (if not exists)

Ensure these are in your `.gitignore`:
```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
```

### Step 3: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create GitHub repository and push
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

---

## 🖥️ PART 2: Deploy Backend to Render

### Step 1: Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### Step 2: Configure Backend Service

**Basic Settings:**
- **Name:** `mp-tourism-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `mern-app/server`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **Free** tier (or paid for production)

### Step 3: Add Environment Variables

Click **"Environment"** tab and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://ompriyanshu12_db_user:D98W4Z0ptmQgMyna@cluster0.l1w91pk.mongodb.net/myapp?retryWrites=true&w=majority
JWT_SECRET=bvVO197CTtKwX4kpgSZyxmFcfhBEDIeJoAH5jd0urPLWUiYlnz3MqaQG28R6Ns
CLIENT_URL=https://YOUR-FRONTEND-URL.onrender.com
GEMINI_API_KEY=AIzaSyCSOO_yYYtN6C17HIvs7ne2nD3CQJDud1M
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
```

**Important:** Update `CLIENT_URL` after deploying frontend!

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://mp-tourism-backend.onrender.com`

---

## 🎨 PART 3: Deploy Frontend to Render

### Step 1: Create Static Site

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Select your repository

### Step 2: Configure Frontend Service

**Basic Settings:**
- **Name:** `mp-tourism-frontend`
- **Branch:** `main`
- **Root Directory:** `mern-app/client`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### Step 3: Add Environment Variables

Click **"Environment"** tab:

```
VITE_API_URL=https://mp-tourism-backend.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Important:** Use your actual backend URL from Step 2.4!

### Step 4: Configure Redirects

Create `mern-app/client/public/_redirects` file:

```
/*    /index.html   200
```

This enables React Router to work properly.

### Step 5: Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for build (5-10 minutes)
3. Your frontend URL: `https://mp-tourism-frontend.onrender.com`

---

## 🔄 PART 4: Update Backend with Frontend URL

### Step 1: Update Backend Environment

1. Go to your **Backend Service** on Render
2. Navigate to **Environment** tab
3. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://mp-tourism-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

---

## 🗄️ PART 5: Deploy Monastery Preservation (Optional)

### Backend Service

**Settings:**
- **Name:** `monastery-preservation-backend`
- **Root Directory:** `Monastery-Preservation/backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://ompriyanshu12_db_user:D98W4Z0ptmQgMyna@cluster0.l1w91pk.mongodb.net/myapp?retryWrites=true&w=majority
PYTHON_SERVICE_URL=https://monastery-python-service.onrender.com
CLIENT_URL=https://monastery-frontend.onrender.com
```

### Frontend Static Site

**Settings:**
- **Name:** `monastery-frontend`
- **Root Directory:** `Monastery-Preservation/frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

**Environment:**
```
VITE_API_URL=https://monastery-preservation-backend.onrender.com
```

### Python Service

**Settings:**
- **Name:** `monastery-python-service`
- **Root Directory:** `Monastery-Preservation/python-service`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `python app.py`

**Environment:**
```
PORT=10000
MAX_IMAGE_SIZE=10485760
ALLOWED_EXTENSIONS=jpg,jpeg,png,webp
FLASK_ENV=production
```

---

## ✅ PART 6: Verification & Testing

### Step 1: Check Deployments

1. **Backend Health Check:**
   ```
   https://mp-tourism-backend.onrender.com/health
   ```
   Should return: `{"status": "OK"}`

2. **Frontend:**
   ```
   https://mp-tourism-frontend.onrender.com
   ```
   Should load the homepage

### Step 2: Test Core Features

- ✅ User login (admin@mpheritage.com / admin123)
- ✅ Browse properties
- ✅ View property details
- ✅ Chatbot (if API key is working)
- ✅ Booking flow

### Step 3: Check Logs

If issues occur:
1. Go to Render Dashboard
2. Select your service
3. Click **"Logs"** tab
4. Check for errors

---

## 🔧 Common Issues & Solutions

### Issue 1: CORS Errors

**Solution:** Ensure `CLIENT_URL` in backend matches your frontend URL exactly (no trailing slash).

### Issue 2: 404 on Frontend Routes

**Solution:** Create `_redirects` file in `public/` folder:
```
/*    /index.html   200
```

### Issue 3: Backend Not Connecting to MongoDB

**Solution:** 
- Whitelist Render IPs in MongoDB Atlas (or use `0.0.0.0/0` for all IPs)
- Verify `MONGODB_URI` is correct

### Issue 4: Images Not Loading

**Solution:** Images must be in the `public` folder. Update paths to use absolute URLs if needed.

### Issue 5: Free Tier Sleep Mode

**Problem:** Free tier services sleep after 15 minutes of inactivity.

**Solution:**
- First request takes 30-60 seconds to wake up
- Upgrade to paid tier for always-on service
- Use a service like Uptime Robot to ping every 10 minutes

---

## 💰 Cost Estimate

### Free Tier (Limited)
- **Backend Web Service:** Free (750 hours/month)
- **Frontend Static Site:** Free (100 GB bandwidth)
- **Limitations:** 
  - Services sleep after 15 min inactivity
  - Limited to 512 MB RAM
  - Shared CPU

### Paid Tier (Recommended for Production)
- **Backend (Starter):** $7/month
  - Always-on
  - 512 MB RAM
  - Dedicated CPU

- **Frontend:** Free
- **Database (MongoDB Atlas):** $0 (shared M0) or $9/month (M10)

**Total:** $7-16/month for production-ready setup

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas configured
- [ ] Environment variables prepared
- [ ] Payment method added (for paid tiers)

### Backend Deployment
- [ ] Web service created
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Health endpoint tested

### Frontend Deployment
- [ ] Static site created
- [ ] Build command configured
- [ ] _redirects file added
- [ ] Environment variables set
- [ ] Site deployed successfully

### Post-Deployment
- [ ] Backend CLIENT_URL updated
- [ ] Frontend URL tested
- [ ] Login functionality verified
- [ ] API endpoints working
- [ ] Database connection verified
- [ ] Images loading correctly

---

## 📚 Additional Resources

- **Render Documentation:** https://render.com/docs
- **Deploying Node.js:** https://render.com/docs/deploy-node-express-app
- **Deploying React:** https://render.com/docs/deploy-create-react-app
- **Environment Variables:** https://render.com/docs/environment-variables
- **Custom Domains:** https://render.com/docs/custom-domains

---

## 🎉 Success!

Once deployed, your URLs will be:
- **Frontend:** `https://mp-tourism-frontend.onrender.com`
- **Backend API:** `https://mp-tourism-backend.onrender.com`
- **Admin Dashboard:** `https://mp-tourism-frontend.onrender.com/dashboard`

**Default Login:**
- Email: admin@mpheritage.com
- Password: admin123

---

## 🔄 Continuous Deployment

Render automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Render automatically detects and redeploys!
```

---

## 💡 Pro Tips

1. **Use Environment Groups** - Manage shared env vars across services
2. **Enable Auto-Deploy** - Auto-deploy on git push (enabled by default)
3. **Monitor Logs** - Check logs regularly for errors
4. **Set Up Alerts** - Configure email alerts for deployment failures
5. **Use Preview Deployments** - Test changes before merging to main
6. **Custom Domain** - Add your own domain in Render settings
7. **Database Backups** - Enable MongoDB Atlas backups

---

**Need Help?** Check Render's support or the documentation links above!
