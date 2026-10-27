'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { RecruitmentOpportunity } from '@/types';
import { AdminModal } from './AdminModal';
import {
  createOpportunityAction,
  updateOpportunityAction,
  deleteOpportunityAction
} from '@/actions/admin';
import {
  Search,
  Filter,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Briefcase,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface OpportunitiesManagerProps {
  initialOpportunities: RecruitmentOpportunity[];
  currentUserRole?: string;
}

type CategoryType = 'merchant-navy' | 'cruise-ship' | 'hospitality-wellness' | 'technical-engineering';

interface FormDataState {
  title: string;
  category: CategoryType;
  department: string;
  vesselType: string;
  contractDuration: string;
  location: string;
  experienceRequired: string;
  stcwRequired: boolean;
  passportRequired: boolean;
  cdcRequired: boolean;
  description: string;
  responsibilitiesText: string;
  requirementsText: string;
  status: 'Open' | 'Upcoming' | 'Closed';
}

const DEFAULT_FORM: FormDataState = {
  title: '',
  category: 'merchant-navy',
  department: '',
  vesselType: '',
  contractDuration: '6-9 Months Rotational',
  location: 'International Waters',
  experienceRequired: '',
  stcwRequired: true,
  passportRequired: true,
  cdcRequired: true,
  description: '',
  responsibilitiesText: '',
  requirementsText: '',
  status: 'Open'
};

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Categories' },
  { value: 'merchant-navy', label: 'Merchant Navy' },
  { value: 'cruise-ship', label: 'Cruise Ship Lines' },
  { value: 'hospitality-wellness', label: 'Hospitality & Wellness' },
  { value: 'technical-engineering', label: 'Technical & Engineering' }
];

