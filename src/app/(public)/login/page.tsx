'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserCheck, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Authentication service is initializing. Database authentication hooks will connect in the upcoming deployment phase.');
  };

  return (
    <div className="pt-28 pb-20 bg-navy-950 min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 maritime-grid opacity-25 pointer-events-none" />

      <Container size="sm" className="relative z-10 py-12">
        <Card glow className="p-8 sm:p-10 bg-navy-900/95 border-cyan-500/30 max-w-md mx-auto shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-navy-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Candidate Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Access your seafarer application status and profile dossier.
            </p>
          </div>

          {statusMessage && (
            <div className="mb-6 p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seafarer@domain.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <a href="#reset" onClick={(e) => { e.preventDefault(); setStatusMessage('Password reset will be sent to verified email addresses upon database configuration.'); }} className="text-[11px] text-cyan-400 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="cyan" size="lg" className="w-full">
              Sign In to Candidate Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 space-y-3">
            <p>
              New candidate?{' '}
              <Link href="/register" className="text-cyan-400 font-semibold hover:underline">
                Create Seafarer Account
              </Link>
            </p>
            <p className="text-[11px]">
              Are you an authorized recruitment officer?{' '}
              <Link href="/admin" className="text-slate-300 hover:text-cyan-300 underline">
                Go to Staff Admin Console
              </Link>
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}
