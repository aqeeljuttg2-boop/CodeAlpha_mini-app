import api from "./axiosInstance";
import { Post } from "../types";

export const commentService = {
  async addComment(postId: string, content: string) {
    const res = await api.post<Post>(`/comments/${postId}/comment`, { content });
    return res.data;
  },

  async likeComment(postId: string, commentId: string) {
    const res = await api.put<Post>(`/comments/${postId}/comment_like`, { commentId });
    return res.data;
  },

  async addCommentReply(postId: string, commentId: string, content: string) {
    const res = await api.post<Post>(`/comments/${postId}/comment_reply`, {
      commentId,
      content,
    });
    return res.data;
  },
};