/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Bookmark, Check, ShieldCheck } from 'lucide-react';
import { Post } from '../types';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { useAuth } from '../context/AuthContext';
import { CommentsModal } from './CommentsModal'; // we will create this next!
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  id?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, id }) => {
  const { likePost, bookmarkPost, followUser } = useApp();
  const { user: authUser } = useAuth();
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isOwnPost = authUser?.id === post.user.id;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const linkToProfile = `/profile/${post.user.username}`;

  return (
    <div
      id={id}
      className="
        w-full p-5 glass-panel glass-card-hover rounded-2xl
        flex flex-col gap-4.5
      "
    >
      {/* Header Info */}
      <div className="flex gap-3.5 items-start justify-between">
        <div className="flex gap-3.5 items-center">
          <Link to={linkToProfile} className="block transition-transform hover:scale-102">
            <Avatar src={post.user.avatar} name={post.user.name} isVerified={post.user.isVerified} size="md" />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link to={linkToProfile} className="text-[14.5px] font-bold text-zinc-950 dark:text-white hover:underline">
                {post.user.name}
              </Link>
              {post.user.isVerified && (
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 fill-cyan-400/10" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-450 dark:text-slate-500">
              <span className="hover:underline">@{post.user.username}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Follow/Unfollow button if not own post */}
        {!isOwnPost && (
          <button
            onClick={() => followUser(post.user.username)}
            className={`
              px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer shadow-xs
              ${post.user.isFollowing
                ? 'border-zinc-200/20 dark:border-white/10 bg-transparent text-zinc-500 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5'
                : 'border-transparent bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90'
              }
            `}
          >
            {post.user.isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {/* Body Content */}
      <div className="text-zinc-800 dark:text-slate-200 text-sm leading-relaxed font-sans whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Media Image Preview */}
      {post.image && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-200/15 dark:border-white/5 max-h-[350px] bg-zinc-950">
          <img
            src={post.image}
            alt="Post Attachment"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />
        </div>
      )}

      {/* Action Bar Indicators */}
      <div className="flex justify-between items-center border-t border-zinc-200/20 dark:border-white/5 pt-3.5 mt-0.5 text-xs text-zinc-500 dark:text-slate-400 font-semibold select-none">
        
        {/* Like Button */}
        <button
          onClick={() => likePost(post.id)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-xl transition-colors cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-500/5
            ${post.isLiked ? 'text-rose-500' : 'hover:text-rose-500 text-zinc-500 dark:text-zinc-450'}
          `}
        >
          <Heart
            className={`w-[18px] h-[18px] transition-transform duration-200 ${post.isLiked ? 'fill-rose-500 scale-110' : ''}`}
            strokeWidth={2.5}
          />
          <span>{post.likes}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setIsCommentsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-500 dark:text-zinc-450 hover:text-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-[18px] h-[18px]" strokeWidth={2.5} />
          <span>{post.commentsCount}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-500 dark:text-zinc-450 hover:text-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors cursor-pointer relative"
        >
          <Share2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
          {copied ? (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] text-white bg-indigo-600 rounded shadow-md pointer-events-none whitespace-nowrap animate-bounce font-medium">
              Copied!
            </span>
          ) : (
            <span>Share</span>
          )}
        </button>

        {/* Bookmark Button */}
        <button
          onClick={() => bookmarkPost(post.id)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-xl transition-colors cursor-pointer hover:bg-amber-50/50 dark:hover:bg-amber-500/5
            ${post.isBookmarked ? 'text-amber-500' : 'hover:text-amber-500 text-zinc-500 dark:text-zinc-450'}
          `}
        >
          <Bookmark
            className={`w-[18px] h-[18px] transition-transform duration-200 ${post.isBookmarked ? 'fill-amber-500 scale-102' : ''}`}
            strokeWidth={2.5}
          />
          <span className="sr-only">Bookmark</span>
        </button>
      </div>

      {/* Comments Drawer/Modal Connector */}
      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        post={post}
      />
    </div>
  );
};
