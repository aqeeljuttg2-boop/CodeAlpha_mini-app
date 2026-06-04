/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCard } from './UserCard';
import { TrendingUp, Activity, Award, UserCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface RightSidebarProps {
  id?: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ id }) => {
  const { suggestedUsers, trendingTags } = useApp();
  const navigate = useNavigate();

  const handleHashtagClick = (tag: string) => {
    navigate(`/explore?q=${encodeURIComponent(tag)}`);
  };

  const recentActivities = [
    { id: 'act_1', user: 'Alex Rivera', description: 'published layout optimizations', time: '12m ago' },
    { id: 'act_2', user: 'Sarah Jenkins', description: 'uploaded new checkout assets', time: '45m ago' },
    { id: 'act_3', user: 'Marcus Chen', description: 'referenced your research paper', time: '2h ago' },
  ];

  return (
    <div
      id={id}
      className="
        hidden xl:flex flex-col gap-6 w-[320px] shrink-0 p-5 bg-transparent select-none
        h-[calc(100vh-64px)] overflow-y-auto pr-1
      "
    >
      {/* 1. Suggested Users Creators Card */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-3.5 px-1 select-none">
          <UserCheck className="w-4.5 h-4.5 text-cyan-500" strokeWidth={2.5} />
          <h3 className="text-[12px] font-bold text-zinc-800 dark:text-slate-300 uppercase tracking-widest font-display">
            Who to follow
          </h3>
        </div>
        <div className="flex flex-col gap-2.5">
          {suggestedUsers.length === 0 ? (
            <p className="text-xs text-zinc-450 dark:text-slate-500 py-3 text-center">
              You are connected with everyone! 🎉
            </p>
          ) : (
            suggestedUsers.slice(0, 3).map((user) => (
              <UserCard key={user.id} user={user} showBio={false} />
            ))
          )}
        </div>
      </div>

      {/* 2. Trending Topics Card */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-3.5 px-1 select-none">
          <TrendingUp className="w-4.5 h-4.5 text-cyan-500" strokeWidth={2.5} />
          <h3 className="text-[12px] font-bold text-zinc-800 dark:text-slate-300 uppercase tracking-widest font-display">
            Trending hashtags
          </h3>
        </div>
        <div className="flex flex-col divide-y divide-zinc-200/20 dark:divide-white/5">
          {trendingTags.slice(0, 5).map((t, idx) => (
            <Link
              key={t.id}
              to={`/explore?q=${encodeURIComponent(t.tag)}`}
              className="
                group w-full text-left py-2.5 flex justify-between items-center cursor-pointer transition-colors
                first:pt-1 last:pb-1
              "
            >
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-zinc-800 dark:text-slate-300 group-hover:text-cyan-400 group-hover:underline truncate transition-colors">
                  #{t.tag}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-slate-500 mt-0.5">
                  {t.postsCount.toLocaleString()} posts
                </span>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-slate-400 bg-zinc-200/50 dark:bg-white/5 px-2 py-1 rounded-md">
                #{idx + 1}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Recent Activity Log */}
      <div className="glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-2 mb-3.5 px-1 select-none">
          <Activity className="w-4.5 h-4.5 text-cyan-500" strokeWidth={2.5} />
          <h3 className="text-[12px] font-bold text-zinc-800 dark:text-slate-300 uppercase tracking-widest font-display">
            Workspace Activity
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          {recentActivities.map((act) => (
            <div key={act.id} className="flex flex-col gap-0.5">
              <p className="text-xs text-zinc-750 dark:text-slate-300 leading-snug">
                <span className="font-bold text-zinc-950 dark:text-white">
                  {act.user}
                </span>{' '}
                {act.description}
              </p>
              <span className="text-[9.5px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wide">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
