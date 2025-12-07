import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiBook, FiCalendar } from 'react-icons/fi';
import API_BASE_URL from '../config';
import './RegisterEvent.css';

const RegisterEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirect: `/register/${id}` } });
    }
  }, [user, navigate, id]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    section: '',
    sem: '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    if (!formData.name || !formData.section || !formData.sem || !formData.email) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/registrations`, {
        event_id: id,
        student_name: formData.name,
        section: formData.section,
        sem: formData.sem,
        email: formData.email
      });
      localStorage.setItem('notification', 'You have successfully registered for the event!');
      localStorage.setItem('refreshRegistrations', 'true');
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="register-card"
      >
        <h2 className="register-title">Event Registration</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <FiUser className="form-icon" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <FiBook className="form-icon" />
            <input
              type="text"
              name="section"
              placeholder="Section"
              value={formData.section}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <FiCalendar className="form-icon" />
            <input
              type="text"
              name="sem"
              placeholder="Semester"
              value={formData.sem}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <FiMail className="form-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
        <button onClick={() => navigate(-1)} className="back-btn">
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default RegisterEvent;

