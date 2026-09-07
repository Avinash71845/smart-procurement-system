import axios from "axios";

const paymentApi = axios.create({
  baseURL: "http://localhost:8080/api/payments",
  headers: { "Content-Type": "application/json" },
});

paymentApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("OPERATOR_JWT") ||
    localStorage.getItem("FARMER_JWT") ||
    localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createPayment = (bookingId, amount) =>
  paymentApi.post("", { bookingId, amount }).then((response) => response.data);

export const getPaymentById = (paymentId) =>
  paymentApi.get(`/${paymentId}`).then((response) => response.data);

export const getPaymentByBooking = (bookingId) =>
  paymentApi.get(`/booking/${bookingId}`).then((response) => response.data);

export const getMyPayment = (bookingId) =>
  paymentApi.get(`/my/${bookingId}`).then((response) => response.data);

export const markPaymentPaid = (paymentId, transactionId) =>
  paymentApi
    .patch(`/${paymentId}`, { status: "PAID", transactionId })
    .then((response) => response.data);

export default paymentApi;
