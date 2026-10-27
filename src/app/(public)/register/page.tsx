'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserPlus, ShieldAlert } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'merchant-navy',
    password: '',
    confirmPassword: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setStatusMessage('Passwords do not match. Please verify your entries.');
      return;
    }
    setStatusMessage('Candidate registration shell created. Database authentication and session verification will be enabled in Phase 2.');
  };

  return (
    <div className="pt-28 pb-20 bg-navy-950 min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 maritime-grid opacity-25 pointer-events-none" />

      <Container size="sm" className="relative z-10 py-12">
        <Card glow className="p-8 sm:p-10 bg-navy-900/95 border-cyan-500/30 max-w-lg mx-auto shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-navy-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Candidate Account</h1>
            <p className="text-xs text-slate-400 mt-1">
              Register your seafarer profile to submit applications and monitor recruitment review.
            </p>
          </div>

          {statusMessage && (
            <div className="mb-6 p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Legal Name (as in Passport) *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Captain / Officer Name"
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Primary Seafaring Sector
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="merchant-navy">Merchant Navy (Deck / Engine Officers & Crew)</option>
                <option value="cruise-ship">International Cruise Liners (Hotel & Guest Ops)</option>
                <option value="hospitality-wellness">Shipboard Hospitality & Spa Therapies</option>
                <option value="offline-cadet">Offline Cadetship & Pre-Sea Training Aspirant</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="cyan" size="lg" className="w-full">
              Complete Candidate Registration
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
              Sign In to Candidate Portal
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
