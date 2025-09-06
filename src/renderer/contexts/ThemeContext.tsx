import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  themeMode: 'system' | 'light' | 'dark';
  setThemeMode: (mode: 'system' | 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isDark, setIsDark] = useState(false);
  const [themeMode, setThemeModeState] = useState<'system' | 'light' | 'dark'>('system');

  useEffect(() => {
    // Use CSS media query for system theme detection (no IPC needed)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);
    updateCSSVariables(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      updateCSSVariables(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setThemeMode = (mode: 'system' | 'light' | 'dark') => {
    setThemeModeState(mode);
    let dark = false;
    
    if (mode === 'dark') {
      dark = true;
    } else if (mode === 'light') {
      dark = false;
    } else {
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    setIsDark(dark);
    updateCSSVariables(dark);
  };

  const updateCSSVariables = (dark: boolean) => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
