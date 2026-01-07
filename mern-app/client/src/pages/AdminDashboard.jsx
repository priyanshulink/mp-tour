import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, storyAPI, eventAPI, authAPI } from '../services/api';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingStories, setPendingStories] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStory, setSelectedStory] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Events state
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    monastery: '',
    type: 'Festival',
    location: ''
  });
  const [eventImage, setEventImage] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'moderate') {
      fetchPendingStories();
    }
    if (activeTab === 'events') {
      fetchEvents();
    }
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await analyticsAPI.getDashboardStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPendingStories = async () => {
    try {
      const response = await storyAPI.getAllStories({ status: 'pending' });
      setPendingStories(response.data.stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAllEvents();
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone and will also delete all their stories and itineraries.`)) {
      try {
        await authAPI.deleteUser(userId);
        alert('User deleted successfully!');
        fetchUsers();
        fetchStats();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };


  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', eventForm.title);
      formData.append('description', eventForm.description);
      formData.append('date', eventForm.date);
      formData.append('monastery', eventForm.monastery);
      formData.append('type', eventForm.type);
      formData.append('location', eventForm.location);
      if (eventImage) {
        formData.append('image', eventImage);
      }

      if (editingEvent) {
        await eventAPI.updateEvent(editingEvent._id, formData);
        alert('Event updated successfully!');
      } else {
        await eventAPI.createEvent(formData);
        alert('Event created successfully!');
      }

      setShowEventModal(false);
      setEditingEvent(null);
      setEventForm({ title: '', description: '', date: '', monastery: '', type: 'Festival', location: '' });
      setEventImage(null);
      fetchEvents();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date ? event.date.split('T')[0] : '',
      monastery: event.monastery,
      type: event.type,
      location: event.location || ''
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.deleteEvent(eventId);
        alert('Event deleted successfully!');
        fetchEvents();
        fetchStats();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  const openAddEventModal = () => {
    setEditingEvent(null);
    setEventForm({ title: '', description: '', date: '', monastery: '', type: 'Festival', location: '' });
    setEventImage(null);
    setShowEventModal(true);
  };

  const handleModerate = async (storyId, status, reason = '') => {
    try {
      await storyAPI.moderateStory(storyId, { status, rejectionReason: reason });
      alert(`Story ${status} successfully`);
      setSelectedStory(null);
      setRejectionReason('');
      fetchPendingStories();
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.message || 'Moderation failed');
    }
  };

  const openStoryModal = (story) => {
    setSelectedStory(story);
    setRejectionReason('');
  };

  const closeStoryModal = () => {
    setSelectedStory(null);
    setRejectionReason('');
  };

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>Admin Dashboard</h1>
            <p style={{ margin: '10px 0 0', opacity: 0.9 }}>Welcome, {user?.name}! Manage your heritage tourism platform</p>
          </div>

          {/* Tabs */}
          <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '12px 30px',
                background: activeTab === 'overview' ? '#007bff' : 'white',
                color: activeTab === 'overview' ? 'white' : '#333',
                border: '2px solid #007bff',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s',
                boxShadow: activeTab === 'overview' ? '0 4px 12px rgba(0,123,255,0.3)' : 'none'
              }}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('moderate')}
              style={{
                padding: '12px 30px',
                background: activeTab === 'moderate' ? '#007bff' : 'white',
                color: activeTab === 'moderate' ? 'white' : '#333',
                border: '2px solid #007bff',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s',
                boxShadow: activeTab === 'moderate' ? '0 4px 12px rgba(0,123,255,0.3)' : 'none',
                position: 'relative'
              }}
            >
              ✍️ Moderate Content
              {pendingStories.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {pendingStories.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('events')}
              style={{
                padding: '12px 30px',
                background: activeTab === 'events' ? '#007bff' : 'white',
                color: activeTab === 'events' ? 'white' : '#333',
                border: '2px solid #007bff',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s',
                boxShadow: activeTab === 'events' ? '0 4px 12px rgba(0,123,255,0.3)' : 'none'
              }}
            >
              📅 Manage Events
            </button>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '12px 30px',
                background: activeTab === 'users' ? '#007bff' : 'white',
                color: activeTab === 'users' ? 'white' : '#333',
                border: '2px solid #007bff',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s',
                boxShadow: activeTab === 'users' ? '0 4px 12px rgba(0,123,255,0.3)' : 'none'
              }}
            >
              👥 Manage Users
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div>
              <h2 style={{ marginBottom: '20px' }}>Statistics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: '#007bff' }}>{stats.users.total}</h3>
                  <p>Total Users</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: '#28a745' }}>{stats.stories.approved}</h3>
                  <p>Approved Stories</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: '#ffc107' }}>{stats.stories.pending}</h3>
                  <p>Pending Stories</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: '#dc3545' }}>{stats.stories.rejected}</h3>
                  <p>Rejected Stories</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: '#17a2b8' }}>{stats.events.upcoming}</h3>
                  <p>Upcoming Events</p>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ color: '#6c757d' }}>{stats.itineraries}</h3>
                  <p>Total Itineraries</p>
                </div>
              </div>
            </div>
          )}

          {/* Moderate Tab */}
          {activeTab === 'moderate' && (
            <div>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                Pending Stories for Review
                <span style={{
                  background: '#ffc107',
                  color: '#333',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  marginLeft: '15px',
                  fontWeight: 'bold'
                }}>
                  {pendingStories.length}
                </span>
              </h2>
              {pendingStories.length === 0 ? (
                <div style={{
                  background: 'white',
                  padding: '60px 20px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ fontSize: '48px', margin: '0 0 20px' }}>✅</p>
                  <h3 style={{ color: '#28a745', marginBottom: '10px' }}>All Caught Up!</h3>
                  <p style={{ color: '#666' }}>No pending stories to review at the moment.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                  {pendingStories.map((story) => (
                    <div
                      key={story._id}
                      style={{
                        background: 'white',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                      }}
                      onClick={() => openStoryModal(story)}
                    >
                      {/* Story Image/Media */}
                      {story.mediaUrl && (
                        <div style={{ height: '200px', overflow: 'hidden' }}>
                          {story.type === 'photo' ? (
                            <img
                              src={story.mediaUrl}
                              alt={story.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : story.type === 'video' ? (
                            <video
                              src={story.mediaUrl}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              controls={false}
                            />
                          ) : null}
                        </div>
                      )}

                      {/* Story Content */}
                      <div style={{ padding: '20px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px'
                        }}>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{story.title}</h3>
                          <span style={{
                            background: '#007bff',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {story.type}
                          </span>
                        </div>

                        <p style={{
                          color: '#666',
                          fontSize: '14px',
                          margin: '10px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <span style={{ fontWeight: 'bold' }}>👤</span> {story.authorName}
                        </p>

                        <p style={{
                          color: '#666',
                          fontSize: '14px',
                          margin: '10px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <span style={{ fontWeight: 'bold' }}>🏛️</span> {story.monastery}
                        </p>

                        <p style={{
                          color: '#555',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          marginTop: '15px',
                          maxHeight: '60px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {story.content.substring(0, 100)}...
                        </p>

                        <div style={{
                          marginTop: '20px',
                          display: 'flex',
                          gap: '10px',
                          paddingTop: '15px',
                          borderTop: '1px solid #eee'
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModerate(story._id, 'approved');
                            }}
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#218838'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#28a745'}
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openStoryModal(story);
                            }}
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              transition: 'background 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Manage Events</h2>
                <button
                  onClick={openAddEventModal}
                  style={{
                    padding: '12px 25px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '15px'
                  }}
                >
                  + Add New Event
                </button>
              </div>

              {events.length === 0 ? (
                <div style={{ background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
                  <p style={{ color: '#666' }}>No events found. Click "Add New Event" to create one.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {events.map((event) => (
                    <div key={event._id} style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center'
                    }}>
                      {event.image && (
                        <img
                          src={`http://localhost:5000${event.image}`}
                          alt={event.title}
                          style={{ width: '150px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: '0 0 10px', color: '#333' }}>{event.title}</h3>
                        <p style={{ margin: '5px 0', color: '#666' }}><strong>Monastery:</strong> {event.monastery}</p>
                        <p style={{ margin: '5px 0', color: '#666' }}><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                        <p style={{ margin: '5px 0', color: '#666' }}><strong>Type:</strong> {event.type}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleEditEvent(event)}
                          style={{
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          style={{
                            padding: '10px 20px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>
                Registered Users
                <span style={{
                  background: '#007bff',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  marginLeft: '15px',
                  fontWeight: 'bold'
                }}>
                  {users.length}
                </span>
              </h2>

              {loadingUsers ? (
                <div style={{ background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
                  <p style={{ color: '#666' }}>Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div style={{ background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
                  <p style={{ color: '#666' }}>No users found.</p>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Name</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Email</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Role</th>
                        <th style={{ padding: '15px', textAlign: 'left', fontWeight: 'bold', color: '#333' }}>Registered</th>
                        <th style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#333' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr
                          key={user._id}
                          style={{
                            borderBottom: index < users.length - 1 ? '1px solid #dee2e6' : 'none',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <td style={{ padding: '15px', color: '#333' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '16px'
                              }}>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ fontWeight: '500' }}>{user.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '15px', color: '#666' }}>{user.email}</td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              background: user.role === 'Admin' ? '#dc3545' : '#28a745',
                              color: 'white'
                            }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#666', fontSize: '14px' }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '15px', textAlign: 'center' }}>
                            {user.role === 'Admin' ? (
                              <button
                                disabled
                                style={{
                                  padding: '8px 16px',
                                  background: '#6c757d',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '5px',
                                  cursor: 'not-allowed',
                                  fontSize: '14px',
                                  opacity: 0.6
                                }}
                                title="Cannot delete admin accounts"
                              >
                                🔒 Protected
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeleteUser(user._id, user.name)}
                                style={{
                                  padding: '8px 16px',
                                  background: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  transition: 'background 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Story Detail Modal */}
      {selectedStory && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px',
            overflow: 'auto'
          }}
          onClick={closeStoryModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeStoryModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                fontWeight: 'bold',
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              ×
            </button>

            {/* Modal Content */}
            <div>
              {/* Media Preview */}
              {selectedStory.mediaUrl && (
                <div style={{ width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
                  {selectedStory.type === 'photo' ? (
                    <img
                      src={selectedStory.mediaUrl}
                      alt={selectedStory.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : selectedStory.type === 'video' ? (
                    <video
                      src={selectedStory.mediaUrl}
                      controls
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : null}
                </div>
              )}

              <div style={{ padding: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <span style={{
                    background: '#007bff',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '15px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {selectedStory.type}
                  </span>
                </div>

                <h2 style={{ marginBottom: '20px', color: '#333' }}>{selectedStory.title}</h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  marginBottom: '25px',
                  padding: '20px',
                  background: '#f8f9fa',
                  borderRadius: '10px'
                }}>
                  <div>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      <strong>👤 Author:</strong>
                    </p>
                    <p style={{ margin: 0, color: '#333', fontSize: '16px' }}>{selectedStory.authorName}</p>
                  </div>
                  <div>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      <strong>🏛️ Monastery:</strong>
                    </p>
                    <p style={{ margin: 0, color: '#333', fontSize: '16px' }}>{selectedStory.monastery}</p>
                  </div>
                  <div>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      <strong>📅 Submitted:</strong>
                    </p>
                    <p style={{ margin: 0, color: '#333', fontSize: '16px' }}>
                      {new Date(selectedStory.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                      <strong>👁️ Views:</strong>
                    </p>
                    <p style={{ margin: 0, color: '#333', fontSize: '16px' }}>{selectedStory.views}</p>
                  </div>
                </div>

                <h3 style={{ marginBottom: '15px', color: '#333' }}>Story Content</h3>
                <p style={{
                  lineHeight: '1.8',
                  color: '#555',
                  marginBottom: '30px',
                  fontSize: '16px',
                  textAlign: 'justify'
                }}>
                  {selectedStory.content}
                </p>

                {/* Moderation Actions */}
                <div style={{
                  borderTop: '2px solid #eee',
                  paddingTop: '25px'
                }}>
                  <h3 style={{ marginBottom: '15px', color: '#333' }}>Moderation Action</h3>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: 'bold',
                      color: '#555'
                    }}>
                      Rejection Reason (if rejecting):
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter the reason for rejection..."
                      style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '10px',
                        fontSize: '14px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                      onClick={() => handleModerate(selectedStory._id, 'approved')}
                      style={{
                        flex: 1,
                        padding: '15px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        transition: 'background 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#218838'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#28a745'}
                    >
                      ✓ Approve Story
                    </button>
                    <button
                      onClick={() => {
                        if (!rejectionReason.trim()) {
                          alert('Please enter a rejection reason');
                          return;
                        }
                        handleModerate(selectedStory._id, 'rejected', rejectionReason);
                      }}
                      style={{
                        flex: 1,
                        padding: '15px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        transition: 'background 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
                    >
                      ✕ Reject Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleEventSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title *</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Monastery *</label>
                <input
                  type="text"
                  value={eventForm.monastery}
                  onChange={(e) => setEventForm({ ...eventForm, monastery: e.target.value })}
                  required
                  placeholder="e.g., Rumtek Monastery"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date *</label>
                <input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Event Type *</label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="Festival">Festival</option>
                  <option value="Ceremony">Ceremony</option>
                  <option value="Prayer">Prayer</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
                <input
                  type="text"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="Event location"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description *</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  required
                  rows={4}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', resize: 'vertical' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEventImage(e.target.files[0])}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <FloatingChatbot />
    </>
  );
};

export default AdminDashboard;
