import api from "./axiosInstance";
import { CurrentUser } from "../types";

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<{ user: CurrentUser; token: string }>(
      "/auth/login",
      { email, password }
    );
    return res.data;
  },

  async register(fullName: string, username: string, email: string, password: string) {
    const res = await api.post<{ user: CurrentUser; token: string }>(
      "/auth/register",
      { fullName, username, email, password }
    );
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get<CurrentUser>("/auth/me");
    return res.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },
};