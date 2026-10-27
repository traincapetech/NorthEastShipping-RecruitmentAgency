import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { TrainingFilters } from '@/components/training/TrainingFilters';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { getTrainingPrograms } from '@/services/training.service';
import { GraduationCap, School, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offline Merchant Navy Training Programs & Academy Admissions',
  description: 'Explore verified offline Merchant Navy cadetship, GP Rating, ETO and STCW safety training programs with Northeast Shipping. Physical campus & simulator training only.'
};

export default async function TrainingPage() {
  const programs = await getTrainingPrograms();

  return (
    <div className="pt-28 pb-20 bg-navy-950 min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800/80 bg-navy-900/40 py-14 relative">
        <div className="absolute inset-0 maritime-grid opacity-20 pointer-events-none" />
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Offline Maritime Academy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Merchant Navy Training Programs
            </h1>
            <p className="mt-3 text-base text-slate-300">
              Structured pre-sea preparatory and certified safety programs conducted exclusively at physical campus academies with approved practical marine simulators.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12 space-y-16">
        {/* Offline Maritime Academy Advisory Banner */}
        <div className="p-6 rounded-2xl bg-navy-900/90 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start md:items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">Maritime Regulatory Policy</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Strictly Offline
                </span>
              </div>
              <h4 className="text-base font-bold text-white">100% Practical Academy & Simulator Training</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Navigation watchkeeping, firefighting smoke-drills, wet life raft survival, and marine engine room overhauling cannot be learned via distance learning. We do not provide or recognize online classes or course fees online.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Residential Campus & Mess</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>DG Shipping Approved Standards</span>
            </div>
          </div>
        </div>

        {/* Filterable Training Catalog */}
        <div>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Approved Academy Programs</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select a program to review comprehensive entry qualifications, batch intake dates, and physical training modules.
              </p>
            </div>
          </div>

          <TrainingFilters initialPrograms={programs} />
        </div>

        {/* Anti-Fraud Notice */}
        <div className="p-5 rounded-xl bg-navy-900/60 border border-amber-500/30 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300 font-semibold block mb-0.5">Admissions Integrity Advisory:</strong>
            All admissions are subject to verification of authentic academic marksheets and passing the official seafarer medical examination conducted by approved DG Shipping maritime medical doctors. Beware of touts promising fake exemptions.
          </div>
        </div>

        {/* Direct General Admission Enquiry Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">General Academy Admissions Enquiry</h2>
              <p className="text-xs text-slate-400 mt-1.5 max-w-lg mx-auto">
                Not sure which maritime track aligns with your academic background? Submit your details below to speak with an academy counselor.
              </p>
            </div>
            <EnquiryForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
