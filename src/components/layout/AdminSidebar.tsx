'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Users,
  MessageSquare,
  Shield,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';

export const ADMIN_NAV = [
  { label: 'Overview Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Recruitment Openings', href: '/admin/opportunities', icon: Briefcase },
  { label: 'Training Admissions', href: '/admin/training', icon: GraduationCap },
  { label: 'Candidate Applications', href: '/admin/applications', icon: Users },
  { label: 'Enquiries & Messages', href: '/admin/enquiries', icon: MessageSquare },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Area */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <BrandLogo showSubtitle={false} />
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono tracking-wide">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Control Console</span>
            </div>
          </div>
          {onMobileClose && (
            <button
              type="button"
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900 transition-colors cursor-pointer"
              aria-label="Close sidebar navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1" aria-label="Admin Navigation">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-navy-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Return Link & Operational Status */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="p-3 rounded-lg bg-navy-900/90 border border-slate-800 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Maritime Ops Active</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Role-Based Access Control & Database Sync active.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-navy-900/60 hover:bg-navy-850 text-xs text-slate-300 hover:text-white transition-colors border border-slate-800/80"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>Return to Public Site</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 bg-navy-950 border-r border-slate-800 h-screen sticky top-0 shrink-0 z-20">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-navy-950 border-r border-slate-800 h-full shadow-2xl z-50">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
