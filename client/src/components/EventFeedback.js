import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiMail, FiBook, FiStar } from 'react-icons/fi';
import API_BASE_URL from '../config';
import './EventFeedback.css';

const EventFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, navigate, id]);

  const fetchData = async () => {
    try {
      const [feedbackRes, eventRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/feedback/event/${id}`),
        axios.get(`${API_BASE_URL}/api/events/${id}`)
      ]);
      setFeedback(feedbackRes.data);
      setEvent(eventRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAverageRating = () => {
    if (feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedback.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="event-feedback-container">
        <div className="loading">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="event-feedback-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="header-content">
          <h1 className="page-title">{event?.name || 'Event Feedback'}</h1>
          <div className="stats">
            <span className="stat-item">Total Feedback: {feedback.length}</span>
            {feedback.length > 0 && (
              <span className="stat-item">Average Rating: {calculateAverageRating()}/5</span>
            )}
          </div>
        </div>
      </div>

      {feedback.length === 0 ? (
        <div className="no-feedback">
          <p>No feedback found for this event.</p>
        </div>
      ) : (
        <>
          <div className="feedback-grid">
            {feedback.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="feedback-card"
              >
                <div className="card-header">
                  <div className="rating-display">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        className={`star ${item.rating >= star ? 'filled' : ''}`}
                      />
                    ))}
                    <span className="rating-value">{item.rating}/5</span>
                  </div>
                  <span className="feedback-date">
                    {formatDate(item.submitted_at)}
                  </span>
                </div>
                
                <div className="card-content">
                  <div className="user-info">
                    <div className="info-row">
                      <FiUser className="info-icon" />
                      <div className="info-content">
                        <span className="info-label">Name</span>
                        <span className="info-value">{item.name}</span>
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <FiMail className="info-icon" />
                      <div className="info-content">
                        <span className="info-label">Email</span>
                        <span className="info-value">{item.email}</span>
                      </div>
                    </div>
                    
                    <div className="info-row">
                      <FiBook className="info-icon" />
                      <div className="info-content">
                        <span className="info-label">Section</span>
                        <span className="info-value">Section {item.section}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventFeedback;

