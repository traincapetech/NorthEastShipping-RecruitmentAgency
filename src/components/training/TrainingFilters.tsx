'use client';

import React, { useState, useMemo } from 'react';
import { TrainingProgram } from '@/types';
import { TrainingCard } from './TrainingCard';
import { Search, GraduationCap, School, X } from 'lucide-react';

interface TrainingFiltersProps {
  initialPrograms: TrainingProgram[];
}

export function TrainingFilters({ initialPrograms }: TrainingFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Academy Programs' },
    { id: 'ratings', label: 'GP Rating (Ratings)' },
    { id: 'officer-cadet', label: 'Officer Cadet (DNS)' },
    { id: 'pre-sea', label: 'Technical Officers (ETO)' },
    { id: 'stcw-mandatory', label: 'STCW Safety Modulars' }
  ];

  const filteredPrograms = useMemo(() => {
    return initialPrograms.filter((prog) => {
      const matchesCategory =
        selectedCategory === 'all' || prog.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prog.title.toLowerCase().includes(q) ||
        prog.code.toLowerCase().includes(q) ||
        prog.overview.toLowerCase().includes(q) ||
        prog.eligibility.toLowerCase().includes(q) ||
        prog.certificationBody.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [initialPrograms, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Stream Filter Toolbar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs by title, qualification, certificate body, or code..."
            className="w-full pl-12 pr-10 py-3 bg-navy-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:border-cyan-400 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Track:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-navy-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-navy-800/80 text-slate-300 hover:text-white hover:bg-navy-700 border border-slate-700/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-semibold">{filteredPrograms.length}</strong> offline academy programs
        </span>
        {(searchQuery || selectedCategory !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Programs */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPrograms.map((prog) => (
            <TrainingCard key={prog.id} program={prog} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-navy-900/40 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-navy-800 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
            <School className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Matching Training Programs Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              No training programs matched your search keywords. We offer residential pre-sea and safety courses year-round.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-navy-800 border border-slate-700 rounded-lg text-xs text-cyan-400 font-medium hover:bg-navy-700 transition-colors cursor-pointer"
          >
            View All Programs
          </button>
        </div>
      )}
    </div>
  );
}
