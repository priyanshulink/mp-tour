# Madhya Pradesh Heritage Preservation Project

A comprehensive digital heritage platform for Madhya Pradesh's temples and monuments, combining a public-facing web portal with advanced AI-powered preservation tools.

This repository contains two main applications:

1. **[Explore MP Portal (mern-app)](./mern-app)**: A full-stack MERN application for virtual tours, events, and community stories.
2. **[Preservation System (Monastery-Preservation)](./Monastery-Preservation)**: An AI-driven image comparison system for structural health monitoring.

---

## 📂 Project Structure

```
MP-Heritage-Tourism/
├── mern-app/                 # Main User Portal (MERN Stack)
│   ├── client/               # React Frontend
│   └── server/               # Node.js Backend
│
└── Monastery-Preservation/   # Technical Preservation System
    ├── frontend/             # React Evaluation UI
    ├── backend/              # Node.js API
    └── python-service/       # AI/OpenCV Analysis Engine
```

---

## 🌟 Application Overviews

### 1. Have-In-Sikkim Portal (`mern-app`)

The primary interface for tourists, pilgrims, and researchers.

- **key Features:**
  - 🏰 **Virtual Tours:** 360° immersive experiences of monasteries.
  - 📅 **Events Calendar:** Track festivals and ceremonies.
  - 🤖 **AI Chatbot:** Gemini-powered assistant for heritage queries.
  - 🎒 **Itinerary Planner:** Custom travel planning tools.
  - 👥 **Community:** Share stories, photos, and videos.

[👉 View Full Documentation](./mern-app/README.md)

### 2. Preservation System (`Monastery-Preservation`)

A specialized tool for conservators and authorities to monitor physical changes in monastery structures.

- **Key Features:**
  - 🔍 **AI Structural Analysis:** Detects cracks and changes using OpenCV & SSIM.
  - 📊 **Difference Visualization:** Heatmaps and annotated comparison images.
  - �️ **Secure Storage:** Private artifact documentation in MongoDB GridFS.
  - 📑 **Report Generation:** Automated assessment reports.

[👉 View Full Documentation](./Monastery-Preservation/README.md)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (v5.0+)
- Python (v3.8+) (for Preservation System)

### Running the User Portal (`mern-app`)

```bash
# Terminal 1: Backend
cd mern-app/server
npm install
npm run dev

# Terminal 2: Frontend
cd mern-app/client
npm install
npm run dev
```

### Running the Preservation System (`Monastery-Preservation`)

```bash
# Terminal 1: Backend
cd Monastery-Preservation/backend
npm install
npm run dev

# Terminal 2: Python Engine
cd Monastery-Preservation/python-service
pip install -r requirements.txt
python app.py

# Terminal 3: Frontend
cd Monastery-Preservation/frontend
npm install
npm run dev
```

---

## 🤝 Contributing

We welcome contributions to help preserve Madhya Pradesh's rich cultural heritage! Please check the individual directories for specific contribution guidelines.

## 📄 License

This project is licensed under the MIT License.
