import { describe, it, expect } from 'vitest';
import { adviceFileName } from '../lib/filename.js';

describe('adviceFileName', () => {
  it('builds a readable name from the author', () => {
    expect(adviceFileName({ id: 'a1', author: 'Kent Beck' })).toBe(
      'better-dev-advice-by-kent-beck',
    );
  });

  it('strips punctuation and collapses spaces', () => {
    expect(adviceFileName({ id: 'a2', author: 'Andy Hunt and Dave Thomas' })).toBe(
      'better-dev-advice-by-andy-hunt-and-dave-thomas',
    );
  });

  it('falls back to the id when the author has no usable letters', () => {
    expect(adviceFileName({ id: 'a3', author: '???' })).toBe(
      'better-dev-advice-a3',
    );
  });

  it('handles a missing item', () => {
    expect(adviceFileName(null)).toBe('better-dev-advice');
  });
});
