import axios from "axios";

const paymentApi = axios.create({
  baseURL: "/api/payments",
  headers: { "Content-Type": "application/json" },
});

paymentApi.interceptors.request.use((config) => {
  const token = config.meta?.farmerAuth
    ? localStorage.getItem("FARMER_JWT") || localStorage.getItem("token")
    : localStorage.getItem("OPERATOR_JWT") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Create or issue payment for a booking (Operator)
export const createPayment = (bookingId, amount, status = "PENDING", transactionId = "") =>
  paymentApi
    .post(
      "",
      { bookingId, amount: Number(amount), status, transactionId },
      { meta: { operatorAuth: true } }
    )
    .then((response) => response.data);

// Convenient alias for creating/issuing payment
export const givePayment = (bookingId, amount, status = "PAID", transactionId = "") =>
  createPayment(bookingId, amount, status, transactionId);

// Get single payment by payment ID
export const getPaymentById = (paymentId) =>
  paymentApi
    .get(`/${paymentId}`, { meta: { operatorAuth: true } })
    .then((response) => response.data);

// Get payment by booking ID
export const getPaymentByBooking = (bookingId) =>
  paymentApi
    .get(`/booking/${bookingId}`, { meta: { operatorAuth: true } })
    .then((response) => response.data);

// Farmer: Get payment for a specific booking
export const getMyPayment = (bookingId) =>
  paymentApi
    .get(`/my/${bookingId}`, { meta: { farmerAuth: true } })
    .then((response) => response.data);

// Farmer: Get all bookings with payment statuses for logged-in farmer
export const getMyPayments = () =>
  paymentApi
    .get("/my-payments", { meta: { farmerAuth: true } })
    .then((response) => response.data);

// Operator: Get all booked farmers with payment details
export const getBookedFarmers = (centreId = null) => {
  const params = centreId ? { centreId } : {};
  return paymentApi
    .get("/operator/booked-farmers", {
      params,
      meta: { operatorAuth: true },
    })
    .then((response) => response.data);
};

// Operator: Get payment & booking metrics summary
export const getOperatorPaymentSummary = () =>
  paymentApi
    .get("/operator/summary", { meta: { operatorAuth: true } })
    .then((response) => response.data);

// Operator: Update payment status, transaction ID, and amount
export const updatePaymentStatus = (paymentId, status, transactionId = "", amount = null) => {
  const payload = { status, transactionId };
  if (amount !== null && amount !== undefined) {
    payload.amount = Number(amount);
  }
  return paymentApi
    .patch(`/${paymentId}`, payload, { meta: { operatorAuth: true } })
    .then((response) => response.data);
};

// Operator: Mark payment as paid
export const markPaymentPaid = (paymentId, transactionId) =>
  updatePaymentStatus(paymentId, "PAID", transactionId);

export default paymentApi;
