import {useCallback, useEffect, useRef, useState} from 'react';
import {useStore} from 'react-redux';
import {moveRepository, recordFromState} from '../../services/moveRepository.js';
export default function useAutosave(owner, activeId, onSaved) {
  const store = useStore();
  const [status, setStatus] = useState('saved');
  const pending = useRef(null);
  const timer = useRef(null);
  const callback = useRef(onSaved);
  callback.current = onSaved;
  const flush = useCallback(() => {
    clearTimeout(timer.current);
    if (!pending.current) return true;
    try {
      moveRepository.save(owner, pending.current);
      pending.current = null;
      setStatus('saved'); callback.current?.();
      return true;
    } catch {setStatus('error'); return false;}
  }, [owner]);
  useEffect(() => {
    if (!activeId) return;
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (state.move.id !== activeId) return;
      pending.current = recordFromState(state);
      setStatus('saving');
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, 450);
    });
    const visibility = () => {if (document.visibilityState === 'hidden') flush();};
    const beforeUnload = event => {if (!flush()) {event.preventDefault(); event.returnValue = '';}};
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', beforeUnload);
    return () => {unsubscribe(); flush(); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', flush); window.removeEventListener('beforeunload', beforeUnload);};
  }, [activeId, flush, store]);
  return {status, flush};
}
