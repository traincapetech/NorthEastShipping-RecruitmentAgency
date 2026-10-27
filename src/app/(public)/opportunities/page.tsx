import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { JobFilters } from '@/components/jobs/JobFilters';
import { getOpportunities } from '@/services/recruitment.service';
import { Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recruitment Opportunities',
  description: 'Explore verified commercial shipping, international cruise liner, and hospitality seafaring positions with Northeast Shipping.'
};

type OpportunitiesPageProps = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const resolvedParams = await searchParams;
  const initialOpportunities = await getOpportunities();

  return (
    <div className="pt-28 pb-20 bg-navy-950 min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800/80 bg-navy-900/40 py-14 relative">
        <div className="absolute inset-0 maritime-grid opacity-20 pointer-events-none" />
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Career Board</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Recruitment Opportunities
            </h1>
            <p className="mt-3 text-base text-slate-300">
              Browse current vacancies across Merchant Navy deck & engine ranks, cruise ship passenger relations, and offshore technical operations.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <JobFilters
          initialOpportunities={initialOpportunities}
          defaultCategory={resolvedParams.category || 'all'}
        />
      </Container>
    </div>
  );
}
