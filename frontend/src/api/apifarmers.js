// src/api/axiosClient.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("FARMER_JWT") || "FARMER_JWT";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
