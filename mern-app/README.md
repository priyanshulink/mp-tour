# Explore MP - Full Stack MERN Application

A complete MERN stack application for exploring and preserving Madhya Pradesh's rich cultural heritage. Features include virtual tours, AI chatbot, user contributions, admin moderation, and travel itinerary planning.

## 🚀 Features

### Public Features
- **Interactive Monastery Listings** - Browse and filter monasteries by sect
- **Virtual 360° Tours** - Immersive monastery exploration
- **Events Calendar** - Upcoming monastery festivals and ceremonies
- **AI Chatbot** - Google Gemini-powered heritage assistant
- **Travel Itinerary Planner** - Generate custom monastery tour plans

### User Features (Authenticated)
- **Share Experiences** - Upload stories, photos, and videos
- **Personal Dashboard** - Track contributions and status
- **Saved Itineraries** - Create and manage travel plans

### Admin Features
- **Content Moderation** - Approve/reject user submissions
- **Event Management** - Create and manage monastery events
- **Analytics Dashboard** - View platform statistics
- **User Management** - Monitor user activity

## 📋 Tech Stack

### Frontend
- React 18
- React Router DOM (for navigation)
- Axios (API calls)
- Context API (state management)
- Vite (build tool)

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt (password hashing)
- Multer (file uploads)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (v5.0+)
- npm or yarn

### 1. Clone Repository
```bash
cd mern-app
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/monastery_heritage
JWT_SECRET=monastery_secret_key_2025_sikkim_heritage_portal
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Seed the database with demo users:
```bash
node seed.js
```

Start backend server:
```bash
npm run dev
```
Backend runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Start frontend development server:
```bash
npm run dev
```
Frontend runs on **http://localhost:5173**

## 🔐 Demo Credentials

| Role  | Email                    | Password  | Access               |
|-------|--------------------------|-----------|----------------------|
| Admin | admin@mpheritage.com     | admin123  | Full admin access   |
| User  | user@mpheritage.com      | user123   | User dashboard only |

## 📂 Project Structure

```
mern-app/
├── server/                    # Backend (Node.js + Express)
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Story.js
│   │   └── Itinerary.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── storyRoutes.js
│   │   ├── itineraryRoutes.js
│   │   ├── chatbotRoutes.js
│   │   └── analyticsRoutes.js
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth & upload middleware
│   ├── uploads/              # File uploads storage
│   ├── app.js                # Express app
│   ├── seed.js               # Database seeder
│   ├── package.json
│   └── .env
│
├── client/                   # Frontend (React + Vite)
│   ├── public/               # Static assets
│   │   ├── img/             # Images
│   │   └── video/           # Videos
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Monasteries.jsx
│   │   │   ├── VirtualTours.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Itinerary.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/         # Auth context
│   │   │   └── AuthContext.jsx
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   ├── styles/          # CSS files
│   │   │   └── style.css
│   │   ├── App.jsx          # Main app with routes
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `GET /api/auth/users` - Get all users (Admin)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin)
- `DELETE /api/events/:id` - Delete event (Admin)

### Stories (User Contributions)
- `GET /api/stories` - Get all approved stories
- `GET /api/stories/my-stories` - Get user's stories
- `POST /api/stories` - Create story
- `PUT /api/stories/:id/moderate` - Moderate story (Admin)
- `DELETE /api/stories/:id` - Delete story

### Itinerary
- `POST /api/itinerary/generate` - Generate itinerary
- `GET /api/itinerary/my-itineraries` - Get user's itineraries
- `GET /api/itinerary/:id` - Get single itinerary
- `DELETE /api/itinerary/:id` - Delete itinerary

### Chatbot
- `POST /api/chatbot/chat` - Chat with AI
- `POST /api/chatbot/analyze-image` - Analyze image

### Analytics
- `GET /api/analytics/dashboard` - Admin dashboard stats
- `GET /api/analytics/user-stats` - User statistics

## 🔒 Authentication Flow

1. User logs in with email/password
2. Backend validates credentials and generates JWT token
3. Token stored in localStorage on client
4. Token sent with every API request in Authorization header
5. Backend middleware verifies token on protected routes
6. Routes protected based on role (User/Admin)

## 🎨 Features Implementation

### Protected Routes
- Routes wrapped with `<ProtectedRoute>` component
- Automatically redirects to login if not authenticated
- Admin routes check for Admin role

### File Uploads
- Multer handles multipart/form-data
- Files stored in `/server/uploads/`
- Supports images and videos up to 50MB

### State Management
- Auth context manages user state globally
- JWT token persists in localStorage
- Auto-refresh user data on app load

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile
- Flexbox and Grid layouts

## 🚀 Running in Production

### Build Frontend
```bash
cd client
npm run build
```

### Serve Static Files
Update `server/app.js` to serve React build:
```javascript
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
```

### Start Production Server
```bash
cd server
NODE_ENV=production npm start
```

## 🔧 Configuration

### Google Gemini API (Optional)
To enable AI chatbot:
1. Get API key from Google AI Studio
2. Add to `server/.env`: `GEMINI_API_KEY=your_key`
3. Implement Gemini API in `chatbotController.js`

### Google Maps (Optional)
To enable interactive map:
1. Get Google Maps API key
2. Add Maps JavaScript API script to `client/index.html`
3. Implement map in `Home.jsx`

## 📝 Notes

- Default MongoDB connection: `mongodb://localhost:27017/mp_heritage`
- Backend server runs on port 5000
- Frontend dev server runs on port 5173
- Vite proxy configured for API calls
- CORS enabled for development

## 🎯 Next Steps

1. ✅ Backend API fully functional
2. ✅ Frontend React app with all pages
3. ✅ Authentication & protected routes
4. ✅ User & Admin dashboards
5. 🔲 Google Gemini AI integration (requires API key)
6. 🔲 Google Maps integration (requires API key)
7. 🔲 Email notifications
8. 🔲 Advanced analytics
9. 🔲 PDF export for itineraries

## 📄 License

This project is for educational purposes.

## 👨‍💻 Support

For issues or questions, please check the documentation or create an issue.

---

**Built with ❤️ for preserving Madhya Pradesh's rich cultural heritage**
