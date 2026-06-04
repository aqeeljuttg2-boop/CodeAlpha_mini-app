/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface UserCardProps {
  user: User;
  id?: string;
  showBio?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, id, showBio = true }) => {
  const { followUser } = useApp();

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    followUser(user.username);
  };

  const linkToProfile = `/profile/${user.username}`;

  return (
    <div
      id={id}
      className="
        flex items-center justify-between p-3.5 bg-black/5 dark:bg-white/[0.01] border border-zinc-200/10
        dark:border-white/5 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors duration-200
      "
    >
      <div className="flex gap-3 items-center min-w-0 mr-2">
        <Link to={linkToProfile} className="block hover:scale-102 transition-transform shrink-0">
          <Avatar src={user.avatar} name={user.name} isVerified={user.isVerified} size="sm" />
        </Link>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            <Link to={linkToProfile} className="text-sm font-bold text-zinc-950 dark:text-white hover:underline truncate">
              {user.name}
            </Link>
            {user.isVerified && (
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 fill-cyan-400/10" />
            )}
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-slate-500 truncate">
            @{user.username}
          </p>
          {showBio && user.bio && (
            <p className="text-xs text-zinc-500 dark:text-slate-400 mt-1 line-clamp-1">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleFollowToggle}
        className={`
          px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer whitespace-nowrap
          ${user.isFollowing
            ? 'border-zinc-200/20 dark:border-white/10 bg-transparent text-zinc-500 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5'
            : 'border-transparent bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90'
          }
        `}
      >
        {user.isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};
