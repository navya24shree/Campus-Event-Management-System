// API base URL resolution
// Priority: explicit env var -> sensible local default
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000';

export default API_BASE_URL;

