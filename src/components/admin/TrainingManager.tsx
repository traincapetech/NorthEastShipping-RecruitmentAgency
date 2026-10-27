'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { TrainingProgram } from '@/types';
import { AdminModal } from './AdminModal';
import {
  createTrainingProgramAction,
  updateTrainingProgramAction,
  deleteTrainingProgramAction
} from '@/actions/admin';
import {
  Search,
  Filter,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  GraduationCap,
  School,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface TrainingManagerProps {
  initialPrograms: TrainingProgram[];
  currentUserRole?: string;
}

type TrainingCategoryType = 'pre-sea' | 'ratings' | 'stcw-mandatory' | 'officer-cadet';

interface TrainingFormState {
  title: string;
  code: string;
  category: TrainingCategoryType;
  duration: string;
  eligibility: string;
  batchSchedule: string;
  overview: string;
  curriculumText: string;
  careerOutcome: string;
  certificationBody: string;
  status: 'Admissions Open' | 'Upcoming Batch' | 'Closed';
}

const DEFAULT_TRAINING_FORM: TrainingFormState = {
  title: '',
  code: '',
  category: 'pre-sea',
  duration: '6 Months Full-Time Residential',
  eligibility: '10th Standard with minimum 40% aggregate and 40% in English. Medically fit with 6/6 vision.',
  batchSchedule: 'Upcoming Batch: 1st of every quarter. Applications open 45 days prior.',
  overview: '',
  curriculumText: '',
  careerOutcome: 'Direct eligibility for CDC issuance and sea-service placement across international fleets.',
  certificationBody: 'Directorate General of Shipping (Govt of India) / STCW Standards',
  status: 'Admissions Open'
};

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'All Program Disciplines' },
  { value: 'pre-sea', label: 'Pre-Sea Cadet Training' },
  { value: 'ratings', label: 'General Purpose (GP) Ratings' },
  { value: 'stcw-mandatory', label: 'STCW Mandatory Certifications' },
  { value: 'officer-cadet', label: 'Officer Cadet Competency' }
];

