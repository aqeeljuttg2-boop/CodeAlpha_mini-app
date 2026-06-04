/**
 * Centralized Axios API adapter.
 * Points to the real Node/Express backend running on port 5000.
 *
 * JWT token is automatically attached from localStorage on every request.
 */

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT Bearer token to every request
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to registration
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      if (window.location.pathname !== "/register") {
        window.location.href = "/register";
      }
    }
    return Promise.reject(error);
  }
);

export default api;