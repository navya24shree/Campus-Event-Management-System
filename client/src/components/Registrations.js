import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiMail, FiBook, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import API_BASE_URL from '../config';
import './Registrations.css';

const Registrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchRegistrations();
  }, [user, navigate]);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/registrations`);
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
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
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="registrations-container">
        <div className="loading">Loading registrations...</div>
      </div>
    );
  }

  return (
    <div className="registrations-container">
      <div className="registrations-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <FiArrowLeft /> Back to Home
        </button>
        <h1 className="page-title">Event Registrations</h1>
        <div className="stats">
          <span className="stat-item">Total: {registrations.length}</span>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="no-registrations">
          <p>No registrations found.</p>
        </div>
      ) : (
        <div className="registrations-grid">
          {registrations.map((registration, index) => (
            <motion.div
              key={registration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="registration-card"
            >
              <div className="card-header">
                <h3 className="event-name">{registration.event_name}</h3>
                <span className="registration-date">
                  Registered: {formatDate(registration.registered_at)}
                </span>
              </div>
              
              <div className="card-content">
                <div className="student-info">
                  <div className="info-row">
                    <FiUser className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Student Name</span>
                      <span className="info-value">{registration.student_name}</span>
                    </div>
                  </div>
                  
                  <div className="info-row">
                    <FiMail className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Email</span>
                      <span className="info-value">{registration.email}</span>
                    </div>
                  </div>
                  
                  <div className="info-row">
                    <FiBook className="info-icon" />
                    <div className="info-content">
                      <span className="info-label">Section & Semester</span>
                      <span className="info-value">Section {registration.section} - Sem {registration.sem}</span>
                    </div>
                  </div>
                </div>

                <div className="event-details">
                  <div className="detail-item">
                    <FiCalendar />
                    <span>{formatDate(registration.event_date)}</span>
                  </div>
                  <div className="detail-item">
                    <FiClock />
                    <span>{formatTime(registration.event_time)}</span>
                  </div>
                  <div className="detail-item">
                    <FiMapPin />
                    <span>{registration.event_venue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Registrations;