export function TrainingManager({
  initialPrograms,
  currentUserRole: _currentUserRole = 'ADMIN'
}: TrainingManagerProps) {
  const [programs, setPrograms] = useState<TrainingProgram[]>(initialPrograms);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TrainingProgram | null>(null);
  const [deletingItem, setDeletingItem] = useState<TrainingProgram | null>(null);

  // Form State
  const [formData, setFormData] = useState<TrainingFormState>(DEFAULT_TRAINING_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const notify = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // Filtered List
  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.eligibility.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [programs, searchQuery, selectedCategory, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Open Create
  const handleOpenCreate = () => {
    setFormData(DEFAULT_TRAINING_FORM);
    setFormError(null);
    setIsCreateOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (prog: TrainingProgram) => {
    setEditingItem(prog);
    setFormData({
      title: prog.title,
      code: prog.code,
      category: prog.category,
      duration: prog.duration,
      eligibility: prog.eligibility,
      batchSchedule: prog.batchSchedule,
      overview: prog.overview,
      curriculumText: prog.curriculum.join('\n'),
      careerOutcome: prog.careerOutcome,
      certificationBody: prog.certificationBody,
      status: prog.status
    });
    setFormError(null);
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const curriculum = formData.curriculumText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (curriculum.length === 0) {
      setFormError('Please provide at least one curriculum module (one per line).');
      return;
    }

    startTransition(async () => {
      const res = await createTrainingProgramAction({
        title: formData.title.trim(),
        code: formData.code.trim().toUpperCase(),
        category: formData.category,
        duration: formData.duration.trim(),
        eligibility: formData.eligibility.trim(),
        batchSchedule: formData.batchSchedule.trim(),
        overview: formData.overview.trim(),
        curriculum,
        careerOutcome: formData.careerOutcome.trim(),
        certificationBody: formData.certificationBody.trim(),
        status: formData.status
      });

      if (!res.success) {
        setFormError(res.message || 'Failed to create training program.');
        return;
      }

      const newProg: TrainingProgram = {
        id: res.referenceId || `trn-${Date.now()}`,
        title: formData.title.trim(),
        code: formData.code.trim().toUpperCase(),
        category: formData.category,
        deliveryMode: 'Offline Campus & Maritime Simulators',
        duration: formData.duration.trim(),
        eligibility: formData.eligibility.trim(),
        batchSchedule: formData.batchSchedule.trim(),
        overview: formData.overview.trim(),
        curriculum,
        careerOutcome: formData.careerOutcome.trim(),
        certificationBody: formData.certificationBody.trim(),
        status: formData.status
      };

      setPrograms([newProg, ...programs]);
      setIsCreateOpen(false);
      notify(res.message || 'Training program published successfully!');
    });
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setFormError(null);

    const curriculum = formData.curriculumText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (curriculum.length === 0) {
      setFormError('Please provide at least one curriculum module.');
      return;
    }

    startTransition(async () => {
      const res = await updateTrainingProgramAction(editingItem.id, {
        title: formData.title.trim(),
        code: formData.code.trim().toUpperCase(),
        category: formData.category,
        duration: formData.duration.trim(),
        eligibility: formData.eligibility.trim(),
        batchSchedule: formData.batchSchedule.trim(),
        overview: formData.overview.trim(),
        curriculum,
        careerOutcome: formData.careerOutcome.trim(),
        certificationBody: formData.certificationBody.trim(),
        status: formData.status
      });

      if (!res.success) {
        setFormError(res.message || 'Failed to update training program.');
        return;
      }

      setPrograms(
        programs.map((p) =>
          p.id === editingItem.id
            ? {
                ...p,
                title: formData.title.trim(),
                code: formData.code.trim().toUpperCase(),
                category: formData.category,
                duration: formData.duration.trim(),
                eligibility: formData.eligibility.trim(),
                batchSchedule: formData.batchSchedule.trim(),
                overview: formData.overview.trim(),
                curriculum,
                careerOutcome: formData.careerOutcome.trim(),
                certificationBody: formData.certificationBody.trim(),
                status: formData.status
              }
            : p
        )
      );

      setEditingItem(null);
      notify(res.message || 'Training program updated successfully!');
    });
  };

  // Submit Delete
  const handleDeleteConfirm = () => {
    if (!deletingItem) return;

    startTransition(async () => {
      const res = await deleteTrainingProgramAction(deletingItem.id);
      if (!res.success) {
        setFormError(res.message || 'Failed to delete training program.');
        return;
      }

      setPrograms(programs.filter((p) => p.id !== deletingItem.id));
      setDeletingItem(null);
      notify(res.message || 'Program removed from academy catalog.');
    });
  };

  // Quick Status Toggle on Row
  const handleQuickStatusToggle = (prog: TrainingProgram) => {
    const nextStatus =
      prog.status === 'Admissions Open'
        ? 'Upcoming Batch'
        : prog.status === 'Upcoming Batch'
        ? 'Closed'
        : 'Admissions Open';

    startTransition(async () => {
      const res = await updateTrainingProgramAction(prog.id, { status: nextStatus });
      if (res.success) {
        setPrograms(
          programs.map((item) =>
            item.id === prog.id ? { ...item, status: nextStatus } : item
          )
        );
        notify(`Status for "${prog.code}" set to ${nextStatus}.`);
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

      {/* Strict Offline Maritime Policy Banner */}
      <div className="p-4 rounded-xl bg-navy-900 border border-cyan-500/30 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white block sm:inline">Offline Campus Policy Enforced:</strong> All pre-sea courses, rating certifications, and simulator programs are conducted strictly in-person at partner maritime academies and ship simulators. No online LMS or online payments are supported.
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-cyan-400" />
            <span>Offline Training Programs Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain curriculum, offline batch commencement schedules, and academy admissions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-lg bg-cyan-500 text-navy-950 hover:bg-cyan-400 transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Training Program</span>
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
              placeholder="Search by program title, code, overview, eligibility..."
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
              <option value="all">All Admissions Statuses</option>
              <option value="Admissions Open">Admissions Open</option>
              <option value="Upcoming Batch">Upcoming Batch</option>
              <option value="Closed">Batch Closed</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Showing <strong className="text-white">{filtered.length}</strong> of{' '}
              <strong className="text-white">{programs.length}</strong> maritime courses
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

      {/* Training Programs Data Table */}
      <div className="rounded-xl border border-slate-800 bg-navy-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Program Title & Code</th>
                <th className="py-3.5 px-4 font-semibold">Discipline</th>
                <th className="py-3.5 px-4 font-semibold">Duration & Delivery</th>
                <th className="py-3.5 px-4 font-semibold">Certification Body</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {paginated.length > 0 ? (
                paginated.map((prog) => (
                  <tr key={prog.id} className="hover:bg-navy-850/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{prog.title}</div>
                      <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                        {prog.code}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="capitalize text-slate-300">
                        {prog.category.replace(/-/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{prog.duration}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <School className="w-3 h-3 text-cyan-400" />
                        <span>{prog.deliveryMode}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate" title={prog.certificationBody}>
                      {prog.certificationBody}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleQuickStatusToggle(prog)}
                        title="Click to toggle status"
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          prog.status === 'Admissions Open'
                            ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30 hover:bg-emerald-900/60'
                            : prog.status === 'Upcoming Batch'
                            ? 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30 hover:bg-cyan-900/60'
                            : 'text-slate-400 bg-slate-900/60 border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {prog.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/training/${prog.id}`}
                          target="_blank"
                          className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-navy-800 transition-colors"
                          title="View Academy Course on Public Portal"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prog)}
                          className="p-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-navy-800 transition-colors cursor-pointer"
                          title="Edit Course Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeletingItem(prog);
                            setFormError(null);
                          }}
                          className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Permanently Delete Program"
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
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-xs">No training programs match your active filters.</p>
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

      {/* CREATE PROGRAM MODAL */}
      <AdminModal
        isOpen={isCreateOpen}
        onClose={() => !isPending && setIsCreateOpen(false)}
        title="Add Offline Maritime Training Program"
        description="Configure admission criteria, syllabus modules, and batch schedules for campus delivery."
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
                Program Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. General Purpose (GP) Rating Pre-Sea Training"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Program Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GP-RAT-01"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Discipline Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TrainingCategoryType })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="pre-sea">Pre-Sea Training</option>
                <option value="ratings">General Purpose Ratings</option>
                <option value="stcw-mandatory">STCW Mandatory Certifications</option>
                <option value="officer-cadet">Officer Cadet Competency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Course Duration *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 6 Months Full-Time Residential"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Accrediting / Certifying Body *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DG Shipping Approved / STCW '95"
                value={formData.certificationBody}
                onChange={(e) => setFormData({ ...formData, certificationBody: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Eligibility Criteria *
            </label>
            <textarea
              required
              rows={2}
              placeholder="e.g. 10th Standard with minimum 40% aggregate and 40% in English, Age between 17.5 and 25 years..."
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Batch Commencement Schedule *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Regular batches begin 1st of January & 1st of July. Limited intake."
              value={formData.batchSchedule}
              onChange={(e) => setFormData({ ...formData, batchSchedule: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Program Overview & Facilities *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Comprehensive summary of hands-on bridge and engine simulator practicals, seamanship training, workshop safety..."
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Curriculum Modules (One per line) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Muster & Lifesaving Appliances (LSA) Drills&#10;Shipboard Machinery & Engine Room Familiarization&#10;Maritime English & Standard Marine Communication Phrases (SMCP)"
              value={formData.curriculumText}
              onChange={(e) => setFormData({ ...formData, curriculumText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Career Outcome & Placement Pathway *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eligible for Continuous Discharge Certificate (CDC) and placement on Merchant Vessels."
              value={formData.careerOutcome}
              onChange={(e) => setFormData({ ...formData, careerOutcome: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Admissions Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TrainingFormState['status'] })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Admissions Open">Admissions Open</option>
              <option value="Upcoming Batch">Upcoming Batch</option>
              <option value="Closed">Batch Closed</option>
            </select>
          </div>

          {/* Actions */}
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
              <span>Add Training Program</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* EDIT PROGRAM MODAL */}
      <AdminModal
        isOpen={Boolean(editingItem)}
        onClose={() => !isPending && setEditingItem(null)}
        title={`Edit Program: ${editingItem?.code || ''} - ${editingItem?.title || ''}`}
        description="Update syllabus, batch dates, or admissions availability."
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
                Program Title *
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
                Program Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Discipline Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TrainingCategoryType })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="pre-sea">Pre-Sea Training</option>
                <option value="ratings">General Purpose Ratings</option>
                <option value="stcw-mandatory">STCW Mandatory Certifications</option>
                <option value="officer-cadet">Officer Cadet Competency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Course Duration *
              </label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Accrediting / Certifying Body *
              </label>
              <input
                type="text"
                required
                value={formData.certificationBody}
                onChange={(e) => setFormData({ ...formData, certificationBody: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Eligibility Criteria *
            </label>
            <textarea
              required
              rows={2}
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Batch Commencement Schedule *
            </label>
            <input
              type="text"
              required
              value={formData.batchSchedule}
              onChange={(e) => setFormData({ ...formData, batchSchedule: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Program Overview & Facilities *
            </label>
            <textarea
              required
              rows={3}
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Curriculum Modules (One per line) *
            </label>
            <textarea
              required
              rows={3}
              value={formData.curriculumText}
              onChange={(e) => setFormData({ ...formData, curriculumText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Career Outcome & Placement Pathway *
            </label>
            <input
              type="text"
              required
              value={formData.careerOutcome}
              onChange={(e) => setFormData({ ...formData, careerOutcome: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Admissions Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TrainingFormState['status'] })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Admissions Open">Admissions Open</option>
              <option value="Upcoming Batch">Upcoming Batch</option>
              <option value="Closed">Batch Closed</option>
            </select>
          </div>

          {/* Actions */}
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
              <span>Save Program Changes</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* DESTRUCTIVE CONFIRMATION MODAL */}
      <AdminModal
        isOpen={Boolean(deletingItem)}
        onClose={() => !isPending && setDeletingItem(null)}
        title="Confirm Program Deletion"
        description="Requires administrative privileges."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-white">
                Delete &ldquo;{deletingItem?.code} - {deletingItem?.title}&rdquo;?
              </p>
              <p className="text-slate-400 leading-relaxed">
                This will permanently delete this program from the database and public training catalog. Only users with the <strong className="text-red-400">ADMIN</strong> role can execute deletions.
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
