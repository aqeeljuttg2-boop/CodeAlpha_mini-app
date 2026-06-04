/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Reply, ShieldCheck, Send } from 'lucide-react';
import { Comment } from '../types';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { Button } from './Button';

interface CommentCardProps {
  comment: Comment;
  postId: string;
  isReply?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, postId, isReply = false }) => {
  const { likeComment, addCommentReply } = useApp();
  
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = () => {
    likeComment(postId, comment.id);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    await addCommentReply(postId, comment.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
    setIsSubmitting(false);
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${isReply ? 'pl-4 border-l border-zinc-200/20 dark:border-white/5' : ''}`}>
      <div className="flex gap-2.5 items-start">
        {/* Avatar */}
        <Avatar src={comment.user.avatar} name={comment.user.name} isVerified={comment.user.isVerified} size="xs" />

        {/* Content Box */}
        <div className="flex flex-col grow min-w-0 bg-black/5 dark:bg-white/[0.02] border border-zinc-200/10 dark:border-white/5 p-3 rounded-2xl">
          <div className="flex items-center gap-1.5 justify-between select-none">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[12.5px] font-bold text-zinc-950 dark:text-white truncate">
                {comment.user.name}
              </span>
              {comment.user.isVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 fill-cyan-400/10" />
              )}
              <span className="text-[10px] text-zinc-400 dark:text-slate-500 shrink-0 font-sans">
                • {comment.timestamp}
              </span>
            </div>
          </div>
          
          <p className="text-[13px] text-zinc-750 dark:text-slate-300 mt-1 leading-normal font-sans">
            {comment.content}
          </p>

          {/* Action Row */}
          <div className="flex gap-4.5 mt-2.5 items-center text-[10.5px] font-bold text-zinc-550 dark:text-slate-400 select-none">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors hover:text-rose-500 cursor-pointer ${comment.isLiked ? 'text-rose-500' : ''}`}
            >
              <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-500' : ''}`} strokeWidth={2.5} />
              <span>{comment.likes}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 transition-colors hover:text-cyan-400 cursor-pointer"
              >
                <Reply className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span>Reply</span>
               </button>
            )}
          </div>
        </div>
      </div>

      {/* Inline Reply input system */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="flex gap-2 pl-9 items-end mt-1 animate-in fade-in slide-in-from-top-1 duration-150">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${comment.user.name}...`}
            className="
              grow text-xs rounded-xl border border-zinc-200/40 dark:border-white/10 px-3.5 py-1.5 h-8
              bg-black/5 dark:bg-black/30 text-zinc-900 dark:text-slate-200 placeholder-zinc-400 outline-none
              focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all
            "
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!replyText.trim()}
            loading={isSubmitting}
            className="px-2.5 h-8 text-[11px] rounded-lg gap-1"
          >
            <Send className="w-3 h-3" />
            <span>Send</span>
          </Button>
        </form>
      )}

      {/* Nested Comment Replies List */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-3.5 mt-2 pl-9">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} postId={postId} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );
};
