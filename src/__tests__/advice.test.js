import { describe, it, expect } from 'vitest';
import advice from '../data/advice.js';
import { pickRandomAdvice, getAdviceById } from '../lib/pickAdvice.js';

describe('advice dataset', () => {
  it('has a large set to cover many months', () => {
    // Showing one a day, this should last well over three months without repeat.
    expect(advice.length).toBeGreaterThanOrEqual(100);
  });

  it('gives every item the required fields', () => {
    for (const item of advice) {
      expect(typeof item.id).toBe('string');
      expect(item.id.length).toBeGreaterThan(0);
      expect(typeof item.text).toBe('string');
      expect(item.text.length).toBeGreaterThan(0);
      expect(typeof item.author).toBe('string');
      expect(item.author.length).toBeGreaterThan(0);
      expect(typeof item.source).toBe('string');
      expect(Array.isArray(item.tags)).toBe(true);
      expect(item.tags.length).toBeGreaterThan(0);
    }
  });

  it('keeps every id unique', () => {
    const ids = advice.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses no em dashes, en dashes or emoji, as requested', () => {
    // Matches em dash, en dash, and the common emoji ranges.
    const banned =
      /[—–]|[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u;
    for (const item of advice) {
      expect(banned.test(item.text), `clean text for ${item.id}`).toBe(false);
    }
  });

  it('keeps each piece of advice short and readable', () => {
    for (const item of advice) {
      expect(item.text.length).toBeLessThan(320);
    }
  });
});

describe('pickRandomAdvice', () => {
  it('returns a real item from the dataset', () => {
    const item = pickRandomAdvice();
    expect(advice).toContainEqual(item);
  });

  it('does not return the excluded id when others exist', () => {
    const first = advice[0];
    for (let i = 0; i < 50; i += 1) {
      const next = pickRandomAdvice(first.id);
      expect(next.id).not.toBe(first.id);
    }
  });
});

describe('getAdviceById', () => {
  it('finds a known item', () => {
    expect(getAdviceById(advice[0].id)).toEqual(advice[0]);
  });

  it('returns null for an unknown id', () => {
    expect(getAdviceById('does-not-exist')).toBeNull();
  });
});
