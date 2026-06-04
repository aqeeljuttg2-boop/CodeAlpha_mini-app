import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Post, Comment, Notification, User, TrendingTag } from "../types";
import { postService } from "../services/postService";
import { commentService } from "../services/commentService";
import { userService } from "../services/userService";
import { notificationService } from "../services/notificationService";
import { useAuth } from "./AuthContext";

interface AppContextType {
  posts: Post[];
  suggestedUsers: User[];
  trendingTags: TrendingTag[];
  notifications: Notification[];
  isLoadingPosts: boolean;
  isLoadingNotifications: boolean;
  isLoadingExplore: boolean;
  unreadNotificationsCount: number;

  fetchPosts: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  createPost: (content: string, image?: string) => Promise<boolean>;
  likePost: (postId: string) => Promise<void>;
  bookmarkPost: (postId: string) => Promise<void>;

  addComment: (postId: string, content: string) => Promise<void>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
  addCommentReply: (postId: string, commentId: string, content: string) => Promise<void>;

  followUser: (username: string) => Promise<void>;
  triggerSearch: (q: string) => Promise<{ posts: Post[]; users: User[] }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [trendingTags, setTrendingTags] = useState<TrendingTag[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isLoadingExplore, setIsLoadingExplore] = useState(false);

  // -----------------------
  // FETCH POSTS
  // -----------------------
  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    try {
      const resp = await postService.getPosts();
      setPosts(resp || []);
    } catch (e) {
      console.error("Error fetching posts", e);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  // -----------------------
  // FETCH EXPLORE (TRENDING / SUGGESTED)
  // -----------------------
  const fetchExploreData = useCallback(async () => {
    setIsLoadingExplore(true);
    try {
      const resp = await userService.getExploreData(); // { trending, creators }
      setTrendingTags(resp.trending || []);
      const creators = resp.creators || [];
      setSuggestedUsers(creators.filter((u) => u.username !== user?.username));
    } catch (e) {
      console.error("Error fetching explore data", e);
    } finally {
      setIsLoadingExplore(false);
    }
  }, [user]);

  // -----------------------
  // FETCH NOTIFICATIONS
  // -----------------------
  const fetchNotifications = useCallback(async () => {
    setIsLoadingNotifications(true);
    try {
      const resp = await notificationService.getNotifications();
      setNotifications(resp || []);
    } catch (e) {
      console.error("Error fetching notifications", e);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, []);

  // -----------------------
  // INITIAL DATA LOAD
  // -----------------------
  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchExploreData();
      fetchNotifications();
    } else {
      setPosts([]);
      setSuggestedUsers([]);
      setTrendingTags([]);
      setNotifications([]);
    }
  }, [user, fetchPosts, fetchExploreData, fetchNotifications]);

  // -----------------------
  // CREATE POST
  // -----------------------
  const createPost = async (content: string, image?: string) => {
    try {
      const resp = await postService.createPost(content, image);
      setPosts((prev) => [resp, ...prev]);
      fetchExploreData();
      return true;
    } catch (e) {
      console.error("Error creating post", e);
      return false;
    }
  };

  // -----------------------
  // LIKE POST
  // -----------------------
  const likePost = async (postId: string) => {
    try {
      const resp = await postService.likePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: resp.likes, isLiked: resp.isLiked } : p))
      );
      fetchNotifications();
    } catch (e) {
      console.error("Error liking post", e);
    }
  };

  // -----------------------
  // BOOKMARK POST
  // -----------------------
  const bookmarkPost = async (postId: string) => {
    try {
      const resp = await postService.bookmarkPost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isBookmarked: resp.isBookmarked } : p))
      );
    } catch (e) {
      console.error("Error bookmarking post", e);
    }
  };

  // -----------------------
  // COMMENT
  // -----------------------
  const addComment = async (postId: string, content: string) => {
    try {
      const resp = await commentService.addComment(postId, content);
      setPosts((prev) => prev.map((p) => (p.id === postId ? resp : p)));
      fetchNotifications();
    } catch (e) {
      console.error("Error adding comment", e);
    }
  };

  const likeComment = async (postId: string, commentId: string) => {
    try {
      const resp = await commentService.likeComment(postId, commentId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? resp : p)));
    } catch (e) {
      console.error("Error liking comment", e);
    }
  };

  const addCommentReply = async (postId: string, commentId: string, content: string) => {
    try {
      const resp = await commentService.addCommentReply(postId, commentId, content);
      setPosts((prev) => prev.map((p) => (p.id === postId ? resp : p)));
    } catch (e) {
      console.error("Error adding reply", e);
    }
  };

  // -----------------------
  // FOLLOW USER
  // -----------------------
  const followUser = async (username: string) => {
    try {
      const resp = await userService.followUser(username); // { success: true }
      if (resp.success) {
        setSuggestedUsers((prev) =>
          prev.map((u) =>
            u.username === username
              ? { ...u, isFollowing: !u.isFollowing, followersCount: u.followersCount + (u.isFollowing ? -1 : 1) }
              : u
          )
        );

        setPosts((prev) =>
          prev.map((p) =>
            p.user.username === username
              ? {
                  ...p,
                  user: {
                    ...p.user,
                    isFollowing: !p.user.isFollowing,
                    followersCount: p.user.followersCount + (p.user.isFollowing ? -1 : 1),
                  },
                }
              : p
          )
        );

        fetchNotifications();
      }
    } catch (e) {
      console.error("Error following user", e);
    }
  };

  // -----------------------
  // SEARCH
  // -----------------------
  const triggerSearch = async (q: string) => {
    try {
      const resp = await userService.search(q);
      return resp || { posts: [], users: [] };
    } catch (e) {
      console.error("Search error", e);
      return { posts: [], users: [] };
    }
  };

  // -----------------------
  // MARK NOTIFICATIONS
  // -----------------------
  const markAllNotificationsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error("Error marking notifications read", e);
    }
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        posts,
        suggestedUsers,
        trendingTags,
        notifications,
        isLoadingPosts,
        isLoadingNotifications,
        isLoadingExplore,
        unreadNotificationsCount,
        fetchPosts,
        fetchNotifications,
        markAllNotificationsRead,
        createPost,
        likePost,
        bookmarkPost,
        addComment,
        likeComment,
        addCommentReply,
        followUser,
        triggerSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};