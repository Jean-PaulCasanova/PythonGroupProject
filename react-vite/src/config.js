// API Configuration
// Use empty string for relative URLs when using Vite proxy
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' ? '' : 'https://g3nr3l3ss.onrender.com');

export { API_BASE_URL };