'use client';

import React, { useState, useTransition } from 'react';
import { UserRole } from '@/models/validation';
import { switchDemoRoleAction } from '@/actions/admin';
import {
  Menu,
  Shield,
  ShieldCheck,
  ChevronDown,
  Database,
  ExternalLink,
  Check
} from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  currentRole: UserRole;
  userEmail: string;
  onToggleMobileMenu: () => void;
  databaseDriver: string;
}

const ROLES: Array<{ role: UserRole; title: string; desc: string }> = [
  { role: 'ADMIN', title: 'System Administrator', desc: 'Full permissions (CRUD all, deletions)' },
  { role: 'RECRUITER', title: 'Crewe Recruitment Officer', desc: 'Vacancies CRUD & candidate triage' },
  { role: 'ADMISSIONS', title: 'Admissions Counselor', desc: 'Training catalog CRUD & academy enquiries' }
];

export function AdminHeader({
  currentRole,
  userEmail,
  onToggleMobileMenu,
  databaseDriver
}: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRoleSelect = (role: UserRole) => {
    setDropdownOpen(false);
    startTransition(async () => {
      await switchDemoRoleAction(role);
      window.location.reload();
    });
  };

  const currentRoleObj = ROLES.find((r) => r.role === currentRole) || ROLES[0];

  return (
    <header className="h-16 border-b border-slate-800 bg-navy-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger button + Console title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 border border-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md hidden xs:inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restricted Console</span>
          </span>
          <span className="text-xs text-slate-400 hidden md:inline truncate max-w-[240px] xl:max-w-none">
            Northeast Shipping & Recruitment Agency Pvt Ltd
          </span>
        </div>
      </div>

      {/* Right side: Database status + Active Session Role Switcher + Public Site */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* DB Connection Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-navy-900/80 border border-slate-800 px-2.5 py-1.5 rounded-lg"
          title={`Active Datastore: ${databaseDriver}`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate max-w-[120px] lg:max-w-none text-slate-300">
            {databaseDriver.includes('MongoDB') ? 'MongoDB Live' : 'Persistent DB'}
          </span>
        </div>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={isPending}
            className="flex items-center gap-2 text-xs text-slate-200 bg-navy-900 hover:bg-navy-850 border border-slate-700/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-60"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div className="text-left hidden sm:block">
              <span className="font-semibold text-white block leading-tight">
                {currentRole}
              </span>
              <span className="text-[10px] text-slate-400 block leading-none">
                {isPending ? 'Switching...' : currentRoleObj.title.split(' ')[0]}
              </span>
            </div>
            <span className="sm:hidden font-semibold text-cyan-300">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-navy-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <p className="text-[11px] font-semibold text-slate-200">Switch Authorized Role</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{userEmail}</p>
                </div>

                <div className="space-y-1">
                  {ROLES.map((r) => {
                    const isSelected = r.role === currentRole;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => handleRoleSelect(r.role)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-950/70 text-cyan-200 border border-cyan-500/30'
                            : 'hover:bg-navy-800/80 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{r.role}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({r.title})</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {r.desc}
                          </p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 px-2 text-[10px] text-slate-500">
                  Select a role to verify backend RBAC authorization and permission limits.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden xs:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-navy-900 transition-colors"
          title="Open Public Site in New Tab"
        >
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Public Site</span>
        </Link>
      </div>
    </header>
  );
}
