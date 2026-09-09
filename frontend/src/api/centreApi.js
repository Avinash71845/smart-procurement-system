import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const getNearbyCentres = async (latitude, longitude) => {

    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_BASE_URL}/api/procurement-centres/nearby`,
        {
            params: {
                latitude: latitude,
                longitude: longitude
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};