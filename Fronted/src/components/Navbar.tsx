/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Laptop, Search, Hexagon, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { Sidebar } from './Sidebar';

interface NavbarProps {
  id?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ id }) => {
  const { user, logout } = useAuth();
  const { theme, currentAppliedTheme, setThemeMode } = useTheme();
  const { unreadNotificationsCount } = useApp();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  const handleThemeCycle = () => {
    if (theme === 'dark') setThemeMode('light');
    else if (theme === 'light') setThemeMode('system');
    else setThemeMode('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Laptop className="w-4.5 h-4.5 text-zinc-550 dark:text-zinc-400" lg-stroke-width={2.5} />;
    }
    return currentAppliedTheme === 'dark' ? (
      <Moon className="w-4.5 h-4.5 text-blue-400 fill-blue-500/10" strokeWidth={2.5} />
    ) : (
      <Sun className="w-4.5 h-4.5 text-amber-500 fill-amber-500/10" strokeWidth={2.5} />
    );
  };

  const handleMobileLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header
      id={id}
      className="
        glass-nav sticky top-0 z-40 w-full h-[64px]
        px-4 md:px-6 flex items-center justify-between select-none
      "
    >
      {/* Mobile Menu Hamburger Trigger (Left on Mobile) */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="
          lg:hidden p-2 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900
          transition-colors cursor-pointer mr-2
        "
        title="Toggle Menu"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Brand logo (visible on mobile layout if sidebar is hidden) */}
      <div className="flex items-center gap-2.5 lg:hidden mr-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/15">C</div>
          <span className="text-sm font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-slate-400">
            ConnectHub
          </span>
        </Link>
      </div>

      {/* Global Search Bar (Centered context width on desktop, collapsible on mobile) */}
      <form onSubmit={handleSearchSubmit} className="hidden sm:flex grow max-w-sm relative items-center mx-4">
        <Search className="absolute left-4 w-4 h-4 text-zinc-400 dark:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search ConnectHub..."
          className="
            w-full bg-black/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs
            text-zinc-900 dark:text-slate-200 placeholder-zinc-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all
          "
        />
      </form>

      {/* Right Header Operations */}
      <div className="flex items-center gap-2 md:gap-3.5 ml-auto select-none">
        
        {/* Search link for pure mobile layouts */}
        <Link
          to="/explore"
          className="
            sm:hidden p-2 rounded-xl text-zinc-550 dark:text-zinc-455 hover:bg-zinc-100
            dark:hover:bg-zinc-900 transition-colors cursor-pointer
          "
          title="Search"
        >
          <Search className="w-4.5 h-4.5" />
        </Link>

        {/* Theme select keys */}
        <button
          onClick={handleThemeCycle}
          className="
            p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40
            hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all cursor-pointer shadow-xs capitalize flex items-center justify-center
          "
          title={`Theme Mode: ${theme}`}
        >
          {getThemeIcon()}
        </button>

        {/* Notifications Icon on mobile */}
        {user && (
          <Link
            to="/notifications"
            className="
              lg:hidden p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/40
              hover:bg-zinc-100 dark:hover:bg-zinc-900/80 transition-all cursor-pointer relative flex items-center justify-center
            "
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 text-zinc-550 dark:text-zinc-400" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </Link>
        )}
      </div>

      {/* Collapsible Mobile Drawer Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Area Container */}
          <div className="relative w-[280px] max-w-xs h-full bg-white dark:bg-zinc-950 shadow-2xl animate-in slide-in-from-left duration-250">
            <Sidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};
