import React from 'react';
import { Container } from '@/components/ui/Container';

export default function TrainingLoading() {
  return (
    <div className="pt-28 pb-20 bg-navy-950 min-h-screen">
      <div className="border-b border-slate-800/80 bg-navy-900/40 py-14">
        <Container>
          <div className="max-w-3xl space-y-3">
            <div className="w-32 h-4 rounded bg-slate-800 animate-pulse" />
            <div className="w-96 h-10 rounded bg-slate-800 animate-pulse" />
            <div className="w-full max-w-lg h-4 rounded bg-slate-800/70 animate-pulse" />
          </div>
        </Container>
      </div>

      <Container className="py-12 space-y-12">
        <div className="h-24 rounded-2xl bg-navy-900/80 border border-slate-800 animate-pulse" />

        {/* Filter bar skeleton */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-4">
          <div className="w-full h-12 rounded-xl bg-slate-800/60 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-28 h-8 rounded-lg bg-slate-800/60 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Cards skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-navy-900/60 border border-slate-800 p-6 space-y-4 animate-pulse">
              <div className="flex justify-between">
                <div className="w-20 h-5 rounded bg-slate-800" />
                <div className="w-24 h-5 rounded bg-slate-800" />
              </div>
              <div className="w-4/5 h-6 rounded bg-slate-800" />
              <div className="space-y-2 pt-4">
                <div className="w-full h-4 rounded bg-slate-800/50" />
                <div className="w-3/4 h-4 rounded bg-slate-800/50" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
