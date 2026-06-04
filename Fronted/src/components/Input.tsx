/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200 outline-none
            ${icon ? 'pl-11' : 'pl-3.5'}
            ${error 
              ? 'border-red-500 dark:border-red-650 bg-red-50/10 focus:ring-2 focus:ring-red-500/20' 
              : 'border-zinc-200/40 dark:border-white/10 bg-black/5 dark:bg-black/30 text-zinc-900 dark:text-slate-200 placeholder-zinc-400 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs font-medium text-red-500 dark:text-red-400 mt-0.5 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};