export function OpportunitiesManager({
  initialOpportunities,
  currentUserRole: _currentUserRole = 'ADMIN'
}: OpportunitiesManagerProps) {
  const [opportunities, setOpportunities] = useState<RecruitmentOpportunity[]>(initialOpportunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecruitmentOpportunity | null>(null);
  const [deletingItem, setDeletingItem] = useState<RecruitmentOpportunity | null>(null);

  // Form State
  const [formData, setFormData] = useState<FormDataState>(DEFAULT_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Clear notification timer
  const notify = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // Filtered List
  const filtered = useMemo(() => {
    return opportunities.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vesselType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [opportunities, searchQuery, selectedCategory, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Open Create
  const handleOpenCreate = () => {
    setFormData(DEFAULT_FORM);
    setFormError(null);
    setIsCreateOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (opp: RecruitmentOpportunity) => {
    setEditingItem(opp);
    setFormData({
      title: opp.title,
      category: opp.category,
      department: opp.department,
      vesselType: opp.vesselType,
      contractDuration: opp.contractDuration,
      location: opp.location,
      experienceRequired: opp.experienceRequired,
      stcwRequired: opp.stcwRequired,
      passportRequired: opp.passportRequired,
      cdcRequired: opp.cdcRequired,
      description: opp.description,
      responsibilitiesText: opp.responsibilities.join('\n'),
      requirementsText: opp.requirements.join('\n'),
      status: opp.status
    });
    setFormError(null);
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const responsibilities = formData.responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const requirements = formData.requirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (responsibilities.length === 0) {
      setFormError('Please provide at least one key responsibility (one per line).');
      return;
    }
    if (requirements.length === 0) {
      setFormError('Please provide at least one requirement/qualification (one per line).');
      return;
    }

    startTransition(async () => {
      const res = await createOpportunityAction({
        title: formData.title.trim(),
        category: formData.category,
        department: formData.department.trim(),
        vesselType: formData.vesselType.trim(),
        contractDuration: formData.contractDuration.trim(),
        location: formData.location.trim(),
        experienceRequired: formData.experienceRequired.trim(),
        stcwRequired: formData.stcwRequired,
        passportRequired: formData.passportRequired,
        cdcRequired: formData.cdcRequired,
        description: formData.description.trim(),
        responsibilities,
        requirements,
        status: formData.status
      });

      if (!res.success) {
        setFormError(res.message || 'Failed to create opportunity');
        return;
      }

      // Add to local state
      const newOpp: RecruitmentOpportunity = {
        id: res.referenceId || `rec-${Date.now()}`,
        title: formData.title.trim(),
        category: formData.category,
        department: formData.department.trim(),
        vesselType: formData.vesselType.trim(),
        contractDuration: formData.contractDuration.trim(),
        location: formData.location.trim(),
        experienceRequired: formData.experienceRequired.trim(),
        stcwRequired: formData.stcwRequired,
        passportRequired: formData.passportRequired,
        cdcRequired: formData.cdcRequired,
        description: formData.description.trim(),
        responsibilities,
        requirements,
        status: formData.status,
        postedAt: new Date().toISOString().split('T')[0]
      };

      setOpportunities([newOpp, ...opportunities]);
      setIsCreateOpen(false);
      notify(res.message || 'Vacancy published successfully!');
    });
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setFormError(null);

    const responsibilities = formData.responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const requirements = formData.requirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (responsibilities.length === 0) {
      setFormError('Please provide at least one key responsibility.');
      return;
    }
    if (requirements.length === 0) {
      setFormError('Please provide at least one requirement.');
      return;
    }

    startTransition(async () => {
      const res = await updateOpportunityAction(editingItem.id, {
        title: formData.title.trim(),
        category: formData.category,
        department: formData.department.trim(),
        vesselType: formData.vesselType.trim(),
        contractDuration: formData.contractDuration.trim(),
        location: formData.location.trim(),
        experienceRequired: formData.experienceRequired.trim(),
        stcwRequired: formData.stcwRequired,
        passportRequired: formData.passportRequired,
        cdcRequired: formData.cdcRequired,
        description: formData.description.trim(),
        responsibilities,
        requirements,
        status: formData.status
      });

      if (!res.success) {
        setFormError(res.message || 'Failed to update opportunity');
        return;
      }

      setOpportunities(
        opportunities.map((opp) =>
          opp.id === editingItem.id
            ? {
                ...opp,
                title: formData.title.trim(),
                category: formData.category,
                department: formData.department.trim(),
                vesselType: formData.vesselType.trim(),
                contractDuration: formData.contractDuration.trim(),
                location: formData.location.trim(),
                experienceRequired: formData.experienceRequired.trim(),
                stcwRequired: formData.stcwRequired,
                passportRequired: formData.passportRequired,
                cdcRequired: formData.cdcRequired,
                description: formData.description.trim(),
                responsibilities,
                requirements,
                status: formData.status
              }
            : opp
        )
      );

      setEditingItem(null);
      notify(res.message || 'Opportunity updated successfully!');
    });
  };

  // Submit Delete
  const handleDeleteConfirm = () => {
    if (!deletingItem) return;

    startTransition(async () => {
      const res = await deleteOpportunityAction(deletingItem.id);
      if (!res.success) {
        setFormError(res.message || 'Failed to delete opportunity');
        return;
      }

      setOpportunities(opportunities.filter((opp) => opp.id !== deletingItem.id));
      setDeletingItem(null);
      notify(res.message || 'Opportunity removed from active registry.');
    });
  };

  // Quick Status Toggle on Row
  const handleQuickStatusToggle = (opp: RecruitmentOpportunity) => {
    const nextStatus = opp.status === 'Open' ? 'Closed' : 'Open';
    startTransition(async () => {
      const res = await updateOpportunityAction(opp.id, { status: nextStatus });
      if (res.success) {
        setOpportunities(
          opportunities.map((item) =>
            item.id === opp.id ? { ...item, status: nextStatus } : item
          )
        );
        notify(`Status for "${opp.title}" changed to ${nextStatus}.`);
      } else {
        notify(res.message || 'Status update failed.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert / Success Notice */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="text-emerald-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <span>Recruitment Opportunities Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish vacancies, update job specifications, manage merchant & cruise crewing requirements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-cyan-500 text-navy-950 hover:bg-cyan-400 transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Vacancy</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by rank, department, vessel type..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Status: Open</option>
              <option value="Upcoming">Status: Upcoming</option>
              <option value="Closed">Status: Closed</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Showing <strong className="text-white">{filtered.length}</strong> of{' '}
              <strong className="text-white">{opportunities.length}</strong> vacancies
            </span>
          </div>

          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setCurrentPage(1);
              }}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Opportunities Data Table */}
      <div className="rounded-xl border border-slate-800 bg-navy-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Vacancy / Rank</th>
                <th className="py-3.5 px-4 font-semibold">Department & Category</th>
                <th className="py-3.5 px-4 font-semibold">Vessel Type</th>
                <th className="py-3.5 px-4 font-semibold">Mandatory Credentials</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {paginated.length > 0 ? (
                paginated.map((opp) => (
                  <tr key={opp.id} className="hover:bg-navy-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{opp.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{opp.contractDuration}</span>
                        <span>•</span>
                        <span>{opp.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{opp.department}</div>
                      <div className="text-[10px] text-cyan-400 capitalize mt-0.5">
                        {opp.category.replace(/-/g, ' ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      {opp.vesselType}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {opp.cdcRequired && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-950 border border-slate-700 text-slate-300">
                            CDC
                          </span>
                        )}
                        {opp.passportRequired && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-950 border border-slate-700 text-slate-300">
                            Passport
                          </span>
                        )}
                        {opp.stcwRequired && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-950 border border-slate-700 text-slate-300">
                            STCW
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleQuickStatusToggle(opp)}
                        title="Click to toggle Open/Closed status"
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          opp.status === 'Open'
                            ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30 hover:bg-emerald-900/60'
                            : opp.status === 'Upcoming'
                            ? 'text-amber-400 bg-amber-950/60 border-amber-500/30 hover:bg-amber-900/60'
                            : 'text-slate-400 bg-slate-900/60 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {opp.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/opportunities/${opp.id}`}
                          target="_blank"
                          className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-navy-800 transition-colors"
                          title="View Live Listing on Public Portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(opp)}
                          className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-navy-800 transition-colors cursor-pointer"
                          title="Edit Vacancy Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeletingItem(opp);
                            setFormError(null);
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Permanently Delete Vacancy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Briefcase className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-xs">No recruitment opportunities match your active filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              Page <strong className="text-white">{currentPage}</strong> of{' '}
              <strong className="text-white">{totalPages}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-850"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-850"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE OPPORTUNITY MODAL */}
      <AdminModal
        isOpen={isCreateOpen}
        onClose={() => !isPending && setIsCreateOpen(false)}
        title="Publish New Recruitment Vacancy"
        description="Add a verified maritime crewing opening to the active database and public portal."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Job Title / Rank *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Chief Officer / 2nd Officer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Industry Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="merchant-navy">Merchant Navy</option>
                <option value="cruise-ship">Cruise Ship Lines</option>
                <option value="hospitality-wellness">Hospitality & Wellness</option>
                <option value="technical-engineering">Technical & Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Department *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deck Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Vessel Type *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Container & Bulk Carriers"
                value={formData.vesselType}
                onChange={(e) => setFormData({ ...formData, vesselType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Contract Duration *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 6-9 Months Rotational"
                value={formData.contractDuration}
                onChange={(e) => setFormData({ ...formData, contractDuration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Location / Route *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. International Waters / Worldwide"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Experience Benchmark *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 12+ months sea-time as 3rd Officer"
                value={formData.experienceRequired}
                onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Mandatory Checkboxes */}
          <div className="p-3 rounded-lg bg-navy-950 border border-slate-800">
            <span className="block text-xs font-semibold text-slate-300 mb-2">
              Mandatory Seafarer Documentation:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cdcRequired}
                  onChange={(e) => setFormData({ ...formData, cdcRequired: e.target.checked })}
                  className="rounded border-slate-700 bg-navy-900 text-cyan-500 focus:ring-0"
                />
                <span>CDC Required</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.passportRequired}
                  onChange={(e) => setFormData({ ...formData, passportRequired: e.target.checked })}
                  className="rounded border-slate-700 bg-navy-900 text-cyan-500 focus:ring-0"
                />
                <span>Passport Required</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.stcwRequired}
                  onChange={(e) => setFormData({ ...formData, stcwRequired: e.target.checked })}
                  className="rounded border-slate-700 bg-navy-900 text-cyan-500 focus:ring-0"
                />
                <span>STCW Certs Required</span>
              </label>
            </div>
          </div>

          {/* Overview Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Role Description & Overview *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide a comprehensive operational summary of the vacancy..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Key Responsibilities (One per line) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Navigation watchkeeping in accordance with COLREGS&#10;Overseeing cargo loading & stability calculations&#10;Maintenance of lifesaving and firefighting appliances"
              value={formData.responsibilitiesText}
              onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Requirements & Qualifications (One per line) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Valid DG Shipping / Flag State Certificate of Competency&#10;All 5 Basic STCW modular courses up to date&#10;Valid maritime medical fitness certificate"
              value={formData.requirementsText}
              onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as FormDataState['status'] })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Open">Open (Active & Receiving Applications)</option>
              <option value="Upcoming">Upcoming (Announced)</option>
              <option value="Closed">Closed (Draft / Intake Suspended)</option>
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-lg bg-navy-950 text-slate-300 hover:text-white border border-slate-800 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg bg-cyan-500 text-navy-950 hover:bg-cyan-400 font-semibold text-xs flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Publish Vacancy</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* EDIT OPPORTUNITY MODAL */}
      <AdminModal
        isOpen={Boolean(editingItem)}
        onClose={() => !isPending && setEditingItem(null)}
        title={`Edit Vacancy: ${editingItem?.title || ''}`}
        description="Update specifications, requirements, or publishing status."
        maxWidth="2xl"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Job Title / Rank *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Industry Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="merchant-navy">Merchant Navy</option>
                <option value="cruise-ship">Cruise Ship Lines</option>
                <option value="hospitality-wellness">Hospitality & Wellness</option>
                <option value="technical-engineering">Technical & Engineering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Department *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Vessel Type *
              </label>
              <input
                type="text"
                required
                value={formData.vesselType}
                onChange={(e) => setFormData({ ...formData, vesselType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Contract Duration *
              </label>
              <input
                type="text"
                required
                value={formData.contractDuration}
                onChange={(e) => setFormData({ ...formData, contractDuration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Location / Route *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Experience Benchmark *
              </label>
              <input
                type="text"
                required
                value={formData.experienceRequired}
                onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Credentials */}
          <div className="p-3 rounded-lg bg-navy-950 border border-slate-800">
            <span className="block text-xs font-semibold text-slate-300 mb-2">
              Mandatory Seafarer Documentation:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cdcRequired}
                  onChange={(e) => setFormData({ ...formData, cdcRequired: e.target.checked })}
                  className="rounded border-slate-700 bg-navy-900 text-cyan-500 focus:ring-0"
                />
                <span>CDC Required</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.passportRequired}
                  onChange={(e) => setFormData({ ...formData, passportRequired: e.target.checked })}
                  className="rounded border-slate-700 bg-navy-900 text-cyan-500 focus:ring-0"
                />
                <span>Passport Required</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.stcwRequired}
                  onChange={(e) => setFormData({ ...formData, stcwRequired: e.target.checked })}
                  className="rounded border-slate-700 bg-navy-900 text-cyan-500 focus:ring-0"
                />
                <span>STCW Certs Required</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Role Description & Overview *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Key Responsibilities (One per line) *
            </label>
            <textarea
              required
              rows={3}
              value={formData.responsibilitiesText}
              onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Requirements & Qualifications (One per line) *
            </label>
            <textarea
              required
              rows={3}
              value={formData.requirementsText}
              onChange={(e) => setFormData({ ...formData, requirementsText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Publishing Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as FormDataState['status'] })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Open">Open (Active & Receiving Applications)</option>
              <option value="Upcoming">Upcoming (Announced)</option>
              <option value="Closed">Closed (Draft / Intake Suspended)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-lg bg-navy-950 text-slate-300 hover:text-white border border-slate-800 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg bg-cyan-500 text-navy-950 hover:bg-cyan-400 font-semibold text-xs flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* DESTRUCTIVE ACTION CONFIRMATION MODAL */}
      <AdminModal
        isOpen={Boolean(deletingItem)}
        onClose={() => !isPending && setDeletingItem(null)}
        title="Confirm Permanent Deletion"
        description="This destructive action requires high-level administrative authorization."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">
                Delete &ldquo;{deletingItem?.title}&rdquo;?
              </p>
              <p className="text-slate-400 leading-relaxed">
                This will permanently delete this vacancy from MongoDB and the public directory. Only users with the <strong className="text-red-400">ADMIN</strong> role can execute deletions.
              </p>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs">
              {formError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setDeletingItem(null)}
              className="px-4 py-2 rounded-lg bg-navy-950 text-slate-300 hover:text-white border border-slate-800 text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleDeleteConfirm}
              className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-red-600/30"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Permanently Delete</span>
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
