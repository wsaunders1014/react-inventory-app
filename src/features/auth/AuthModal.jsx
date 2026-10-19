import React, {useState} from 'react';
import {useAuth} from './AuthProvider.jsx';
import Modal from '../../shared/ui/Modal.jsx';
import Icon from '../../shared/ui/Icon.jsx';
import {validatePassword} from '../../services/authService.js';
export default function AuthModal({initialMode = 'signup', onClose, onSuccess}) {
  const [mode, setMode] = useState(initialMode);
  const [values, setValues] = useState({name:'', email:'', password:''});
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const {signIn, signUp} = useAuth();
  const signup = mode === 'signup';
  const change = event => {setValues({...values, [event.target.name]: event.target.value}); setError('');};
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    if (signup && validatePassword(values.password)) {setError(validatePassword(values.password)); return;}
    setBusy(true); setError('');
    try {
      const user = await (signup ? signUp(values) : signIn(values));
      onSuccess?.(user, signup); onClose();
    } catch (exception) {setError(exception.message);}
    finally {setBusy(false);}
  };
  return <Modal title={signup ? 'A fresh start, together.' : 'Welcome back.'} onClose={onClose} closeable={!busy}>
    <p className="modal-intro">{signup ? 'Give your next chapter a home. Create an account to organize your moves.' : 'Log in to pick up where you left off.'}</p>
    <div className="auth-mode" role="group" aria-label="Account action">
      <button type="button" className={signup ? 'active' : ''} disabled={busy} onClick={() => {setMode('signup'); setError('');}}>Create account</button>
      <button type="button" className={!signup ? 'active' : ''} disabled={busy} onClick={() => {setMode('login'); setError('');}}>Log in</button>
    </div>
    <form onSubmit={submit} className="form-stack">
      {signup && <label>Your name<input name="name" autoComplete="name" value={values.name} onChange={change} maxLength={80} required autoFocus /></label>}
      <label>Email address<input name="email" type="email" autoComplete="email" value={values.email} onChange={change} maxLength={254} required autoFocus={!signup} placeholder="you@example.com" /></label>
      <label>Password<div className="password-field"><input name="password" type={visible ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} value={values.password} onChange={change} maxLength={128} required minLength={signup ? 12 : undefined} aria-describedby="password-help" />
        <button type="button" className="icon-button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible}><Icon name="eye"/></button></div></label>
      <p id="password-help" className="field-hint">{signup ? 'At least 12 characters. Try a memorable passphrase.' : 'Use the account you created in this browser.'}</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button primary full" disabled={busy}>{busy ? 'One moment…' : signup ? 'Create my account' : 'Log in'}{!busy && <Icon name="arrow"/>}</button>
    </form>
    <div className="local-note"><Icon name="shield"/><p><strong>Local accounts for now.</strong> Your account and moves stay in this browser. Cloud sync and password recovery will arrive when a backend is connected. Use a password you don’t use elsewhere.</p></div>
    <button type="button" className="text-button guest-link" onClick={onClose} disabled={busy}>Continue as a guest</button>
  </Modal>;
}
