'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { JobApplicationInput, ApplicationStatus } from '@/models/validation';
import { AdminModal } from './AdminModal';
import { updateApplicationStatusAction } from '@/actions/admin';
import {
  Users,
  Search,
  Filter,
  Eye,
  Clock,
  Phone,
  Mail,
  FileText,
  Download,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Ship,
  FileCheck
} from 'lucide-react';

export type ApplicationRecord = JobApplicationInput & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

interface ApplicationsManagerProps {
  initialApplications: ApplicationRecord[];
  currentUserRole?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; desc: string }
> = {
  Submitted: {
    label: 'Submitted',
    badgeClass: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30',
    desc: 'Application freshly lodged by seafarer'
  },
  'Under Review': {
    label: 'Under Review',
    badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
    desc: 'Document verification and crewing assessment in progress'
  },
  Shortlisted: {
    label: 'Shortlisted',
    badgeClass: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30',
    desc: 'Candidate vetted and slated for vessel superintendent interview'
  },
  Selected: {
    label: 'Selected',
    badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
    desc: 'Offered vessel sign-on contract'
  },
  Rejected: {
    label: 'Rejected',
    badgeClass: 'text-rose-400 bg-rose-950/60 border-rose-500/30',
    desc: 'Does not meet current vessel rank or sea-time requirements'
  }
};

