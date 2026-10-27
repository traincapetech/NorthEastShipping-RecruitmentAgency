import React from 'react';
import type { Metadata } from 'next';
import { dbAdapter } from '@/lib/db';
import { getAdminSession } from '@/actions/admin';
import { ApplicationsManager, ApplicationRecord } from '@/components/admin/ApplicationsManager';

export const metadata: Metadata = {
  title: 'Candidate Applications | Admin Console',
  robots: { index: false, follow: false }
};

export default async function AdminApplicationsPage() {
  const [applicationsRes, session] = await Promise.all([
    dbAdapter.getApplications({ limit: 100 }),
    getAdminSession()
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <ApplicationsManager
        initialApplications={applicationsRes.data as ApplicationRecord[]}
        currentUserRole={session?.role || 'ADMIN'}
      />
    </div>
  );
}
