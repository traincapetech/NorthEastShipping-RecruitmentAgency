import React from 'react';
import type { Metadata } from 'next';
import { dbAdapter } from '@/lib/db';
import { getAdminSession } from '@/actions/admin';
import {
  EnquiriesManager,
  TrainingEnquiryRecord,
  ContactEnquiryRecord
} from '@/components/admin/EnquiriesManager';

export const metadata: Metadata = {
  title: 'Inquiries & Messages | Admin Console',
  robots: { index: false, follow: false }
};

export default async function AdminEnquiriesPage() {
  const [trainingRes, contactRes, session] = await Promise.all([
    dbAdapter.getTrainingEnquiries({ limit: 100 }),
    dbAdapter.getContactEnquiries({ limit: 100 }),
    getAdminSession()
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <EnquiriesManager
        initialTrainingEnquiries={trainingRes.data as TrainingEnquiryRecord[]}
        initialContactEnquiries={contactRes.data as ContactEnquiryRecord[]}
        currentUserRole={session?.role || 'ADMIN'}
      />
    </div>
  );
}
