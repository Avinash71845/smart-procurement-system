import axios from "axios";

// Replace port 8080 with your actual Spring Boot server port
const API_BASE_URL = "/auth";

export const loginFarmer = async (credentials) => {
  // credentials: { mobile, password, role }
  const response = await axios.post(`${API_BASE_URL}/login`, credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
