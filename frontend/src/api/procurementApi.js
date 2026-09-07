import axios from "axios";

const procurementApi = axios.create({
  baseURL: "http://localhost:8080/api/procurement-centres",
  headers: { "Content-Type": "application/json" },
});

procurementApi.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("OPERATOR_JWT") ||
    localStorage.getItem("FARMER_JWT") ||
    localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getActiveCentres = () =>
  procurementApi.get("").then((response) => response.data);

export const getCentre = (centreId) =>
  procurementApi.get(`/${centreId}`).then((response) => response.data);

export const createCentre = (payload) =>
  procurementApi.post("", payload).then((response) => response.data);

export default procurementApi;
