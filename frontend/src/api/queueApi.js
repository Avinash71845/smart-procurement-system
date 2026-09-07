import axios from "axios";

const queueApi = axios.create({
  baseURL: "http://localhost:8080/queue",
  headers: {
    "Content-Type": "application/json",
  },
});

queueApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("OPERATOR_JWT") ||
    localStorage.getItem("JWT_TOKEN") ||
    localStorage.getItem("FARMER_JWT");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const checkInBooking = (bookingId) =>
  queueApi.post("/check-in", { bookingId }).then((response) => response.data);

export const getWaitingQueue = () =>
  queueApi.get("/waiting").then((response) => response.data);

export const getCurrentQueue = () =>
  queueApi.get("/current").then((response) => response.data);

export const callNextFarmer = () =>
  queueApi.post("/call-next").then((response) => response.data);

export const startQueueProcessing = (bookingId) =>
  queueApi.post("/start", { bookingId }).then((response) => response.data);

export const completeQueueProcessing = (bookingId) =>
  queueApi.post("/complete", { bookingId }).then((response) => response.data);

export default queueApi;
