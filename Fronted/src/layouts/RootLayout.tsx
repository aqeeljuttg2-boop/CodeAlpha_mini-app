/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { RightSidebar } from '../components/RightSidebar';
import { Loader } from '../components/Loader';

export const RootLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to registration page if user session is not active
      navigate('/register', { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950">
        <Loader type="spinner" />
        <p className="text-sm font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 uppercase mt-4 animate-pulse">
          Establishing Secure Node Connect...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Let the redirect trigger
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Dynamic Header */}
      <Navbar />

      {/* 3-Column Workspace Grid */}
      <div className="flex grow w-full max-w-7xl mx-auto items-stretch">
        
        {/* Left column sidebar (desktop) */}
        <aside className="hidden lg:block w-[260px] md:w-[280px] shrink-0 sticky top-16 h-[calc(100vh-64px)] border-r border-zinc-200/10 dark:border-white/5 bg-zinc-50/10 dark:bg-white/[0.01]">
          <Sidebar />
        </aside>

        {/* Center column screen context */}
        <main className="grow w-full max-w-3xl min-w-0 border-r border-zinc-250/15 dark:border-white/5 bg-transparent flex flex-col">
          <div className="grow px-4 py-5 md:py-6 overflow-y-auto">
            <Outlet />
          </div>
        </main>

        {/* Right column sidebar widgets (large desktops) */}
        <aside className="hidden xl:block w-[320px] shrink-0 sticky top-16 h-[calc(100vh-64px)] bg-transparent">
          <RightSidebar />
        </aside>
      </div>
    </div>
  );
};
export default RootLayout;
