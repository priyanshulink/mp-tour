import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Main Navbar */}
      <nav>
        <div className="logo">Have-In-MP</div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/monasteries">Heritage Sites</Link></li>
          <li><Link to="/properties">Book Stay</Link></li>
          <li><Link to="/navigation">Navigation</Link></li>
          <li><Link to="/virtual-tours">Virtual Tours</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/itinerary">Travel Itinerary</Link></li>
          {user?.role === 'Admin' && (
            <li><Link to="/preservation">Preservation</Link></li>
          )}
        </ul>
        {isAuthenticated() ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link to={user?.role === 'Admin' ? '/admin' : '/user'} className="explore-btn">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="explore-btn" style={{ background: '#dc3545' }}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="explore-btn">Login</Link>
        )}
        <div className="hamburger" onClick={() => setSideMenuOpen(true)}>☰</div>
      </nav>

      {/* Side Menu */}
      <div className="side-menu" style={{ right: sideMenuOpen ? '0' : '-100%' }}>
        <span className="close-btn" onClick={() => setSideMenuOpen(false)}>✖</span>
        <ul>
          <li><Link to="/" onClick={() => setSideMenuOpen(false)}>Home</Link></li>
          <li><Link to="/monasteries" onClick={() => setSideMenuOpen(false)}>Heritage Sites</Link></li>
          <li><Link to="/properties" onClick={() => setSideMenuOpen(false)}>Book Stay</Link></li>
          <li><Link to="/navigation" onClick={() => setSideMenuOpen(false)}>Navigation</Link></li>
          <li><Link to="/virtual-tours" onClick={() => setSideMenuOpen(false)}>Virtual Tours</Link></li>
          <li><Link to="/events" onClick={() => setSideMenuOpen(false)}>Events</Link></li>
          <li><Link to="/itinerary" onClick={() => setSideMenuOpen(false)}>Travel Itinerary</Link></li>
          {user?.role === 'Admin' && (
            <li><Link to="/preservation" onClick={() => setSideMenuOpen(false)}>Preservation</Link></li>
          )}
          {isAuthenticated() ? (
            <>
              <li><Link to={user?.role === 'Admin' ? '/admin' : '/user'} onClick={() => setSideMenuOpen(false)}>Dashboard</Link></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); setSideMenuOpen(false); }}>Logout</a></li>
            </>
          ) : (
            <li><Link to="/login" onClick={() => setSideMenuOpen(false)}>Login</Link></li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
