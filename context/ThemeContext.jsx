"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light'); // 'light' | 'dark' | 'auto'
  const [appliedTheme, setAppliedTheme] = useState('light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const savedMode = localStorage.getItem('themeMode') || localStorage.getItem('theme');
    if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto') {
      setThemeMode(savedMode);
    } else {
      setThemeMode('auto');
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const computeApplied = (mode) => (mode === 'auto' ? (media.matches ? 'dark' : 'light') : mode);
    const nextApplied = computeApplied(themeMode);
    setAppliedTheme(nextApplied);

    const applyToDom = (t) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(t);
    };
    applyToDom(nextApplied);
    localStorage.setItem('themeMode', themeMode);

    const handleChange = () => {
      if (themeMode === 'auto') {
        const newest = computeApplied('auto');
        setAppliedTheme(newest);
        applyToDom(newest);
      }
    };

    media.addEventListener?.('change', handleChange);
    return () => media.removeEventListener?.('change', handleChange);
  }, [themeMode, isHydrated]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(() => ({
    theme: appliedTheme,
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark: appliedTheme === 'dark',
    isLight: appliedTheme === 'light',
    isHydrated,
  }), [appliedTheme, themeMode, isHydrated]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
