import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService } from '../../services/authService.js';
const AuthContext = createContext(null);
export function AuthProvider({children, service = authService}) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    service.getSession().then(session => {if (active) {setUser(session); setReady(true);}}).catch(() => {if (active) setReady(true);});
    return () => {active = false;};
  }, [service]);
  // Revalidate when returning to the app and periodically for local session expiry.
  useEffect(() => {
    if (!ready || !user) return;
    const refresh = () => service.getSession().then(setUser).catch(() => setUser(null));
    window.addEventListener('focus', refresh);
    const timer = setInterval(refresh, 60000);
    return () => {window.removeEventListener('focus', refresh); clearInterval(timer);};
  }, [ready, user?.id, service]);
  const signIn = useCallback(async values => { const next = await service.signIn(values); setUser(next); return next; }, [service]);
  const signUp = useCallback(async values => { const next = await service.signUp(values); setUser(next); return next; }, [service]);
  const signOut = useCallback(async () => { await service.signOut(); setUser(null); }, [service]);
  const updateProfile = useCallback(async values => { const next = await service.updateProfile(values); setUser(next); }, [service]);
  const changePassword = useCallback(values => service.changePassword(values), [service]);
  const deleteAccount = useCallback(async values => { await service.deleteAccount(values); setUser(null); }, [service]);
  return <AuthContext.Provider value={{user, ready, signIn, signUp, signOut, updateProfile, changePassword, deleteAccount, mode: service.mode}}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
