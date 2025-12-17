const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.get("/", (req, res) => {
  res.status(200).send("Campus Event Management Backend is running 🚀");
});

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.31.173:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME || 'railway'
});

db.connect(async (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database');
    await initializeDatabase();
  }
});

// Initialize Database Tables
async function initializeDatabase() {
  try {
    // Users table
    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events table
    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        club_name VARCHAR(255) NOT NULL,
        description TEXT,
        detailed_description TEXT,
        image_url VARCHAR(500),
        date DATE NOT NULL,
        time TIME NOT NULL,
        venue VARCHAR(255) NOT NULL,
        status ENUM('upcoming', 'completed') DEFAULT 'upcoming',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Registrations table
    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        student_name VARCHAR(255) NOT NULL,
        section VARCHAR(50) NOT NULL,
        sem VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    // Feedback table
    await db.promise().query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        section VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    // Create default admin user
    const adminEmail = 'admin@campus.edu';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Check if admin exists, if not create, if exists update password
    const [existing] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (existing.length > 0) {
      // Update existing admin password to ensure it's correct
      await db.promise().query(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'admin', adminEmail]
      );
      console.log('Admin user password updated');
    } else {
      await db.promise().query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin', adminEmail, hashedPassword, 'admin']
      );
      console.log('Admin user created');
    }
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    res.json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Events Routes
app.get('/api/events', async (req, res) => {
  const { status } = req.query;
  
  try {
    let query = 'SELECT * FROM events';
    let params = [];
    
    if (status) {
      query += ' WHERE status = ? ORDER BY date ASC, time ASC';
      params.push(status);
    } else {
      query += ' ORDER BY date ASC, time ASC';
    }
    
    const [events] = await db.promise().query(query, params);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const [events] = await db.promise().query(
      'SELECT * FROM events WHERE id = ?',
      [req.params.id]
    );
    
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(events[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

app.post('/api/events', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const { name, club_name, description, detailed_description, image_url, date, time, venue } = req.body;
  
  try {
    const [result] = await db.promise().query(
      'INSERT INTO events (name, club_name, description, detailed_description, image_url, date, time, venue) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, club_name, description, detailed_description, image_url, date, time, venue]
    );
    res.json({ message: 'Event created successfully', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const { name, club_name, description, detailed_description, image_url, date, time, venue, status } = req.body;
  
  try {
    await db.promise().query(
      'UPDATE events SET name = ?, club_name = ?, description = ?, detailed_description = ?, image_url = ?, date = ?, time = ?, venue = ?, status = ? WHERE id = ?',
      [name, club_name, description, detailed_description, image_url, date, time, venue, status, req.params.id]
    );
    res.json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  try {
    await db.promise().query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Registration Routes
app.post('/api/registrations', authenticateToken, async (req, res) => {
  const { event_id, student_name, section, sem, email } = req.body;
  
  try {
    // Check if already registered
    const [existing] = await db.promise().query(
      'SELECT * FROM registrations WHERE event_id = ? AND email = ?',
      [event_id, email]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }
    
    await db.promise().query(
      'INSERT INTO registrations (event_id, student_name, section, sem, email) VALUES (?, ?, ?, ?, ?)',
      [event_id, student_name, section, sem, email]
    );
    res.json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Check if user is registered for events
app.get('/api/registrations/check', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const eventIds = req.query.eventIds ? req.query.eventIds.split(',').map(id => parseInt(id)) : [];
    
    if (eventIds.length === 0) {
      return res.json([]);
    }
    
    const placeholders = eventIds.map(() => '?').join(',');
    const [registrations] = await db.promise().query(
      `SELECT event_id FROM registrations WHERE email = ? AND event_id IN (${placeholders})`,
      [userEmail, ...eventIds]
    );
    
    const registeredEventIds = registrations.map(r => r.event_id);
    res.json(registeredEventIds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to check registrations' });
  }
});

// Get registrations for a specific event (admin only)
app.get('/api/registrations/event/:eventId', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  try {
    const [registrations] = await db.promise().query(`
      SELECT 
        r.id,
        r.student_name,
        r.section,
        r.sem,
        r.email,
        r.registered_at,
        e.id as event_id,
        e.name as event_name,
        e.date as event_date,
        e.time as event_time,
        e.venue as event_venue
      FROM registrations r
      INNER JOIN events e ON r.event_id = e.id
      WHERE r.event_id = ?
      ORDER BY r.registered_at DESC
    `, [req.params.eventId]);
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Get all registrations (admin only)
app.get('/api/registrations', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  try {
    const [registrations] = await db.promise().query(`
      SELECT 
        r.id,
        r.student_name,
        r.section,
        r.sem,
        r.email,
        r.registered_at,
        e.id as event_id,
        e.name as event_name,
        e.date as event_date,
        e.time as event_time,
        e.venue as event_venue
      FROM registrations r
      INNER JOIN events e ON r.event_id = e.id
      ORDER BY r.registered_at DESC
    `);
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Feedback Routes
app.post('/api/feedback', async (req, res) => {
  const { event_id, name, section, email, rating } = req.body;
  
  try {
    await db.promise().query(
      'INSERT INTO feedback (event_id, name, section, email, rating) VALUES (?, ?, ?, ?, ?)',
      [event_id, name, section, email, rating]
    );
    res.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get feedback for a specific event (admin only)
app.get('/api/feedback/event/:eventId', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  try {
    const [feedback] = await db.promise().query(`
      SELECT 
        f.id,
        f.name,
        f.section,
        f.email,
        f.rating,
        f.submitted_at,
        e.id as event_id,
        e.name as event_name
      FROM feedback f
      INNER JOIN events e ON f.event_id = e.id
      WHERE f.event_id = ?
      ORDER BY f.submitted_at DESC
    `, [req.params.eventId]);
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.listen(PORT,  "0.0.0.0" => {
  console.log(`Server running on port ${PORT}`);
});