export function ApplicationsManager({
  initialApplications,
  currentUserRole: _currentUserRole = 'ADMIN'
}: ApplicationsManagerProps) {
  const [applications, setApplications] = useState<ApplicationRecord[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected for Inspection & Status Update
  const [inspectingItem, setInspectingItem] = useState<ApplicationRecord | null>(null);
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('Submitted');
  const [adminNotes, setAdminNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const notify = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // Open Inspection Modal
  const handleOpenInspect = (app: ApplicationRecord) => {
    setInspectingItem(app);
    setTargetStatus(app.status || 'Submitted');
    setAdminNotes(app.adminNotes || '');
    setFormError(null);
  };

  // Submit Status Update
  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingItem) return;

    setFormError(null);
    startTransition(async () => {
      const res = await updateApplicationStatusAction(
        inspectingItem.id,
        targetStatus,
        adminNotes.trim()
      );

      if (!res.success) {
        setFormError(res.message || 'Failed to update application status.');
        return;
      }

      setApplications(
        applications.map((app) =>
          app.id === inspectingItem.id
            ? {
                ...app,
                status: targetStatus,
                adminNotes: adminNotes.trim(),
                updatedAt: new Date().toISOString()
              }
            : app
        )
      );

      setInspectingItem(null);
      notify(`Application ${inspectingItem.id} marked as "${targetStatus}".`);
    });
  };

  // Filter List
  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.fullName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone.includes(q) ||
        (app.currentRank && app.currentRank.toLowerCase().includes(q)) ||
        (app.opportunityTitle && app.opportunityTitle.toLowerCase().includes(q)) ||
        (app.cdcNumber && app.cdcNumber.toLowerCase().includes(q)) ||
        app.id.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, selectedStatus]);

  // Counts by status
  const counts = useMemo(() => {
    const summary: Record<string, number> = {
      total: applications.length,
      Submitted: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Selected: 0,
      Rejected: 0
    };
    for (const app of applications) {
      const st = app.status || 'Submitted';
      if (summary[st] !== undefined) summary[st]++;
    }
    return summary;
  }, [applications]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
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
            <Users className="w-6 h-6 text-cyan-400" />
            <span>Candidate Applications Manifest</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review seafarer dossiers, verify CDC & passport records, and manage selection pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-800 text-slate-300 font-medium">
            Total Intake: <strong className="text-white">{applications.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-navy-900 border border-cyan-500/30 text-cyan-300 font-medium">
            Active Pipeline: <strong className="text-cyan-400">{counts.Submitted + counts['Under Review'] + counts.Shortlisted}</strong>
          </span>
        </div>
      </div>

      {/* Pipeline Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([stKey, cfg]) => {
          const isSelected = selectedStatus === stKey;
          const count = counts[stKey] || 0;
          return (
            <button
              key={stKey}
              type="button"
              onClick={() => {
                setSelectedStatus(isSelected ? 'all' : stKey);
                setCurrentPage(1);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-navy-850 border-cyan-500 ring-1 ring-cyan-500/50'
                  : 'bg-navy-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-300">{cfg.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${cfg.badgeClass}`}>
                  {count}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cfg.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by seafarer name, email, phone, rank, CDC number..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            >
              <option value="all">All Stages ({applications.length})</option>
              {Object.keys(STATUS_CONFIG).map((st) => (
                <option key={st} value={st}>
                  {st} ({counts[st] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Showing <strong className="text-white">{filtered.length}</strong> of{' '}
              <strong className="text-white">{applications.length}</strong> submitted candidate dossiers
            </span>
          </div>

          {(searchQuery || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
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

      {/* Applications Data Table */}
      <div className="rounded-xl border border-slate-800 bg-navy-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Candidate Dossier</th>
                <th className="py-3.5 px-4 font-semibold">Target Opening</th>
                <th className="py-3.5 px-4 font-semibold">Rank & Sea Time</th>
                <th className="py-3.5 px-4 font-semibold">Credentials</th>
                <th className="py-3.5 px-4 font-semibold">Triage Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {paginated.length > 0 ? (
                paginated.map((app) => {
                  const cfg = STATUS_CONFIG[app.status || 'Submitted'] || STATUS_CONFIG.Submitted;
                  return (
                    <tr key={app.id} className="hover:bg-navy-850/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{app.fullName}</div>
                        <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                          {app.id}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">
                          {app.opportunityTitle || app.opportunityId}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">
                          {app.email}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-white">{app.currentRank || 'Not specified'}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Sea Time: {app.totalSeaTime || 'Fresher'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px]">
                          {app.cdcNumber ? (
                            <div className="text-slate-300">
                              <span className="text-slate-500">CDC:</span> {app.cdcNumber}
                            </div>
                          ) : (
                            <div className="text-slate-500 italic">No CDC</div>
                          )}
                          {app.passportNumber && (
                            <div className="text-slate-400">
                              <span className="text-slate-500">Pass:</span> {app.passportNumber}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded border ${cfg.badgeClass}`}>
                          {app.status || 'Submitted'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenInspect(app)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-medium transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Dossier</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-xs">No candidate applications match your active search or filters.</p>
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

      {/* INSPECT DOSSIER MODAL */}
      <AdminModal
        isOpen={Boolean(inspectingItem)}
        onClose={() => !isPending && setInspectingItem(null)}
        title={`Candidate Dossier: ${inspectingItem?.fullName || ''}`}
        description={`Application Manifest ID: ${inspectingItem?.id || ''}`}
        maxWidth="2xl"
      >
        {inspectingItem && (
          <div className="space-y-5">
            {/* Candidate Summary Box */}
            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{inspectingItem.fullName}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {inspectingItem.id}
                    </span>
                  </h4>
                  <p className="text-xs text-cyan-300 font-medium mt-0.5">
                    Target Vacancy: {inspectingItem.opportunityTitle || inspectingItem.opportunityId}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {inspectingItem.createdAt
                      ? new Date(inspectingItem.createdAt).toLocaleString()
                      : 'Recently Submitted'}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={`mailto:${inspectingItem.email}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors p-2 rounded bg-navy-900/60 border border-slate-800"
                >
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{inspectingItem.email}</span>
                </a>
                <a
                  href={`tel:${inspectingItem.phone}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors p-2 rounded bg-navy-900/60 border border-slate-800"
                >
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{inspectingItem.phone}</span>
                </a>
              </div>
            </div>

            {/* Maritime Sea-Service Credentials */}
            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span>Maritime Qualifications & Sea Experience</span>
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Current Rank
                  </span>
                  <span className="text-white font-medium">
                    {inspectingItem.currentRank || 'Fresher / Trainee'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Total Sea Time
                  </span>
                  <span className="text-white font-medium">
                    {inspectingItem.totalSeaTime || 'None Recorded'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    CDC Number
                  </span>
                  <span className="text-white font-mono">
                    {inspectingItem.cdcNumber || 'N/A'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Passport
                  </span>
                  <span className="text-white font-mono">
                    {inspectingItem.passportNumber || 'N/A'}
                  </span>
                </div>
              </div>

              {inspectingItem.vesselExperience && (
                <div className="pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Vessels / Fleet Experience
                  </span>
                  <p className="text-slate-300 mt-0.5">{inspectingItem.vesselExperience}</p>
                </div>
              )}

              {inspectingItem.additionalNotes && (
                <div className="pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Candidate Statement / Notes
                  </span>
                  <p className="text-slate-300 italic mt-0.5">&ldquo;{inspectingItem.additionalNotes}&rdquo;</p>
                </div>
              )}

              {/* Resume / Document Download if Document ID is present */}
              {inspectingItem.documentAttachmentId && (
                <div className="pt-2 border-t border-slate-800/80">
                  <a
                    href={`/api/documents/${inspectingItem.documentAttachmentId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/60 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Attached Seafarer Document ({inspectingItem.documentAttachmentId})</span>
                  </a>
                </div>
              )}
            </div>

            {/* Recruiter Assessment & Status Triage Form */}
            <form onSubmit={handleStatusUpdate} className="p-4 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-4">
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span>Recruiter Assessment & Pipeline Status</span>
              </h5>

              {formError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Change Candidacy Pipeline Status *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(STATUS_CONFIG).map((st) => {
                    const isSelected = targetStatus === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setTargetStatus(st as ApplicationStatus)}
                        className={`p-2 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500 font-bold'
                            : 'bg-navy-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Recruiter / Crewing Officer Assessment Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Record verification notes, passport expiry check, superintendent remarks, interview feedback..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setInspectingItem(null)}
                  className="px-4 py-2 rounded-lg bg-navy-900 text-slate-300 hover:text-white border border-slate-800 text-xs"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-cyan-500 text-navy-950 hover:bg-cyan-400 font-semibold text-xs flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Status & Audit Notes</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
