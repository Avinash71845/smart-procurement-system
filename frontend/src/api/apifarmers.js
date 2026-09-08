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
  const token =
    localStorage.getItem("FARMER_JWT") ||
    localStorage.getItem("token") ||
    localStorage.getItem("OPERATOR_JWT");
  if (token) {
    config.headers.Authorization = `Bearer ${token.replace(/^"|"$/g, "").trim()}`;
  }
  return config;
});

export default api;
