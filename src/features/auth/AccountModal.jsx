import React, {useState} from 'react';
import {useAuth} from './AuthProvider.jsx';
import Modal from '../../shared/ui/Modal.jsx';
import Icon from '../../shared/ui/Icon.jsx';
export default function AccountModal({onClose, onDelete}) {
  const {user, updateProfile, changePassword, deleteAccount} = useAuth();
  const [tab, setTab] = useState('profile');
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (tab === 'profile') {await updateProfile({name}); setMessage('Your name has been updated.');}
      if (tab === 'password') {await changePassword({currentPassword: password, newPassword}); setPassword(''); setNewPassword(''); setMessage('Your password has been changed.');}
      if (tab === 'delete') {await deleteAccount({password}); onDelete(user.id); onClose();}
    } catch (exception) {setError(exception.message);} finally {setBusy(false);}
  };
  return <Modal title="Your account" onClose={onClose} closeable={!busy}>
    <div className="account-identity"><span className="avatar large">{user.name.charAt(0).toUpperCase()}</span><div><strong>{user.name}</strong><p>{user.email}</p></div></div>
    <div className="account-tabs" role="group" aria-label="Account settings">{['profile','password','delete'].map(id => <button key={id} type="button" disabled={busy} className={tab === id ? 'active' : ''} onClick={() => {setTab(id); setError(''); setMessage(''); setPassword('');}}>{id === 'profile' ? 'Profile' : id === 'password' ? 'Password' : 'Delete account'}</button>)}</div>
    <form className="form-stack" onSubmit={submit}>
      {tab === 'profile' && <><label>Your name<input value={name} onChange={event => setName(event.target.value)} maxLength={80} required autoComplete="name"/></label><label>Email address<input value={user.email} readOnly type="email"/><span className="field-hint">Email changes will be available with cloud accounts.</span></label></>}
      {tab === 'password' && <><label>Current password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required/></label><label>New password<input type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} autoComplete="new-password" minLength={12} maxLength={128} required/><span className="field-hint">At least 12 characters.</span></label></>}
      {tab === 'delete' && <><div className="notice danger"><Icon name="info"/><p>This permanently removes this local account and its saved moves from this browser. Download backups of your moves first.</p></div><label>Confirm with your password<input type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required/></label></>}
      {error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}
      <button className={'button full ' + (tab === 'delete' ? 'danger-button' : 'primary')} disabled={busy}>{busy ? 'Saving…' : tab === 'delete' ? 'Permanently delete account' : tab === 'password' ? 'Change password' : 'Save changes'}</button>
    </form>
    <p className="field-hint account-footer">Local account · Saved on this browser only</p>
  </Modal>;
}
