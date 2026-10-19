import {describe,it,expect,vi} from 'vitest';
import {authService,validatePassword} from './authService.js';
const values={name:'Test Mover',email:'QA@example.test',password:'four words for moving day'};
describe('local auth adapter', () => {
  it('creates an account without storing plaintext passwords and restores a tab session', async () => {
    const user=await authService.signUp(values);
    expect(user.email).toBe('qa@example.test');expect(user.passwordHash).toBeUndefined();
    expect(localStorage.getItem('roomby.accounts.v1')).not.toContain(values.password);
    expect(sessionStorage.getItem('roomby.session.v1')).not.toContain(values.password);
    expect((await authService.getSession()).id).toBe(user.id);
    await authService.signOut();expect(await authService.getSession()).toBeNull();
    expect((await authService.signIn({email:' QA@EXAMPLE.TEST ',password:values.password})).id).toBe(user.id);
  });
  it('rejects bad credentials, duplicate accounts, and invalid registration', async () => {
    expect(validatePassword('short')).toContain('12 characters');
    await expect(authService.signUp({...values,email:'bad'})).rejects.toThrow('valid email');
    await expect(authService.signUp({...values,password:'short'})).rejects.toThrow('12 characters');
    await authService.signUp(values);
    await expect(authService.signUp(values)).rejects.toThrow('already exists');
    await expect(authService.signIn({...values,password:'incorrect password'})).rejects.toThrow('incorrect');
    await expect(authService.signIn({...values,email:'missing@example.test'})).rejects.toThrow('incorrect');
  });
  it('updates profile, changes passwords, verifies deletion, and expires sessions', async () => {
    await authService.signUp(values);
    expect((await authService.updateProfile({name:'New name'})).name).toBe('New name');
    await expect(authService.changePassword({currentPassword:'wrong',newPassword:'a new memorable passphrase'})).rejects.toThrow('incorrect');
    await authService.changePassword({currentPassword:values.password,newPassword:'a new memorable passphrase'});
    await authService.signOut();
    await expect(authService.signIn(values)).rejects.toThrow('incorrect');
    const user=await authService.signIn({...values,password:'a new memorable passphrase'});
    sessionStorage.setItem('roomby.session.v1',JSON.stringify({userId:user.id,expiresAt:Date.now()-1}));
    expect(await authService.getSession()).toBeNull();
    await authService.signIn({...values,password:'a new memorable passphrase'});
    await expect(authService.deleteAccount({password:'wrong'})).rejects.toThrow('incorrect');
    await authService.deleteAccount({password:'a new memorable passphrase'});
    expect(await authService.getSession()).toBeNull();
    await expect(authService.signIn({...values,password:'a new memorable passphrase'})).rejects.toThrow('incorrect');
  });
  it('does not report success when persistent account storage is blocked', async () => {
    vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('blocked');});
    await expect(authService.signUp(values)).rejects.toThrow('could not save');
  });
});
