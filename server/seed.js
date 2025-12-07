const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_events'
});

// Sample events data
const sampleEvents = [
  {
    name: 'Tech Innovation Summit',
    club_name: 'Computer Science Club',
    description: 'Join us for a day of tech talks, workshops, and networking.',
    detailed_description: 'This summit brings together industry leaders, students, and innovators to discuss the latest trends in technology. Featuring keynote speakers, hands-on workshops, and networking opportunities.',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    date: '2024-12-15',
    time: '10:00:00',
    venue: 'Main Auditorium',
    status: 'upcoming'
  },
  {
    name: 'Cultural Fest 2024',
    club_name: 'Cultural Society',
    description: 'Celebrate diversity with music, dance, and food from around the world.',
    detailed_description: 'A vibrant celebration of cultures featuring performances, food stalls, and interactive activities. Experience the rich diversity of our campus community.',
    image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    date: '2024-12-20',
    time: '14:00:00',
    venue: 'Open Air Theater',
    status: 'upcoming'
  },
  {
    name: 'Hackathon Challenge',
    club_name: 'Programming Club',
    description: '24-hour coding competition with exciting prizes.',
    detailed_description: 'Test your coding skills in this intense 24-hour hackathon. Build innovative solutions, collaborate with teammates, and compete for amazing prizes.',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    date: '2024-12-10',
    time: '09:00:00',
    venue: 'Computer Lab',
    status: 'completed'
  }
];

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
  seedEvents();
});

function seedEvents() {
  const insertQuery = `
    INSERT INTO events (name, club_name, description, detailed_description, image_url, date, time, venue, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  sampleEvents.forEach((event) => {
    db.query(insertQuery, [
      event.name,
      event.club_name,
      event.description,
      event.detailed_description,
      event.image_url,
      event.date,
      event.time,
      event.venue,
      event.status
    ], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`Event "${event.name}" already exists, skipping...`);
        } else {
          console.error(`Error inserting event "${event.name}":`, err);
        }
      } else {
        console.log(`Event "${event.name}" inserted successfully`);
      }
    });
  });

  setTimeout(() => {
    console.log('Seeding completed!');
    db.end();
  }, 2000);
}

