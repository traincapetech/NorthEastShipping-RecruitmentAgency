import React from 'react';
import type { Metadata } from 'next';
import { getAdminSession } from '@/actions/admin';
import { checkDatabaseHealth } from '@/lib/db';
import { AdminLayoutClient } from '@/components/layout/AdminLayoutClient';

export const metadata: Metadata = {
  title: 'Admin Console | Northeast Shipping & Recruitment Agency Pvt Ltd',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const dbHealth = await checkDatabaseHealth();

  const currentRole = session?.role || 'ADMIN';
  const userEmail = session?.email || 'admin@northeastshipping.test';

  return (
    <AdminLayoutClient
      currentRole={currentRole}
      userEmail={userEmail}
      databaseDriver={dbHealth.driver}
    >
      {children}
    </AdminLayoutClient>
  );
}
