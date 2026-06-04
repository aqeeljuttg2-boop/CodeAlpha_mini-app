/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Post, Comment } from '../types';
import { Modal } from './Modal';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { CommentCard } from './CommentCard'; // we will create this next!
import { Send, Smile } from 'lucide-react';

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  id?: string;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ isOpen, onClose, post, id }) => {
  const { addComment } = useApp();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const EMOJIS = ['❤️', '🔥', '👏', '🚀', '⭐', '😂', '💯', '🤔', '🎨', '💻'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    await addComment(post.id, commentText);
    setCommentText('');
    setIsSubmitting(false);
  };

  const handleInsertEmoji = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
    setShowEmoji(false);
  };

  return (
    <Modal id={id} isOpen={isOpen} onClose={onClose} title="Comments Thread">
      <div className="flex flex-col gap-5 max-h-[70vh]">
        
        {/* Original Post Summary Context */}
        <div className="flex gap-3 items-start pb-4 border-b border-zinc-200/10 dark:border-white/5 shrink-0">
          <Avatar src={post.user.avatar} name={post.user.name} isVerified={post.user.isVerified} size="sm" />
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-bold text-zinc-950 dark:text-white truncate">
                {post.user.name}
              </span>
              <span className="text-xs text-zinc-400 dark:text-slate-500 shrink-0">
                • {post.timestamp}
              </span>
            </div>
            <p className="text-xs text-zinc-650 dark:text-slate-350 line-clamp-3">
              {post.content}
            </p>
          </div>
        </div>

        {/* Existing Comments list */}
        <div className="flex flex-col gap-4 overflow-y-auto grow pr-1 scrollbar-thin">
          {post.comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <span className="text-2xl">💬</span>
              <p className="text-sm font-medium text-zinc-455 dark:text-slate-500">
                No comments yet. Start the conversation!
              </p>
            </div>
          ) : (
            post.comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} postId={post.id} />
            ))
          )}
        </div>

        {/* New Comment Submission Box */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-zinc-200/20 dark:border-white/5 pt-4 bg-transparent shrink-0 relative flex flex-col gap-2"
        >
          {showEmoji && (
            <div className="absolute bottom-16 left-0 glass-panel border border-zinc-200/40 dark:border-white/10 rounded-xl p-2.5 shadow-lg flex gap-2 z-10 animate-in fade-in slide-in-from-bottom-2 duration-150">
              {EMOJIS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => handleInsertEmoji(emoji)}
                  className="text-lg hover:scale-120 transition-transform active:scale-95 cursor-pointer filter hover:grayscale-0"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2.5 items-end">
            <div className="relative flex items-center grow">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a supportive comment..."
                rows={1}
                maxLength={280}
                className="
                  w-full min-h-[44px] max-h-[120px] rounded-xl border border-zinc-200/40 dark:border-white/10
                  px-4.5 py-2.5 pr-11 text-sm bg-black/5 dark:bg-black/30 text-zinc-900 dark:text-slate-200
                  outline-none placeholder-zinc-400 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
                  resize-none transition-all scrollbar-none
                "
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className="
                  absolute right-3.5 bottom-3 text-zinc-400 dark:text-zinc-500 hover:text-zinc-650
                  dark:hover:text-zinc-300 transition-colors cursor-pointer
                "
              >
                <Smile className="w-[19px] h-[19px]" />
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={!commentText.trim()}
              loading={isSubmitting}
              className="px-3.5 h-[44px]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-550 px-1 font-semibold tracking-wider uppercase select-none">
            <span>Press Enter to comment</span>
            <span>{commentText.length}/280</span>
          </div>
        </form>
      </div>
    </Modal>
  );
};
