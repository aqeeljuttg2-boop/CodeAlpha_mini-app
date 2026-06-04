/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Image, Smile, Trash2, Globe, ShieldCheck } from 'lucide-react';

interface CreatePostProps {
  id?: string;
  placeholder?: string;
  onSuccess?: () => void;
}

const PREMIUM_PHOTOS = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600', // technology
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', // tech developer workspace
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600', // tech device
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600', // globe tech
  'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600', // mountains nature
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600', // misty trees nature
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600'  // forest pathway
];

export const CreatePost: React.FC<CreatePostProps> = ({ id, placeholder = "What's on your mind today, explorer?", onSuccess }) => {
  const { user } = useAuth();
  const { createPost } = useApp();
  
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const CHARACTER_LIMIT = 500;
  const EMOJIS = ['🚀', '🔥', '💡', '💻', '🎨', '✨', '🌍', '📊', '🙌', '💯', '☕', '🧠'];

  const handlePost = async () => {
    if (!content.trim() && !image) return;

    setIsSubmitting(true);
    const success = await createPost(content, image || undefined);
    if (success) {
      setContent('');
      setImage(null);
      setShowEmoji(false);
      if (onSuccess) onSuccess();
    }
    setIsSubmitting(false);
  };

  const handleAddSampleImage = () => {
    // Pick random Unsplash image
    const randomIdx = Math.floor(Math.random() * PREMIUM_PHOTOS.length);
    setImage(PREMIUM_PHOTOS[randomIdx]);
  };

  const insertEmoji = (emoji: string) => {
    if (content.length + emoji.length <= CHARACTER_LIMIT) {
      setContent((prev) => prev + emoji);
    }
    setShowEmoji(false);
  };

  return (
    <div
      id={id}
      className="
        w-full p-5 glass-panel rounded-2xl
        mb-5 flex flex-col gap-4 self-stretch
      "
    >
      <div className="flex gap-3.5 items-start bg-transparent">
        {user && (
          <Avatar src={user.avatar} name={user.name} isVerified={user.isVerified} size="sm" />
        )}
        <div className="flex flex-col grow">
          <div className="flex items-center gap-1.5 select-none mb-1.5">
            {user && (
              <span className="text-xs font-bold text-zinc-900 dark:text-slate-200">
                {user.name}
              </span>
            )}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-200/50 dark:bg-white/5 text-[9.5px] text-zinc-650 dark:text-slate-400 font-semibold tracking-wider uppercase">
              <Globe className="w-2.5 h-2.5" />
              <span>Public</span>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.substring(0, CHARACTER_LIMIT))}
            placeholder={placeholder}
            rows={3}
            className="
              w-full text-sm text-zinc-805 dark:text-zinc-105 placeholder-zinc-400 bg-transparent
              outline-none resize-none min-h-[70px] py-1 border-0 focus:ring-0 leading-relaxed font-sans
            "
          />
        </div>
      </div>

      {/* Uploaded Mock Image Preview */}
      {image && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-150 dark:border-zinc-800 select-none bg-zinc-50 dark:bg-zinc-950">
          <img src={image} alt="Upload attachment" className="w-full max-h-[250px] object-cover" />
          <button
            onClick={() => setImage(null)}
            className="absolute top-3 right-3 p-1.5 bg-zinc-950/70 hover:bg-zinc-950 text-white rounded-full transition-transform active:scale-95 cursor-pointer"
            title="Remove attachment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor Footer Tools */}
      <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-850 pt-3.5 mt-1 relative select-none">
        
        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Sample Image mock injection */}
          <button
            type="button"
            onClick={handleAddSampleImage}
            className="
              flex items-center gap-2 p-2 rounded-lg text-zinc-500 hover:text-blue-500
              hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all cursor-pointer font-medium
            "
            title="Attach a sample stock photo"
          >
            <Image className="w-5 h-5" />
            <span className="text-xs hidden sm:inline">Add Image</span>
          </button>

          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="
              flex items-center gap-2 p-2 rounded-lg text-zinc-500 hover:text-amber-500
              hover:bg-amber-50/50 dark:hover:bg-amber-500/5 transition-all cursor-pointer font-medium
            "
            title="Insert emoji"
          >
            <Smile className="w-5 h-5" />
            <span className="text-xs hidden sm:inline">Feelings</span>
          </button>
        </div>

        {/* Create Post Emoji popups absolute panel */}
        {showEmoji && (
          <div className="absolute left-0 bottom-14 glass-panel border border-zinc-200/40 dark:border-white/10 rounded-xl p-2.5 shadow-lg flex gap-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {EMOJIS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-lg hover:scale-120 transition-transform cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Character & Post triggers */}
        <div className="flex items-center gap-4.5">
          <span className={`text-[10px] font-bold tracking-wider ${content.length > CHARACTER_LIMIT - 50 ? 'text-amber-500' : 'text-zinc-400 dark:text-zinc-550'}`}>
            {content.length} / {CHARACTER_LIMIT}
          </span>
          <Button
            onClick={handlePost}
            variant="primary"
            disabled={!content.trim() && !image}
            loading={isSubmitting}
            size="sm"
            className="font-bold cursor-pointer rounded-full"
          >
            Publish Post
          </Button>
        </div>
      </div>
    </div>
  );
};
