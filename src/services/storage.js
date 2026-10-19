export class StorageError extends Error {
  constructor(message = 'Your browser could not save these changes. Download a backup before leaving.') {
    super(message);
    this.name = 'StorageError';
  }
}
export function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
}
export function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { throw new StorageError(); }
}
export function removeStored(key) {
  try { localStorage.removeItem(key); }
  catch { throw new StorageError(); }
}
export const newId = () => crypto.randomUUID();
