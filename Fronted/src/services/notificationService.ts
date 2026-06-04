import api from "./axiosInstance";
import { Notification } from "../types";

export const notificationService = {
  async getNotifications() {
    const res = await api.get<Notification[]>("/notifications");
    return res.data;
  },

  async markAllAsRead() {
    const res = await api.put<{ success: boolean }>("/notifications/read");
    return res.data;
  },
};