import React from 'react';
import type { Metadata } from 'next';
import { getOpportunities } from '@/services/recruitment.service';
import { getAdminSession } from '@/actions/admin';
import { OpportunitiesManager } from '@/components/admin/OpportunitiesManager';

export const metadata: Metadata = {
  title: 'Recruitment Opportunities | Admin Console',
  robots: { index: false, follow: false }
};

export default async function AdminOpportunitiesPage() {
  const [opportunities, session] = await Promise.all([
    getOpportunities(),
    getAdminSession()
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <OpportunitiesManager
        initialOpportunities={opportunities}
        currentUserRole={session?.role || 'ADMIN'}
      />
    </div>
  );
}
