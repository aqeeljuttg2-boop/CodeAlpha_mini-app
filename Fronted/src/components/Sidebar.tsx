/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, MessageCircle, Bell, User, Settings, LogOut, Hexagon, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Avatar } from './Avatar';

interface SidebarProps {
  onLinkClick?: () => void;
  id?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLinkClick, id }) => {
  const { user, logout } = useAuth();
  const { unreadNotificationsCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    if (onLinkClick) onLinkClick();
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Messages', path: '/messages', icon: MessageCircle },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { name: 'Profile', path: user ? `/profile/${user.username}` : '#', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div
      id={id}
      className="
        flex flex-col h-full bg-transparent
        p-5 md:p-6 shrink-0 relative select-none
      "
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 px-2 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/15">
          <Hexagon className="w-6 h-6 fill-white/10" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-slate-400 font-display">
            ConnectHub
          </span>
          <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest leading-none">
            v1.2.0
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-1.5 grow overflow-y-auto">
        {navItems.map((item) => {
          const isItemActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onLinkClick}
              className={`
                flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-[13.5px] transition-all duration-200
                ${isItemActive
                  ? 'bg-zinc-200/60 dark:bg-white/5 text-indigo-600 dark:text-cyan-400 font-bold shadow-xs'
                  : 'text-zinc-650 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3.5">
                <item.icon className="w-5 h-5" strokeWidth={isItemActive ? 2.5 : 2} />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Active User Footer Section */}
      {user && (
        <div className="border-t border-zinc-200/20 dark:border-white/5 pt-5 mt-auto flex flex-col gap-4 shrink-0">
          <NavLink
            to={`/profile/${user.username}`}
            onClick={onLinkClick}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
          >
            <Avatar src={user.avatar} name={user.name} isVerified={user.isVerified} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-zinc-800 dark:text-slate-200 truncate">
                {user.name}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-slate-500 truncate">
                @{user.username}
              </span>
            </div>
          </NavLink>

          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-[13px] text-red-500
              hover:bg-red-550/10 dark:hover:bg-red-500/5 transition-all cursor-pointer select-none
            "
          >
            <LogOut className="w-5 h-5 text-red-500" strokeWidth={2.5} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
