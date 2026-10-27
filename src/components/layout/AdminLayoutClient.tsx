'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { UserRole } from '@/models/validation';

interface AdminLayoutClientProps {
  currentRole: UserRole;
  userEmail: string;
  databaseDriver: string;
  children: React.ReactNode;
}

export function AdminLayoutClient({
  currentRole,
  userEmail,
  databaseDriver,
  children
}: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-navy-950 text-slate-100">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          currentRole={currentRole}
          userEmail={userEmail}
          databaseDriver={databaseDriver}
          onToggleMobileMenu={() => setMobileOpen(true)}
        />

        {/* Content Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-navy-950">
          {children}
        </main>
      </div>
    </div>
  );
}
