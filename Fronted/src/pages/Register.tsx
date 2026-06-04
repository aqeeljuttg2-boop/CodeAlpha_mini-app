/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { User, Mail, Lock, Hexagon, ShieldAlert, BadgeCheck } from 'lucide-react';

export const Register: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Input Validations
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setErrorMsg('All fields are required. Please review input values.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters in length.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const success = await register(fullName, username.toLowerCase(), email, password);
      if (success) {
        navigate('/', { replace: true });
      } else {
        setErrorMsg('Failed to create account. Username or Email may already be registered.');
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none opacity-20 dark:opacity-[0.03]">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500 rounded-full filter blur-3xl -top-10 -left-10" />
        <div className="absolute w-[500px] h-[500px] bg-indigo-500 rounded-full filter blur-3xl -bottom-10 -right-10" />
      </div>

      <div className="w-full max-w-md flex flex-col gap-8 z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Core Header */}
        <div className="flex flex-col items-center gap-3.5 text-center select-none">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/15">
            <Hexagon className="w-8 h-8 fill-white/10" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col mt-0.5">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-slate-400 font-display">
              Join ConnectHub
            </h1>
            <p className="text-xs font-semibold text-zinc-500 dark:text-slate-455 max-w-xs mt-1.5 leading-relaxed">
              Create a personalized creative profile to start sharing updates and following creators.
            </p>
          </div>
        </div>

        {/* Card Panel */}
        <div className="glass-panel rounded-2xl p-6.5 shadow-xl flex flex-col gap-5">
          
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-500/[0.08] dark:bg-red-500/[0.05] border border-red-500/25 p-3 rounded-xl text-xs text-red-500 dark:text-red-450 font-semibold leading-normal">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <Input
              id="fullName"
              type="text"
              label="Full Name"
              placeholder="Alex Mercer"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              autoComplete="name"
            />

            <Input
              id="username"
              type="text"
              label="Username"
              placeholder="alexmercer"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ''))}
              icon={<BadgeCheck className="w-4 h-4" />}
              autoComplete="username"
            />

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="alex.mercer@connecthub.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              autoComplete="email"
            />

            <Input
              id="password"
              type="password"
              label="Choose Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              autoComplete="new-password"
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-3.5 font-bold py-2.5">
              Create Account
            </Button>
          </form>
        </div>

        {/* Action routing redirection */}
        <p className="text-center text-xs font-semibold text-zinc-500 dark:text-slate-400 select-none">
          Already have an account?{' '}
          <Link to="/" className="text-cyan-500 font-bold hover:underline">
            Sign In Instead
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
