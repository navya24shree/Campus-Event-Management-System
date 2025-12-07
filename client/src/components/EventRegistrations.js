import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiMail, FiBook, FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import API_BASE_URL from '../config';
import './EventRegistrations.css';

const EventRegistrations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
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
      const [registrationsRes, eventRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/registrations/event/${id}`),
        axios.get(`${API_BASE_URL}/api/events/${id}`)
      ]);
      setRegistrations(registrationsRes.data);
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="event-registrations-container">
        <div className="loading">Loading registrations...</div>
      </div>
    );
  }

  return (
    <div className="event-registrations-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="header-content">
          <h1 className="page-title">{event?.name || 'Event Registrations'}</h1>
          <div className="stats">
            <span className="stat-item">Total Registrations: {registrations.length}</span>
          </div>
        </div>
      </div>

      {event && (
        <div className="event-info-card">
          <div className="event-info">
            <div className="info-item">
              <FiCalendar />
              <span>{formatDate(event.date)}</span>
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
        </div>
      )}

      {registrations.length === 0 ? (
        <div className="no-registrations">
          <p>No registrations found for this event.</p>
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
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;

