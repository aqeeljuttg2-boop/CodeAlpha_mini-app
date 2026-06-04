/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationCard } from '../components/NotificationCard';
import { Loader } from '../components/Loader';
import { Bell, CheckSquare, Trash2, MailOpen } from 'lucide-react';
import { Button } from '../components/Button';

export const Notifications: React.FC = () => {
  const { notifications, isLoadingNotifications, markAllNotificationsRead } = useApp();

  // Highlight or mark as read after viewing
  useEffect(() => {
    // Optionally auto-clear after 1.5 seconds of viewing the archive
    const timer = setTimeout(() => {
      markAllNotificationsRead();
    }, 1500);
    return () => clearTimeout(timer);
  }, [markAllNotificationsRead]);

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header Operations Row */}
      <div className="flex items-center justify-between mb-6 px-1 select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5.5 h-5.5 text-blue-600 dark:text-blue-500" strokeWidth={2.5} />
          <h2 className="text-[17px] font-black text-zinc-900 dark:text-zinc-50 tracking-tight font-sans">
            Notifications Log
          </h2>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button
            onClick={handleMarkAllRead}
            variant="ghost"
            size="sm"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 cursor-pointer rounded-xl flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {/* Notifications Body List */}
      {isLoadingNotifications ? (
        <Loader type="post-skeleton" count={1} />
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 rounded-2xl text-center gap-3 select-none">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-zinc-950 flex items-center justify-center text-blue-600 dark:text-blue-500 shadow-sm">
            <MailOpen className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Inbox cleanly cleared
          </h4>
          <p className="text-xs text-zinc-450 dark:text-zinc-500 max-w-xs mt-0.5 leading-relaxed">
            You don't have any notifications yet. Any upvotes/likes, nested reviews, or follow events on your account are output directly here!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 font-sans animate-in fade-in duration-300">
          {notifications.map((notif) => (
            <NotificationCard key={notif.id} notification={notif} />
          ))}
        </div>
      )}
    </div>
  );
};
export default Notifications;
