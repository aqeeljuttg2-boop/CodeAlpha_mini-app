import api from "./axiosInstance";
import { User, CurrentUser, TrendingTag } from "../types";

export const userService = {
  async getProfile(username: string) {
    const res = await api.get<User>(`/users/${username}`);
    return res.data;
  },

  async followUser(username: string) {
    const res = await api.post<{ success: boolean }>(`/users/${username}/follow`);
    return res.data;
  },

  async updateProfile(profileData: Partial<CurrentUser>) {
    const res = await api.put<CurrentUser>(`/users/update`, profileData);
    return res.data;
  },

  async getExploreData() {
    const res = await api.get<{ trending: TrendingTag[]; creators: User[] }>(`/explore`);
    return res.data;
  },

  async search(query: string) {
    const res = await api.post<{ posts: any[]; users: User[] }>(`/explore/search`, {
      query,
    });
    return res.data;
  },
};