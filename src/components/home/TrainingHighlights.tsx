import React from 'react';
import Link from 'next/link';
import { TrainingProgram } from '@/types';
import { TrainingCard } from '@/components/training/TrainingCard';
import { Button } from '@/components/ui/Button';
import { GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

interface TrainingHighlightsProps {
  programs: TrainingProgram[];
}

export function TrainingHighlights({ programs }: TrainingHighlightsProps) {
  return (
    <section className="py-20 bg-navy-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Offline Preparatory & Cadet Academies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Merchant Navy Training Programs
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              Strictly offline residential training, bridge/engine simulator drills, and STCW-compliant safety courses preparing candidates for maritime certification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              href="/training"
              variant="outline"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              All Training Programs
            </Button>
          </div>
        </div>

        {/* Offline notice alert */}
        <div className="mb-10 p-4 rounded-xl bg-navy-900/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Offline Practical Delivery Notice
              </p>
              <p className="text-xs text-slate-400">
                Seafaring requires physical simulator drills, firefighting, and boat work. All programs are conducted strictly on physical academy campuses. No online courses are offered.
              </p>
            </div>
          </div>
          <Link
            href="/contact?type=training"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 whitespace-nowrap self-start sm:self-auto"
          >
            Submit Offline Admission Enquiry →
          </Link>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
          {programs.slice(0, 4).map((p) => (
            <TrainingCard key={p.id} program={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
