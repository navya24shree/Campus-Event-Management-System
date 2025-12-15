const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ozTTHiQQebYJzjwfyKhuMjexxMQxqfRM',
  database: process.env.DB_NAME || 'railway'
});

db.connect(async (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
  await fixDatabase();
});

async function fixDatabase() {
  try {
    // Drop existing events table if it exists
    await db.promise().query('DROP TABLE IF EXISTS feedback');
    await db.promise().query('DROP TABLE IF EXISTS registrations');
    await db.promise().query('DROP TABLE IF EXISTS events');

    // Recreate events table with correct structure
    await db.promise().query(`
      CREATE TABLE events (
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

    // Recreate registrations table
    await db.promise().query(`
      CREATE TABLE registrations (
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

    // Recreate feedback table
    await db.promise().query(`
      CREATE TABLE feedback (
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

    console.log('✅ Database tables recreated successfully!');
    db.end();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    db.end();
    process.exit(1);
  }
}

