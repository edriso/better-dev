import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'better-dev:theme';

// Read the saved theme, falling back to the operating system preference so a
// first time visitor gets the look they already expect.
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Ignore storage errors (private mode, blocked cookies) and use defaults.
  }

  const prefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return prefersDark ? 'dark' : 'light';
}

export default function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Saving the theme is a nice to have, not worth crashing over.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
