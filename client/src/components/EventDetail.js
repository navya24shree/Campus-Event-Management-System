import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiClock, FiMapPin, FiArrowLeft, FiEdit2, FiTrash2, FiList, FiMessageSquare } from 'react-icons/fi';
import API_BASE_URL from '../config';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEditing, setIsEditing] = useState(location.state?.edit || false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (user && user.role === 'student' && event) {
      checkRegistration();
    } else {
      setIsRegistered(false);
    }
  }, [user, event]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/events/${id}`);
      setEvent(response.data);
      setEditData(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/registrations/check?eventIds=${id}`);
      setIsRegistered(response.data.includes(parseInt(id)));
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/events/${id}`, editData);
      setEvent(editData);
      setIsEditing(false);
      alert('Event updated successfully!');
    } catch (error) {
      alert('Failed to update event');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/events/${id}`);
        navigate('/');
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!event) {
    return <div className="loading-container">Event not found</div>;
  }

  return (
    <div className="event-detail-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FiArrowLeft /> Back
      </button>

      {user && user.role === 'admin' && !isEditing && (
        <div className="admin-actions">
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FiEdit2 /> Edit Event
          </button>
          <button className="delete-button" onClick={handleDelete}>
            <FiTrash2 /> Delete Event
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="event-detail-card"
      >
        {isEditing ? (
          <div className="edit-form">
            <h2>Edit Event</h2>
            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                name="name"
                value={editData.name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Club Name</label>
              <input
                type="text"
                name="club_name"
                value={editData.club_name || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={editData.description || ''}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Detailed Description</label>
              <textarea
                name="detailed_description"
                value={editData.detailed_description || ''}
                onChange={handleChange}
                rows="5"
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image_url"
                value={editData.image_url || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={editData.date || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="time"
                  value={editData.time || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Venue</label>
              <input
                type="text"
                name="venue"
                value={editData.venue || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={editData.status || 'upcoming'} onChange={handleChange}>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="save-btn" onClick={handleUpdate}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="event-image-large">
              {event.image_url ? (
                <img src={event.image_url} alt={event.name} />
              ) : (
                <div className="placeholder-large">
                  <FiCalendar size={80} />
                </div>
              )}
            </div>
            <div className="event-detail-content">
              <h1 className="event-detail-name">{event.name}</h1>
              <p className="event-detail-club">Organized by: {event.club_name}</p>
              <div className="event-detail-info">
                <div className="info-item">
                  <FiCalendar />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <FiClock />
                  <span>{event.time}</span>
                </div>
                <div className="info-item">
                  <FiMapPin />
                  <span>{event.venue}</span>
                </div>
              </div>
              <div className="event-description-section">
                <h3>Description</h3>
                <p>{event.description}</p>
              </div>
              {event.detailed_description && (
                <div className="event-description-section">
                  <h3>Detailed Description</h3>
                  <p>{event.detailed_description}</p>
                </div>
              )}
              {user && user.role === 'admin' ? (
                event.status === 'upcoming' ? (
                  <button
                    className="view-registrations-detail-btn"
                    onClick={() => navigate(`/event/${event.id}/registrations`)}
                  >
                    <FiList /> View Registrations
                  </button>
                ) : (
                  <button
                    className="view-feedback-detail-btn"
                    onClick={() => navigate(`/event/${event.id}/feedback`)}
                  >
                    <FiMessageSquare /> View Feedback
                  </button>
                )
              ) : event.status === 'upcoming' ? (
                user && user.role === 'student' && isRegistered ? (
                  <button className="registered-detail-btn" disabled>
                    ✓ Registered
                  </button>
                ) : (
                  <button
                    className="register-detail-btn"
                    onClick={() => {
                      if (!user) {
                        navigate('/login', { state: { redirect: `/register/${event.id}` } });
                      } else {
                        navigate(`/register/${event.id}`);
                      }
                    }}
                  >
                    Register Now
                  </button>
                )
              ) : (
                <button
                  className="feedback-detail-btn"
                  onClick={() => navigate(`/feedback/${event.id}`)}
                >
                  Give Feedback
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default EventDetail;

