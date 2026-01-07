import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignup) {
      // Registration
      const result = await register({ name, email, password, role: 'User' });

      if (result.success) {
        navigate('/user');
      } else {
        setError(result.message);
      }
    } else {
      // Login
      const result = await login(email, password);

      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        setError(result.message);
      }
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '80px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            {isSignup ? 'Create Account' : 'Login to Explore MP'}
          </h2>

          {error && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px'
                  }}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? (isSignup ? 'Creating Account...' : 'Logging in...') : (isSignup ? 'Create Account' : 'Login')}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'underline'
              }}
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Create one"}
            </button>
          </div>

          {!isSignup && (
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
              <p><strong>Demo Credentials:</strong></p>
              <p>Admin: admin@mpheritage.com / admin123</p>
              <p>User: user@mpheritage.com / user123</p>
            </div>
          )}

          {isSignup && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#d1ecf1', borderRadius: '5px', fontSize: '13px', color: '#0c5460' }}>
              <p style={{ margin: 0 }}><strong>Note:</strong> You will be registered as a regular user. Admin accounts cannot be created through registration.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
