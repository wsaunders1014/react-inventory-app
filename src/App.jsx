import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useStore} from 'react-redux';
import {useAuth} from './features/auth/AuthProvider.jsx';
import AuthModal from './features/auth/AuthModal.jsx';
import AccountModal from './features/auth/AccountModal.jsx';
import Dashboard from './features/moves/Dashboard.jsx';
import InventoryEditor from './features/inventory/InventoryEditor.jsx';
import useAutosave from './features/moves/useAutosave.js';
import {moveRepository, createMove} from './services/moveRepository.js';
import {exportCSV, exportJSON} from './services/inventoryExport.js';
import Modal from './shared/ui/Modal.jsx';
import Icon from './shared/ui/Icon.jsx';
import './app.css';

export default function App() {
  const auth = useAuth();
  if (!auth.ready) return <div className="loading-screen"><Icon name="box" size={32}/><p>Making a little room…</p></div>;
  return <Workspace key={auth.user?.id || 'guest'}/>;
}
function Workspace() {
  const {user, signOut} = useAuth();
  const owner = user?.id || 'guest';
  const [records, setRecords] = useState(() => moveRepository.list(owner));
  const [activeId, setActiveId] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [account, setAccount] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [guestImport, setGuestImport] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const toastTimer = useRef(null);
  const dispatch = useDispatch();
  const store = useStore();
  const refresh = () => setRecords(moveRepository.list(owner));
  const autosave = useAutosave(owner, activeId, refresh);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (user && moveRepository.list('guest').length && !sessionStorage.getItem(`roomby.guest-prompt.${owner}`)) setGuestImport(true);
  }, [owner, user]);
  useEffect(() => {
    const listener = event => {
      if (event.key?.startsWith('roomby.moves.')) refresh();
      if (event.key?.startsWith('roomby.moves.') && activeId) setToast('Moves changed in another tab. Your open move stays as it is until you reopen it.');
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, [owner, activeId]);
  useEffect(() => {
    if (!accountMenu) return;
    const close = event => {if (!menuRef.current?.contains(event.target)) setAccountMenu(false);};
    const escape = event => {if (event.key === 'Escape') {setAccountMenu(false); menuRef.current?.querySelector('button')?.focus();}};
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape);
    return () => {document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape);};
  }, [accountMenu]);
  useEffect(() => {
    const restoreRoute = () => {
      const match = window.location.hash.match(/^#move\/([\w-]+)$/);
      if (!autosave.flush()) {setError('Your latest changes could not be saved. Download a backup before leaving this move.'); return;}
      if (!match) {setActiveId(null); refresh(); return;}
      const record = moveRepository.list(owner).find(entry => entry.move.id === match[1]);
      if (record) {dispatch({type:'workspace/loaded', payload:record}); setActiveId(record.move.id);}
      else {setActiveId(null); window.history.replaceState(null, '', '#moves');}
      window.scrollTo(0,0);
    };
    restoreRoute();
    window.addEventListener('popstate', restoreRoute);
    return () => window.removeEventListener('popstate', restoreRoute);
  }, [owner, dispatch, autosave.flush]);
  const notify = message => {setToast(message); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(''), 4500);};
  const open = record => {
    autosave.flush();
    dispatch({type: 'workspace/loaded', payload: record});
    setActiveId(record.move.id); setError('');
    if (window.location.hash !== `#move/${record.move.id}`) window.history.pushState(null, '', `#move/${record.move.id}`);
    window.scrollTo(0, 0);
  };
  const makeNew = () => {
    try {const record = createMove(); moveRepository.save(owner, record); refresh(); open(record);}
    catch (exception) {setError(exception.message);}
  };
  const dashboard = () => {
    if (!autosave.flush()) {setError('Your latest changes could not be saved. Download a backup before returning to your moves.'); return;}
    setActiveId(null); refresh();
    if (window.location.hash !== '#moves') window.history.pushState(null, '', '#moves');
    window.scrollTo(0,0);
  };
  const run = action => {try {action(); setError('');} catch (exception) {setError(exception.message);}};
  const importFile = async event => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('Choose a JSON backup smaller than 2 MB.');
      const record = moveRepository.import(owner, JSON.parse(await file.text()));
      refresh(); open(record); notify('Your inventory has been imported as a new move.');
    } catch (exception) {setError(exception instanceof SyntaxError ? 'This file could not be read. Choose a JSON backup exported from Roomby.' : exception.message);}
  };
  const download = type => run(() => {if (type === 'json') exportJSON(store.getState()); else exportCSV(store.getState()); notify(type === 'json' ? 'Backup downloaded. Keep it somewhere safe.' : 'Inventory downloaded as a spreadsheet.');});
  const logout = async () => {
    setAccountMenu(false);
    if (!autosave.flush()) {setError('Download a backup of your latest changes before logging out. Your browser could not save them.'); return;}
    await signOut();
  };
  const dismissGuest = () => {try {sessionStorage.setItem(`roomby.guest-prompt.${owner}`, 'dismissed');} catch {} setGuestImport(false);};
  return <div className={'app-shell' + (activeId ? ' editing' : '')}>
    <a href="#main-content" className="skip-link" onClick={event => {event.preventDefault(); document.getElementById('main-content')?.focus();}}>Skip to content</a>
    <header className="site-header"><div className="header-inner"><button className="brand" aria-label="Roomby home" onClick={dashboard}><span className="brand-mark"><Icon name="box" size={23}/></span><span>roomby<span className="brand-dot">.</span></span></button>
      <nav className="header-nav" aria-label="Main navigation"><button className={!activeId ? 'nav-link active' : 'nav-link'} onClick={dashboard}>My moves</button><span className="nav-divider"/>{user ? <div className="account-menu-wrap" ref={menuRef}><button className="profile-button" aria-expanded={accountMenu} aria-controls="account-menu" onClick={() => setAccountMenu(!accountMenu)}><span className="avatar">{user.name.charAt(0).toUpperCase()}</span><span className="profile-name">{user.name.split(' ')[0]}</span><Icon name="chevron" size={14} className="profile-chevron"/></button>{accountMenu && <div className="account-menu" id="account-menu"><div><strong>{user.name}</strong><span>{user.email}</span><small>Local account</small></div><button onClick={() => {setAccountMenu(false); setAccount(true);}}><Icon name="user" size={17}/>Account settings</button><button onClick={logout}><Icon name="logout" size={17}/>Log out</button></div>}</div> : <><button className="nav-link login-link" onClick={() => setAuthMode('login')}>Log in</button><button className="button header-signup" onClick={() => setAuthMode('signup')}>Create account<Icon name="arrow" size={15}/></button></>}</nav>
    </div></header>
    <div className="page-container" id="main-content" tabIndex={-1}>
      {error && <div className="error-banner" role="alert"><Icon name="info" size={19}/><p>{error}</p>{activeId && <button className="text-button" onClick={() => download('json')}>Download backup</button>}<button className="icon-button" aria-label="Dismiss error" onClick={() => setError('')}><Icon name="close" size={17}/></button></div>}
      {activeId ? <InventoryEditor onDashboard={dashboard} onConfirm={setConfirm} onExport={download} onAuth={setAuthMode} user={user} saveStatus={autosave.status} onToast={notify}/> : <main><Dashboard records={records} onNew={makeNew} onOpen={open} onImport={() => inputRef.current.click()} onAuth={setAuthMode}
        onDuplicate={record => run(() => {moveRepository.duplicate(owner, record); refresh(); notify('Move duplicated. A fresh copy is ready to edit.');})}
        onDelete={record => setConfirm({title: 'Delete this move?', message: `“${record.move.title}” and all of its inventory will be removed from this browser. This can’t be undone.`, action: 'Delete move', onConfirm: () => run(() => {moveRepository.remove(owner, record.move.id); refresh(); notify('Move deleted.');})})}/></main>}
    </div>
    <footer className="site-footer"><div><span className="footer-brand">roomby.</span><span>A little room for peace of mind.</span></div><span><Icon name="shield" size={13}/>Saved locally. Yours to take with you.</span><a href="https://github.com/wsaunders1014/react-inventory-app" target="_blank" rel="noreferrer">Made with care<Icon name="arrow" size={13}/></a></footer>
    <input ref={inputRef} className="sr-only" type="file" accept="application/json,.json" aria-label="Import inventory backup" onChange={importFile} tabIndex={-1}/>
    {toast && <div className="toast" role="status"><Icon name="check" size={17}/><span>{toast}</span><button className="icon-button" aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={15}/></button></div>}
    {authMode && <AuthModal initialMode={authMode} onClose={() => setAuthMode(null)}/>}
    {account && <AccountModal onClose={() => setAccount(false)} onDelete={id => {try {moveRepository.deleteAll(id);} catch { /* Reported by the account UI in a later backend adapter. */ }}}/>}
    {confirm && <Modal title={confirm.title} onClose={() => setConfirm(null)}><p className="modal-intro">{confirm.message}</p><div className="confirm-actions"><button className="button secondary" onClick={() => setConfirm(null)}>Keep it</button><button className="button danger-button" onClick={() => {confirm.onConfirm(); setConfirm(null);}}>{confirm.action}</button></div></Modal>}
    {guestImport && <Modal title="Bring your guest moves along?" onClose={dismissGuest}><p className="modal-intro">You have {moveRepository.list('guest').length} saved guest {moveRepository.list('guest').length === 1 ? 'move' : 'moves'} in this browser. Copy them into your account to keep everything together. The guest originals will stay available.</p><div className="confirm-actions"><button className="button secondary" onClick={dismissGuest}>Not now</button><button className="button primary" onClick={() => run(() => {moveRepository.copyGuestMoves(owner); refresh(); dismissGuest(); notify('Your guest moves have been copied into your account.');})}>Copy my moves<Icon name="arrow" size={16}/></button></div></Modal>}
  </div>;
}
