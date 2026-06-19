import advice from '../data/advice.js';

// Pick a random piece of advice. When an id to avoid is given we try not to
// show the same one twice in a row, which matters most when someone keeps
// tapping for a new one.
export function pickRandomAdvice(excludeId) {
  if (advice.length === 0) return null;
  if (advice.length === 1) return advice[0];

  const pool = excludeId
    ? advice.filter((item) => item.id !== excludeId)
    : advice;

  const list = pool.length > 0 ? pool : advice;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function getAdviceById(id) {
  return advice.find((item) => item.id === id) ?? null;
}

export { advice };
