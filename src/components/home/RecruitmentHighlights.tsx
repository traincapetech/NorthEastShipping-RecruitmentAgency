'use client';

import React, { useState, useMemo } from 'react';
import { RecruitmentOpportunity } from '@/types';
import { JobCard } from '@/components/jobs/JobCard';
import { Button } from '@/components/ui/Button';
import { Compass, ArrowRight, Filter, Ship } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecruitmentHighlightsProps {
  opportunities: RecruitmentOpportunity[];
}

export function RecruitmentHighlights({ opportunities }: RecruitmentHighlightsProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Openings' },
    { id: 'merchant-navy', label: 'Merchant Navy' },
    { id: 'cruise-ship', label: 'Cruise Ship' },
    { id: 'hospitality-wellness', label: 'Hospitality & Spa' },
    { id: 'technical-engineering', label: 'Technical' }
  ];

  const filtered = useMemo(() => {
    if (activeTab === 'all') return opportunities.slice(0, 4);
    return opportunities.filter((o) => o.category === activeTab);
  }, [opportunities, activeTab]);

  return (
    <section className="py-20 bg-navy-950 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-ocean-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Current Openings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured Recruitment Opportunities
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-2xl">
              Active seafaring assignments and international hospitality openings aboard ocean-going commercial carriers and passenger vessels.
            </p>
          </div>

          <Button
            href="/opportunities"
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Complete Career Board
          </Button>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter Stream:</span>
          </span>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-navy-950 font-bold shadow-md shadow-cyan-500/25'
                  : 'bg-navy-900/80 text-slate-300 hover:text-white hover:bg-navy-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid of opportunities with Motion Transition */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((opp) => (
              <motion.div
                key={opp.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <JobCard opportunity={opp} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-xl bg-navy-900/50 border border-slate-800">
            <Ship className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No active openings in this specific stream right now.</p>
            <p className="text-xs text-slate-400 mt-1">Please check our other sectors or submit your general seafarer dossier.</p>
          </div>
        )}
      </div>
    </section>
  );
}
