import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'better-dev:saved';

// Load the saved advice list from localStorage, tolerating older or corrupt
// data without throwing.
function loadSaved() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.id === 'string');
  } catch {
    return [];
  }
}

export default function useSavedAdvice() {
  const [saved, setSaved] = useState(loadSaved);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // If we cannot persist, keep working in memory for this session.
    }
  }, [saved]);

  const isSaved = useCallback(
    (id) => saved.some((item) => item.id === id),
    [saved],
  );

  // Add the advice if new, remove it if it is already saved. Returns nothing;
  // the new state drives the UI.
  const toggleSaved = useCallback((item) => {
    if (!item || typeof item.id !== 'string') return;
    setSaved((current) => {
      if (current.some((entry) => entry.id === item.id)) {
        return current.filter((entry) => entry.id !== item.id);
      }
      return [{ ...item }, ...current];
    });
  }, []);

  const removeSaved = useCallback((id) => {
    setSaved((current) => current.filter((entry) => entry.id !== id));
  }, []);

  return { saved, isSaved, toggleSaved, removeSaved };
}
