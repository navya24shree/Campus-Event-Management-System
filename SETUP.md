# Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm run install-all
```

This will install dependencies for both the root project (backend) and the client (frontend).

### 2. Database Setup

1. **Create MySQL Database**
   ```sql
   CREATE DATABASE campus_events;
   ```

2. **Configure Environment Variables**
   
   Create a `.env` file in the root directory:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=campus_events
   PORT=5000
   JWT_SECRET=your-secret-key-change-this-in-production
   ```

   Replace `your_mysql_password` with your actual MySQL password.
   
   **For JWT_SECRET:**
   - **Development**: You can use any random string, e.g., `my-super-secret-jwt-key-2024`
   - **Production**: Use a strong, random, cryptographically secure string (at least 32 characters)
   - You can generate one using: `openssl rand -base64 32` or any online secure random string generator
   - **Important**: Never share or commit this secret to version control!

### 3. Start the Application

```bash
npm run dev
```

This command will:
- Start the Express server on port 5000
- Start the React development server on port 3000
- Automatically create database tables on first run

### 4. (Optional) Seed Sample Data

To add sample events to the database:

```bash
npm run seed
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Default Login Credentials

### Admin Account
- **Email**: admin@campus.edu
- **Password**: admin123

### Student Account
- Create a new account using the Register option on the login page

## Troubleshooting

### Database Connection Issues

1. Make sure MySQL is running
2. Verify database credentials in `.env` file
3. Ensure the database `campus_events` exists

### Port Already in Use

If port 5000 or 3000 is already in use:
- Change `PORT` in `.env` for backend
- React will automatically use the next available port

### Module Not Found Errors

Run `npm install` in both root and client directories:
```bash
npm install
cd client
npm install
cd ..
```

## Development Notes

- The database tables are automatically created when the server starts
- The admin user is automatically created on first run
- All API endpoints require authentication except feedback submission

