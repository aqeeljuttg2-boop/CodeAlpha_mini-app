/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  className?: string;
  id?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  isVerified = false,
  className = '',
  id
}) => {
  const sizes = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg font-bold',
    xl: 'w-24 h-24 text-2xl font-bold md:w-28 md:h-28',
  };

  const badgeSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-7 h-7',
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div id={id} className={`relative shrink-0 select-none ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className={`rounded-full object-cover border border-zinc-100 dark:border-zinc-800 ${sizes[size]}`}
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div
          className={`
            rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold border border-zinc-100 dark:border-zinc-850
            ${sizes[size]}
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {isVerified && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full bg-blue-500 text-white border-2 border-white dark:border-zinc-950 flex items-center justify-center shadow-sm
            ${badgeSizes[size]}
          `}
          title="Verified Creator"
        >
          <Check strokeWidth={3} className="w-2/3 h-2/3" />
        </span>
      )}
    </div>
  );
};
