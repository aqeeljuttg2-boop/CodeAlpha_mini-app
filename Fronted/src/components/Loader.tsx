/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LoaderProps {
  type?: 'spinner' | 'post-skeleton' | 'sidebar-skeleton';
  count?: number;
}

export const Loader: React.FC<LoaderProps> = ({ type = 'spinner', count = 1 }) => {
  if (type === 'spinner') {
    return (
      <div className="flex items-center justify-center p-8 w-full">
        <div className="relative w-10 h-10">
          <div className="absolute w-full h-full rounded-full border-4 border-zinc-200 dark:border-zinc-800"></div>
          <div className="absolute w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (type === 'post-skeleton') {
    return (
      <div className="w-full flex flex-col gap-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="w-full p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-2xl flex flex-col gap-4 animate-pulse duration-1000"
          >
            {/* User row */}
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex flex-col gap-1.5 grow">
                <div className="w-1/4 h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="w-1/6 h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
            {/* Body */}
            <div className="flex flex-col gap-2.5 mt-1">
              <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="w-5/6 h-3 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="w-2/3 h-3 bg-zinc-205 dark:bg-zinc-800 rounded" />
            </div>
            {/* Media field placeholder if index is even */}
            {idx % 2 === 0 && (
              <div className="w-full h-56 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            )}
            {/* Action buttons */}
            <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-850 pt-3 mt-1">
              <div className="w-1/5 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="w-1/5 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              <div className="w-1/5 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // default fallback
  return null;
};
