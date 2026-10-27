import React from 'react';
import type { Metadata } from 'next';
import { getTrainingPrograms } from '@/services/training.service';
import { getAdminSession } from '@/actions/admin';
import { TrainingManager } from '@/components/admin/TrainingManager';

export const metadata: Metadata = {
  title: 'Offline Training Programs | Admin Console',
  robots: { index: false, follow: false }
};

export default async function AdminTrainingPage() {
  const [programs, session] = await Promise.all([
    getTrainingPrograms(),
    getAdminSession()
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <TrainingManager
        initialPrograms={programs}
        currentUserRole={session?.role || 'ADMIN'}
      />
    </div>
  );
}
