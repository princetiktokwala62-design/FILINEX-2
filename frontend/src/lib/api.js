import axios from "axios";

// On Vercel (same-origin deployment), REACT_APP_BACKEND_URL can be empty so
// API calls hit "/api/*" which Vercel routes to the Python serverless function.
// In local dev, it's set to the preview URL.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

// Attach admin token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("filinex_admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
