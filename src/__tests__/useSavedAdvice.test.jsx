import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useSavedAdvice from '../hooks/useSavedAdvice.js';

const sample = { id: 'x1', text: 'Keep it simple.', author: 'Someone', source: 'A book', tags: ['simplicity'] };

describe('useSavedAdvice', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useSavedAdvice());
    expect(result.current.saved).toEqual([]);
  });

  it('saves and reports an item as saved', () => {
    const { result } = renderHook(() => useSavedAdvice());
    act(() => result.current.toggleSaved(sample));
    expect(result.current.isSaved('x1')).toBe(true);
    expect(result.current.saved).toHaveLength(1);
  });

  it('toggles the same item off', () => {
    const { result } = renderHook(() => useSavedAdvice());
    act(() => result.current.toggleSaved(sample));
    act(() => result.current.toggleSaved(sample));
    expect(result.current.isSaved('x1')).toBe(false);
    expect(result.current.saved).toHaveLength(0);
  });

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useSavedAdvice());
    act(() => result.current.toggleSaved(sample));
    const stored = JSON.parse(window.localStorage.getItem('better-dev:saved'));
    expect(stored[0].id).toBe('x1');
  });

  it('loads existing saved advice from localStorage', () => {
    window.localStorage.setItem('better-dev:saved', JSON.stringify([sample]));
    const { result } = renderHook(() => useSavedAdvice());
    expect(result.current.saved).toHaveLength(1);
    expect(result.current.isSaved('x1')).toBe(true);
  });

  it('removes an item by id', () => {
    window.localStorage.setItem('better-dev:saved', JSON.stringify([sample]));
    const { result } = renderHook(() => useSavedAdvice());
    act(() => result.current.removeSaved('x1'));
    expect(result.current.saved).toHaveLength(0);
  });
});
