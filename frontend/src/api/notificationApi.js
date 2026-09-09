import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/notifications";

// Get all notifications of a farmer
export const getFarmerNotifications = async (farmerId) => {
    const response = await axios.get(
        `${API_BASE_URL}/farmer/${farmerId}`
    );

    return response.data;
};

// Get unread notifications
export const getUnreadNotifications = async (farmerId) => {
    const response = await axios.get(
        `${API_BASE_URL}/farmer/${farmerId}/unread`
    );

    return response.data;
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    const response = await axios.put(
        `${API_BASE_URL}/${notificationId}/read`
    );

    return response.data;
};

// Delete notification
export const deleteNotification = async (notificationId) => {
    await axios.delete(
        `${API_BASE_URL}/${notificationId}`
    );
};