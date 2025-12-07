import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiX } from 'react-icons/fi';
import API_BASE_URL from '../config';
import './AddEvent.css';

const AddEvent = ({ onClose, onEventAdded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    club_name: '',
    description: '',
    detailed_description: '',
    image_url: '',
    date: '',
    time: '',
    venue: '',
    status: 'upcoming'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.club_name || !formData.date || !formData.time || !formData.venue) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/events`, formData);
      if (onEventAdded) {
        onEventAdded();
      }
      if (onClose) {
        onClose();
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-overlay" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="add-event-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Add New Event</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-event-form">
          <div className="form-row">
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter event name"
              />
            </div>
            <div className="form-group">
              <label>Club/Organization Name *</label>
              <input
                type="text"
                name="club_name"
                value={formData.club_name}
                onChange={handleChange}
                required
                placeholder="Enter club name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of the event"
            />
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea
              name="detailed_description"
              value={formData.detailed_description}
              onChange={handleChange}
              rows="5"
              placeholder="Detailed information about the event"
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Venue *</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              placeholder="Event location"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddEvent;

