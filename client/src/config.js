// API Configuration
// For production: Set REACT_APP_API_URL environment variable
// For local development: Uses localhost or IP address
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com' 
    : 'http://192.168.31.173:5000');

export default API_BASE_URL;

