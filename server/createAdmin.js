const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_events'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
  createAdminUser();
});

async function createAdminUser() {
  try {
    const adminEmail = 'admin@campus.edu';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin user exists
    const [existing] = await db.promise().query(
      'SELECT * FROM users WHERE email = ?',
      [adminEmail]
    );

    if (existing.length > 0) {
      // Update existing admin user
      await db.promise().query(
        'UPDATE users SET password = ?, role = ? WHERE email = ?',
        [hashedPassword, 'admin', adminEmail]
      );
      console.log('✅ Admin user password has been reset!');
      console.log('Email: admin@campus.edu');
      console.log('Password: admin123');
    } else {
      // Create new admin user
      await db.promise().query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Admin', adminEmail, hashedPassword, 'admin']
      );
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@campus.edu');
      console.log('Password: admin123');
    }

    db.end();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    db.end();
    process.exit(1);
  }
}

