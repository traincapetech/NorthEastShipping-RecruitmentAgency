import React from 'react';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 maritime-grid opacity-20 pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 p-8 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-navy-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-6">
          <Compass className="w-8 h-8" />
        </div>

        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          Coordinates Uncharted · 404
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Page Not Located
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 mb-8 leading-relaxed">
          The maritime route, opportunity listing, or training syllabus you requested does not exist on our navigation chart.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/" variant="cyan" size="md" icon={<Home className="w-4 h-4" />}>
            Return to Port (Home)
          </Button>
          <Button href="/opportunities" variant="secondary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
            All Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
}
