// Central API base URL configuration
// In development: uses localhost
// In production: uses the deployed backend URL from env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default API_URL;
