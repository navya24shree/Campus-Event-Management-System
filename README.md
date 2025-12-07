# Campus Event Management System

A full-stack web application for managing campus events with React, Express, Node.js, and MySQL.

## Features

- **Event Management**: View upcoming and completed events
- **User Authentication**: Student and admin login system
- **Event Registration**: Students can register for upcoming events
- **Feedback System**: Submit feedback for completed events
- **Admin Panel**: Update and delete events (admin only)
- **Beautiful UI**: Modern design with animations
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React, React Router, Framer Motion, Axios
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd campus_event_management_system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up MySQL database**
   - Create a MySQL database named `campus_events`
   - Update the `.env` file with your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=campus_events
     PORT=5000
     JWT_SECRET=your-secret-key-change-this-in-production
     ```
   - **JWT_SECRET**: Use any random string for development (e.g., `my-secret-jwt-key-12345`). For production, use a strong random string (32+ characters). Generate one with: `openssl rand -base64 32`

4. **Start the application**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and frontend (port 3000).

## Default Admin Credentials

- **Email**: admin@campus.edu
- **Password**: admin123

## Project Structure

```
campus_event_management_system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   └── App.js
│   └── package.json
├── server/                 # Express backend
│   └── index.js           # Server entry point
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events (optional query: ?status=upcoming|completed)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Registrations
- `POST /api/registrations` - Register for an event

### Feedback
- `POST /api/feedback` - Submit feedback for an event

## Usage

1. **View Events**: Navigate to the home page to see upcoming events
2. **Register for Event**: Click "Register" button (requires login)
3. **Submit Feedback**: For completed events, click "Feedback" button
4. **Admin Functions**: Login as admin to update/delete events

## Database Schema

The application automatically creates the following tables:
- `users` - User accounts (students and admins)
- `events` - Event information
- `registrations` - Event registrations
- `feedback` - Event feedback

## Development

- Backend runs on: http://localhost:5000
- Frontend runs on: http://localhost:3000

## License

MIT

