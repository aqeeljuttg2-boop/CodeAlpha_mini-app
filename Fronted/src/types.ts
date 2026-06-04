/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  website?: string;
  location?: string;
  joinDate: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isVerified?: boolean;
  isFollowing?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: Comment[];
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  post?: {
    id: string;
    content: string;
  };
  timestamp: string;
  read: boolean;
  text: string;
}

export interface TrendingTag {
  id: string;
  tag: string;
  postsCount: number;
}

export interface CurrentUser extends User {
  email: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
