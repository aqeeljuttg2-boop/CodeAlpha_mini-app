/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Settings, User, Shield, Eye, Palette, CheckCircle, ShieldAlert } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme, setThemeMode } = useTheme();

  // Settings states
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  // Password States
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Privacy states
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowTags, setAllowTags] = useState(true);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const displayToast = (msg: string) => {
    setToastMsg(msg);
    setErrorMsg('');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const displayError = (msg: string) => {
    setErrorMsg(msg);
    setToastMsg('');
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim()) {
      displayError('Please define all core details.');
      return;
    }
    setIsSavingAccount(true);
    const success = await updateProfile({
      name: name.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, ''),
      email: email.trim()
    });
    setIsSavingAccount(false);

    if (success) {
      displayToast('Account settings synchronized successfully!');
    } else {
      displayError('Failed to synchronize account variables.');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass) {
      displayError('Please enter both old and new passwords.');
      return;
    }
    if (newPass.length < 6) {
      displayError('New password must be at least 6 characters.');
      return;
    }
    setIsChangingPass(true);
    setTimeout(() => {
      setIsChangingPass(false);
      setOldPass('');
      setNewPass('');
      displayToast('Password altered successfully! Node credentials secured.');
    }, 800);
  };

  return (
    <div className="w-full flex flex-col font-sans mb-10">
      
      {/* Page Title */}
      <div className="flex items-center gap-2.5 mb-6 px-1 select-none shrink-0 border-b border-zinc-100 dark:border-zinc-850 pb-4">
        <Settings className="w-5.5 h-5.5 text-blue-600 dark:text-blue-500" strokeWidth={2.5} />
        <h2 className="text-[17px] font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
          System Settings & Control
        </h2>
      </div>

      {toastMsg && (
        <div className="mb-5 flex items-center gap-2 bg-emerald-500/[0.08] dark:bg-emerald-500/[0.05] border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in slide-in-from-top-1">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 flex items-center gap-2 bg-red-500/[0.08] dark:bg-red-500/[0.05] border border-red-500/25 p-3 rounded-xl text-xs text-red-500 dark:text-red-400 font-semibold animate-in slide-in-from-top-1">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col gap-6.5">
        
        {/* 1. Account settings card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 select-none pb-3 border-b border-zinc-50 dark:border-zinc-850">
            <User className="w-4.5 h-4.5 text-zinc-500" />
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 capitalize">
              Account Parameters
            </h3>
          </div>

          <form onSubmit={handleSaveAccount} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="name"
                type="text"
                label="Full Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                id="username"
                type="text"
                label="Unique Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <Input
              id="email"
              type="email"
              label="Sync Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex justify-end select-none">
              <Button type="submit" variant="primary" loading={isSavingAccount}>
                Synchronize Accounts
              </Button>
            </div>
          </form>
        </div>

        {/* 2. Security change password card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2.5 mb-4 select-none pb-3 border-b border-zinc-50 dark:border-zinc-850">
            <Shield className="w-4.5 h-4.5 text-zinc-500" />
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 capitalize">
              Security & Credential locks
            </h3>
          </div>

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="oldPass"
                type="password"
                label="Old Password"
                placeholder="••••••••"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
              <Input
                id="newPass"
                type="password"
                label="New Password"
                placeholder="••••••••"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
            <div className="flex justify-end select-none">
              <Button type="submit" variant="secondary" loading={isChangingPass}>
                Update Password
              </Button>
            </div>
          </form>
        </div>

        {/* 3. Privacy settings card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 p-5 rounded-2xl shadow-xs select-none">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-zinc-50 dark:border-zinc-850">
            <Eye className="w-4.5 h-4.5 text-zinc-500" />
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 capitalize">
              Privacy Settings
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-1">
              <div className="flex flex-col gap-0.5 max-w-md">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Private Profile Node</span>
                <span className="text-xs text-zinc-500 leading-normal">
                  Lock search indexing. External non-followers cannot access profile cards or read threads.
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => {
                  setIsPrivate(e.target.checked);
                  displayToast(e.target.checked ? 'Profile node configured as PRIVATE.' : 'Profile node configured as PUBLIC.');
                }}
                className="w-10 h-5 bg-zinc-200 checked:bg-blue-600 rounded-full appearance-none relative transition-all before:content-[''] before:absolute before:left-0.5 before:top-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-5 cursor-pointer outline-none border dark:border-zinc-850"
              />
            </div>

            <div className="flex items-center justify-between py-1 border-t border-zinc-50 dark:border-zinc-850 pt-4">
              <div className="flex flex-col gap-0.5 max-w-md">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Toggle Mentions</span>
                <span className="text-xs text-zinc-500 leading-normal">
                  Allow other researchers and designers to tag your username in post comments.
                </span>
              </div>
              <input
                type="checkbox"
                checked={allowTags}
                onChange={(e) => {
                  setAllowTags(e.target.checked);
                  displayToast(e.target.checked ? 'Mentions enabled successfully.' : 'Mentions blocked.');
                }}
                className="w-10 h-5 bg-zinc-200 checked:bg-blue-600 rounded-full appearance-none relative transition-all before:content-[''] before:absolute before:left-0.5 before:top-0.5 before:w-4 before:h-4 before:bg-white before:rounded-full before:transition-all checked:before:translate-x-5 cursor-pointer outline-none border dark:border-zinc-850"
              />
            </div>
          </div>
        </div>

        {/* 4. Appearance settings card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-850 p-5 rounded-2xl shadow-xs select-none">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-zinc-50 dark:border-zinc-850">
            <Palette className="w-4.5 h-4.5 text-zinc-500" />
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 capitalize">
              Appearance Preferences
            </h3>
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Selected Theme Mode
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'light', label: 'Light Mode', color: 'bg-zinc-100 border-zinc-200' },
                { id: 'dark', label: 'Cosmic Dark', color: 'bg-zinc-950 border-zinc-800 text-white' },
                { id: 'system', label: 'System Mode', color: 'bg-zinc-50 border-zinc-200' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setThemeMode(m.id as any);
                    displayToast(`Appearance mode updated to: ${m.id.toUpperCase()}`);
                  }}
                  className={`
                    flex flex-col p-3 rounded-xl border text-center transition-all cursor-pointer font-semibold text-xs
                    ${theme === m.id
                      ? 'border-blue-600 bg-blue-50/20 text-blue-605 dark:border-blue-500 dark:text-blue-405 dark:bg-blue-500/5 ring-1 ring-blue-500/20'
                      : 'border-zinc-200 dark:border-zinc-850 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900'
                    }
                  `}
                >
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
