import axios from "./axios";

export const getNotifications = async () => {
  const response = axios.get(
    "/notifications?page=1&limit=10&unread_only=true"
  );
  return response;
};

export const getUnreadCount = async () => {
  const response = axios.get("/notifications/unread-count");
  return response;
};

export const markAsRead = async (notification_id) => {
  const response = axios.patch(`/notifications/${notification_id}/read`);
  return response;
};

export const markAllAsRead = async () => {
  const response = axios.patch("/notifications/mark-all-read");
  return response;
};

export const deleteNotification = async (notification_id) => {
  const response = axios.delete(`/notifications/${notification_id}`);
  return response;
};