/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  currentAppliedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('connecthub_theme') as ThemeMode;
    return saved || 'dark'; // Default to a gorgeous dark slate theme
  });

  const [currentAppliedTheme, setCurrentAppliedTheme] = useState<'light' | 'dark'>(() => {
    const saved = (localStorage.getItem('connecthub_theme') as ThemeMode) || 'dark';
    if (saved === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return saved;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      let resolved: 'light' | 'dark' = 'dark';
      if (theme === 'system') {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        resolved = mq.matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }

      setCurrentAppliedTheme(resolved);

      if (resolved === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();
    localStorage.setItem('connecthub_theme', theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, [theme]);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, currentAppliedTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
