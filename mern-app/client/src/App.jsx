import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './styles/booking.css';

// Pages
import Home from './pages/Home';
import Monasteries from './pages/Monasteries';
import VirtualTours from './pages/VirtualTours';
import Itinerary from './pages/Itinerary';
import Events from './pages/Events';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Preservation from './pages/Preservation';
import Navigation from './pages/Navigation';
import ArTour from './pages/ArTour';
import PropertyListing from './pages/PropertyListing';
import PropertyDetails from './pages/PropertyDetails';
import BookingCheckout from './pages/BookingCheckout';
import BookingSuccess from './pages/BookingSuccess';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/monasteries" element={<Monasteries />} />
      <Route path="/navigation" element={<Navigation />} />
      <Route path="/virtual-tours" element={<VirtualTours />} />
      <Route path="/events" element={<Events />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ar-tour" element={<ArTour />} />
      
      {/* Property & Booking Routes */}
      <Route path="/properties" element={<PropertyListing />} />
      <Route path="/properties/:id" element={<PropertyDetails />} />

      {/* Booking Routes */}
      <Route
        path="/booking/create"
        element={
          <ProtectedRoute>
            <BookingCheckout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/success"
        element={
          <ProtectedRoute>
            <BookingSuccess />
          </ProtectedRoute>
        }
      />

      {/* Protected User Routes */}
      <Route path="/itinerary" element={<Itinerary />} />
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preservation"
        element={
          <ProtectedRoute adminOnly={true}>
            <Preservation />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
