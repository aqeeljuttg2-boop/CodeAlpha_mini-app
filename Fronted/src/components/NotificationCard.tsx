/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, MessageSquare, UserPlus, AtSign, ShieldAlert } from 'lucide-react';
import { Notification } from '../types';
import { Avatar } from './Avatar';
import { Link } from 'react-router-dom';

interface NotificationCardProps {
  notification: Notification;
  id?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, id }) => {
  const icons = {
    like: <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" strokeWidth={2.5} />,
    comment: <MessageSquare className="w-5 h-5 text-blue-500 fill-blue-500/20" strokeWidth={2.5} />,
    follow: <UserPlus className="w-5 h-5 text-emerald-500 fill-emerald-500/20" strokeWidth={2.5} />,
    mention: <AtSign className="w-5 h-5 text-purple-500 fill-purple-500/20" strokeWidth={2.5} />
  };

  const colors = {
    like: 'border-l-rose-500 bg-rose-50/5 dark:bg-rose-500/2',
    comment: 'border-l-blue-500 bg-blue-50/5 dark:bg-blue-500/2',
    follow: 'border-l-emerald-500 bg-emerald-50/5 dark:bg-emerald-500/2',
    mention: 'border-l-purple-500 bg-purple-50/5 dark:bg-purple-500/2'
  };

  const linkToProfile = `/profile/${notification.user.username}`;

  return (
    <div
      id={id}
      className={`
        flex gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-850 border-l-4 transition-all duration-200
        ${colors[notification.type]}
        ${notification.read ? 'opacity-85' : 'shadow-sm ring-1 ring-zinc-50/5 dark:ring-blue-500/5'}
      `}
    >
      {/* Event Indicator Icon */}
      <div className="shrink-0 pt-1 select-none">
        {icons[notification.type] || <ShieldAlert className="w-5 h-5 text-amber-500" />}
      </div>

      {/* User Details */}
      <div className="flex gap-3 grow min-w-0">
        <Link to={linkToProfile} className="block shrink-0 transition-transform hover:scale-102">
          <Avatar src={notification.user.avatar} name={notification.user.name} isVerified={notification.user.isVerified} size="sm" />
        </Link>
        <div className="flex flex-col min-w-0 pr-2">
          <div className="text-zinc-800 dark:text-zinc-200 text-[13px] leading-relaxed">
            <Link to={linkToProfile} className="font-bold text-zinc-900 dark:text-zinc-100 hover:underline">
              {notification.user.name}
            </Link>{' '}
            <span className="text-zinc-500 dark:text-zinc-400">@{notification.user.username}</span>{' '}
            <span className="text-zinc-650 dark:text-zinc-300 font-medium">{notification.text}</span>
          </div>

          {/* Reference post snippet if applicable */}
          {notification.post && (
            <p className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-3 mt-2 text-xs italic text-zinc-455 dark:text-zinc-500 line-clamp-1 py-0.5">
              "{notification.post.content}"
            </p>
          )}

          {/* Timestamp */}
          <span className="text-[10px] text-zinc-400 dark:text-zinc-550 mt-1.5 font-bold tracking-wider uppercase select-none">
            {notification.timestamp}
          </span>
        </div>
      </div>

      {/* Unread circle badge */}
      {!notification.read && (
        <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse self-center" />
      )}
    </div>
  );
};
