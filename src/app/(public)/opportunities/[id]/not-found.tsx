import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Ship, ArrowLeft } from 'lucide-react';

export default function OpportunityNotFound() {
  return (
    <div className="pt-32 pb-24 bg-navy-950 min-h-screen flex items-center">
      <Container>
        <div className="max-w-lg mx-auto text-center space-y-6 p-8 rounded-2xl bg-navy-900/60 border border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
            <Ship className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
              Notice: Position Not Found
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              Opportunity Not Located
            </h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              The vacancy you are searching for may have been filled, rotated out, or the reference ID is invalid. Explore our current open crewing intake.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-navy-950 font-bold text-xs hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Browse Active Recruitment Vacancies</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
