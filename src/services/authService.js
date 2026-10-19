import { readJSON, writeJSON, newId } from './storage.js';

// Local development adapter. It does not provide a server authorization boundary.
// Swap this object for an HTTP implementation when a backend is connected.
const ACCOUNTS_KEY = 'roomby.accounts.v1';
const SESSION_KEY = 'roomby.session.v1';
const SESSION_DURATION = 12 * 60 * 60 * 1000;
const ITERATIONS = 600000;
const publicUser = ({ id, name, email, createdAt }) => ({ id, name, email, createdAt });
const normalizeEmail = value => value.trim().toLowerCase();
const accounts = () => {
  const stored = readJSON(ACCOUNTS_KEY, []);
  return Array.isArray(stored) ? stored.filter(account => account && typeof account.id === 'string' && typeof account.email === 'string' && typeof account.passwordHash === 'string' && typeof account.salt === 'string') : [];
};
const hex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
const unhex = value => Uint8Array.from(value.match(/.{1,2}/g) || [], byte => parseInt(byte, 16));

export function validatePassword(password) {
  if (password.length < 12) return 'Use at least 12 characters. A few memorable words work well.';
  if (password.length > 128) return 'Use 128 characters or fewer.';
  return '';
}
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}
async function passwordHash(password, salt) {
  if (!crypto.subtle) throw new Error('Accounts need a secure connection. Open this app on HTTPS or localhost.');
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', salt: unhex(salt), iterations: ITERATIONS}, material, 256);
  return hex(new Uint8Array(bits));
}
function establishSession(user) {
  // No password or credential is persisted in sessionStorage.
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({userId: user.id, expiresAt: Date.now() + SESSION_DURATION})); }
  catch { throw new Error('Your browser is blocking account sessions. Allow site storage, or continue as a guest.'); }
  return publicUser(user);
}
export const authService = {
  mode: 'local',
  async getSession() {
    let session;
    try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY)); } catch { return null; }
    if (!session || session.expiresAt <= Date.now()) { await this.signOut(); return null; }
    const user = accounts().find(account => account.id === session.userId);
    return user ? publicUser(user) : null;
  },
  async signUp({name, email, password}) {
    name = name.trim(); email = normalizeEmail(email);
    if (!name || name.length > 80) throw new Error('Enter your name, using 80 characters or fewer.');
    if (!validateEmail(email)) throw new Error('Enter a valid email address.');
    const error = validatePassword(password);
    if (error) throw new Error(error);
    if (accounts().some(account => account.email === email)) throw new Error('An account with this email already exists in this browser. Try logging in.');
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
    const hash = await passwordHash(password, salt);
    // Re-read after hashing to avoid overwriting a concurrent account update.
    const current = accounts();
    if (current.some(account => account.email === email)) throw new Error('An account with this email already exists in this browser.');
    const user = {id: newId(), name, email, salt, passwordHash: hash, createdAt: new Date().toISOString()};
    writeJSON(ACCOUNTS_KEY, [...current, user]);
    return establishSession(user);
  },
  async signIn({email, password}) {
    const user = accounts().find(account => account.email === normalizeEmail(email));
    if (!user || await passwordHash(password, user.salt) !== user.passwordHash) throw new Error('The email or password is incorrect. Accounts are available only in the browser where they were created.');
    return establishSession(user);
  },
  async signOut() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* The in-memory session is still cleared by the caller. */ }
  },
  async updateProfile({name}) {
    const session = await this.getSession();
    if (!session) throw new Error('Log in again to update your account.');
    name = name.trim();
    if (!name || name.length > 80) throw new Error('Enter a name using 80 characters or fewer.');
    const current = accounts();
    const index = current.findIndex(account => account.id === session.id);
    current[index] = {...current[index], name};
    writeJSON(ACCOUNTS_KEY, current);
    return publicUser(current[index]);
  },
  async changePassword({currentPassword, newPassword}) {
    const session = await this.getSession();
    if (!session) throw new Error('Log in again to change your password.');
    const error = validatePassword(newPassword);
    if (error) throw new Error(error);
    const user = accounts().find(account => account.id === session.id);
    if (await passwordHash(currentPassword, user.salt) !== user.passwordHash) throw new Error('Your current password is incorrect.');
    const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
    const hash = await passwordHash(newPassword, salt);
    writeJSON(ACCOUNTS_KEY, accounts().map(account => account.id === user.id ? {...account, salt, passwordHash: hash} : account));
  },
  async deleteAccount({password}) {
    const session = await this.getSession();
    if (!session) throw new Error('Log in again to delete your account.');
    const user = accounts().find(account => account.id === session.id);
    if (await passwordHash(password, user.salt) !== user.passwordHash) throw new Error('Your password is incorrect.');
    writeJSON(ACCOUNTS_KEY, accounts().filter(account => account.id !== user.id));
    await this.signOut();
  }
};
