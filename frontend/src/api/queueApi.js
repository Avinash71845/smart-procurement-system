import axios from "axios";

const queueApi = axios.create({
  baseURL: "/queue",
  headers: {
    "Content-Type": "application/json",
  },
});

queueApi.interceptors.request.use((config) => {
  const token = config.meta?.farmerAuth
    ? localStorage.getItem("FARMER_JWT") || localStorage.getItem("token")
    : localStorage.getItem("OPERATOR_JWT");

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

export const getMyQueue = (bookingId) =>
  queueApi
    .get(`/my/${bookingId}`, { meta: { farmerAuth: true } })
    .then((response) => response.data);

export const callNextFarmer = () =>
  queueApi.post("/call-next").then((response) => response.data);

export const startQueueProcessing = (bookingId) =>
  queueApi.post("/start", { bookingId }).then((response) => response.data);

export const completeQueueProcessing = (bookingId) =>
  queueApi.post("/complete", { bookingId }).then((response) => response.data);

export default queueApi;
