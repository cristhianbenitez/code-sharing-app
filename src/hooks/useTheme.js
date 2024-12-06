import { useState, useEffect, useCallback } from 'react';
import { THEMES } from '../config/constants';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(THEMES.DARK.id);

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('editor-theme');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Update theme and persist
  const handleThemeChange = useCallback((newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setCurrentTheme(newTheme);
      localStorage.setItem('editor-theme', newTheme);

      // Update root element classes
      const root = document.documentElement;
      root.classList.toggle('dark', newTheme === 'dark');
      root.style.colorScheme = newTheme;
    }
  }, []);

  return {
    currentTheme,
    setTheme: handleThemeChange,
    isDark: currentTheme === 'dark'
  };
};

