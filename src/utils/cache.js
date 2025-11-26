// src/utils/cache.js
const cache = new Map();

export function setCache(key, value, ttl = 5000) {
  cache.set(key, { value, expires: Date.now() + ttl });
}
export function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}
export function clearCache(key) { cache.delete(key); }
