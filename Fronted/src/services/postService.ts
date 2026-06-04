import api from "./axiosInstance";
import { Post } from "../types";

export const postService = {
  async getPosts() {
    const res = await api.get<Post[]>("/posts");
    return res.data;
  },

  async createPost(content: string, image?: string) {
    const res = await api.post<Post>("/posts", { content, image });
    return res.data;
  },

  async likePost(postId: string) {
    const res = await api.put<Post>(`/posts/${postId}/like`);
    return res.data;
  },

  async bookmarkPost(postId: string) {
    const res = await api.put<Post>(`/posts/${postId}/bookmark`);
    return res.data;
  },
};