import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import EventDetail from './components/EventDetail';
import RegisterEvent from './components/RegisterEvent';
import Feedback from './components/Feedback';
import Registrations from './components/Registrations';
import EventRegistrations from './components/EventRegistrations';
import EventFeedback from './components/EventFeedback';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/register/:id" element={<RegisterEvent />} />
          <Route path="/feedback/:id" element={<Feedback />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="/event/:id/registrations" element={<EventRegistrations />} />
          <Route path="/event/:id/feedback" element={<EventFeedback />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

