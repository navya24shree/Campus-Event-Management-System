import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiUser, FiMail, FiBook, FiStar } from 'react-icons/fi';
import API_BASE_URL from '../config';
import './Feedback.css';

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    email: '',
    rating: 0
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

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.section || !formData.email || !formData.rating) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/feedback`, {
        event_id: id,
        name: formData.name,
        section: formData.section,
        email: formData.email,
        rating: parseInt(formData.rating)
      });
      alert('Feedback submitted successfully!');
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="feedback-card"
      >
        <h2 className="feedback-title">Event Feedback</h2>
        <form onSubmit={handleSubmit} className="feedback-form">
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
          <div className="rating-section">
            <label>Rating (1-5)</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`star ${formData.rating >= star ? 'filled' : ''}`}
                  onClick={() => handleRatingClick(star)}
                />
              ))}
            </div>
            {formData.rating > 0 && (
              <p className="rating-text">Selected: {formData.rating} out of 5</p>
            )}
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
        <button onClick={() => navigate(-1)} className="back-btn">
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default Feedback;

