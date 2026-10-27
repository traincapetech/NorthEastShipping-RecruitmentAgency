'use client';

import React, { useState, useMemo } from 'react';
import { RecruitmentOpportunity } from '@/types';
import { JobCard } from './JobCard';
import { Search, Filter, Ship, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface JobFiltersProps {
  initialOpportunities: RecruitmentOpportunity[];
  defaultCategory?: string;
}

export function JobFilters({ initialOpportunities, defaultCategory = 'all' }: JobFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'title'>('latest');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'merchant-navy', label: 'Merchant Navy' },
    { id: 'cruise-ship', label: 'Cruise Ship Fleets' },
    { id: 'hospitality-wellness', label: 'Hospitality & Wellness' },
    { id: 'technical-engineering', label: 'Technical & Engineering' }
  ];

  // Distinct departments dynamically extracted from opportunities
  const departments = useMemo(() => {
    const deps = Array.from(new Set(initialOpportunities.map((o) => o.department)));
    return ['all', ...deps];
  }, [initialOpportunities]);

  const filteredOpportunities = useMemo(() => {
    const result = initialOpportunities.filter((opp) => {
      const matchesCategory =
        selectedCategory === 'all' || opp.category === selectedCategory;
      const matchesDepartment =
        selectedDepartment === 'all' || opp.department === selectedDepartment;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        opp.title.toLowerCase().includes(q) ||
        opp.department.toLowerCase().includes(q) ||
        opp.vesselType.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.requirements.some((r) => r.toLowerCase().includes(q));

      return matchesCategory && matchesDepartment && matchesSearch;
    });

    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    }

    return result;
  }, [initialOpportunities, selectedCategory, selectedDepartment, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedCategory !== 'all' || selectedDepartment !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDepartment('all');
    setSortBy('latest');
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by rank, title, vessel type, department, or requirements..."
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

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Stream:</span>
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

        {/* Secondary Filters Bar (Department & Sorting) */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showAdvanced ? 'Hide Department Filter' : 'Filter by Department'}</span>
            </button>

            {showAdvanced && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-1.5 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="all">All Departments</option>
                  {departments.filter((d) => d !== 'all').map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'title')}
              className="px-2.5 py-1 bg-navy-950 border border-slate-700 rounded-md text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              <option value="latest">Latest Vacancies</option>
              <option value="title">Job Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-slate-400">Active Filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy-800 border border-cyan-500/30 text-xs text-cyan-300">
              Stream: {categories.find((c) => c.id === selectedCategory)?.label}
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="hover:text-white ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {selectedDepartment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy-800 border border-cyan-500/30 text-xs text-cyan-300">
              Department: {selectedDepartment}
              <button
                type="button"
                onClick={() => setSelectedDepartment('all')}
                className="hover:text-white ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {searchQuery.trim() !== '' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy-800 border border-cyan-500/30 text-xs text-cyan-300">
              Search: &quot;{searchQuery}&quot;
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="hover:text-white ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={resetAllFilters}
            className="text-xs text-cyan-400 hover:underline ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-semibold">{filteredOpportunities.length}</strong> available vacancies
        </span>
      </div>

      {/* Grid of Results */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opp) => (
            <JobCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-slate-800 bg-navy-900/40 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-navy-800 border border-slate-700 flex items-center justify-center text-slate-500 mx-auto">
            <Ship className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Matching Positions Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              We couldn&apos;t find any active seafaring positions matching your search criteria. Try modifying your keywords or resetting stream filters.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAllFilters}
            className="px-4 py-2 bg-navy-800 border border-slate-700 rounded-lg text-xs text-cyan-400 font-medium hover:bg-navy-700 transition-colors cursor-pointer"
          >
            Clear All Filters & Show All Positions
          </button>
        </div>
      )}
    </div>
  );
}
