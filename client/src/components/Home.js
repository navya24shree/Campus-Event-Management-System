import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiLogIn, FiLogOut, FiEdit2, FiTrash2, FiPlus, FiUsers, FiList, FiMessageSquare } from 'react-icons/fi';
import AddEvent from './AddEvent';
import API_BASE_URL from '../config';
import './Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [activeTab, user]);

  const fetchEvents = async () => {
    try {
      const status = activeTab === 'upcoming' ? 'upcoming' : 'completed';
      const response = await axios.get(`${API_BASE_URL}/api/events?status=${status}`);
      setEvents(response.data);
      
      // Check registration status if user is logged in
      if (user && user.role === 'student' && response.data.length > 0) {
        await checkRegistrations(response.data.map(e => e.id));
      } else {
        setRegisteredEvents([]);
      }
      
      // Check if we need to refresh registrations after registration
      if (localStorage.getItem('refreshRegistrations')) {
        localStorage.removeItem('refreshRegistrations');
        if (user && user.role === 'student' && response.data.length > 0) {
          await checkRegistrations(response.data.map(e => e.id));
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrations = async (eventIds) => {
    try {
      const eventIdsParam = eventIds.join(',');
      const response = await axios.get(`${API_BASE_URL}/api/registrations/check?eventIds=${eventIdsParam}`);
      setRegisteredEvents(response.data);
    } catch (error) {
      console.error('Error checking registrations:', error);
      setRegisteredEvents([]);
    }
  };

  const isRegistered = (eventId) => {
    // Only check registration status for students
    if (!user || user.role !== 'student') {
      return false;
    }
    return registeredEvents.includes(eventId);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/events/${eventId}`);
        setNotificationMessage('Event deleted successfully!');
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        fetchEvents();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  const handleEventAdded = () => {
    fetchEvents();
    setNotificationMessage('Event created successfully!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useEffect(() => {
    const message = localStorage.getItem('notification');
    if (message) {
      showNotificationMessage(message);
      localStorage.removeItem('notification');
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className="home-container">
      {/* Navigation Menu */}
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="nav-logo">Campus Events</h1>
          <div className="nav-links">
            <button
              className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            {user && user.role === 'admin' && (
              <button className="nav-link registrations-btn" onClick={() => navigate('/registrations')}>
                <FiUsers /> Registrations
              </button>
            )}
            {user ? (
              <button className="nav-link logout-btn" onClick={logout}>
                <FiLogOut /> Logout
              </button>
            ) : (
              <button className="nav-link login-btn" onClick={() => navigate('/login')}>
                <FiLogIn /> Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Notification */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="notification"
        >
          {notificationMessage}
        </motion.div>
      )}

      {/* Events Section */}
      <div className="events-section">
        <div className="section-header">
          <h2 className="section-title">
            {activeTab === 'upcoming' ? 'Upcoming Events' : 'Completed Events'}
          </h2>
          {user && user.role === 'admin' && (
            <button className="add-event-btn" onClick={() => setShowAddEvent(true)}>
              <FiPlus /> Add Event
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="no-events">No {activeTab} events found.</div>
        ) : (
          <div className="events-grid">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="event-card"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="event-image">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.name} />
                  ) : (
                    <div className="placeholder-image">
                      <FiCalendar size={50} />
                    </div>
                  )}
                </div>
                <div className="event-content">
                  <h3 className="event-name">{event.name}</h3>
                  <p className="event-club">Organized by: {event.club_name}</p>
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <div className="detail-item">
                      <FiCalendar /> {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="detail-item">
                      <FiClock /> {event.time}
                    </div>
                    <div className="detail-item">
                      <FiMapPin /> {event.venue}
                    </div>
                  </div>
                  <div className="event-actions">
                    {user && user.role === 'admin' ? (
                      activeTab === 'upcoming' ? (
                        <button
                          className="view-registrations-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/event/${event.id}/registrations`);
                          }}
                        >
                          <FiList /> View Registrations
                        </button>
                      ) : (
                        <button
                          className="view-feedback-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/event/${event.id}/feedback`);
                          }}
                        >
                          <FiMessageSquare /> View Feedback
                        </button>
                      )
                    ) : activeTab === 'upcoming' ? (
                      isRegistered(event.id) ? (
                        <button
                          className="registered-btn"
                          disabled
                        >
                          ✓ Registered
                        </button>
                      ) : (
                        <button
                          className="register-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              navigate('/login', { state: { redirect: `/register/${event.id}` } });
                            } else {
                              navigate(`/register/${event.id}`);
                            }
                          }}
                        >
                          Register
                        </button>
                      )
                    ) : (
                      <button
                        className="feedback-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/feedback/${event.id}`);
                        }}
                      >
                        Feedback
                      </button>
                    )}
                    {user && user.role === 'admin' && (
                      <>
                        <button
                          className="edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/event/${event.id}`, { state: { edit: true } });
                          }}
                        >
                          <FiEdit2 /> Update
                        </button>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event.id);
                          }}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <AddEvent
          onClose={() => setShowAddEvent(false)}
          onEventAdded={handleEventAdded}
        />
      )}
    </div>
  );
};

export default Home;

