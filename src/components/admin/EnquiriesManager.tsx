'use client';

import React, { useState, useTransition, useMemo } from 'react';
import { TrainingEnquiryInput, ContactEnquiryInput, EnquiryStatus } from '@/models/validation';
import { AdminModal } from './AdminModal';
import {
  updateTrainingEnquiryStatusAction,
  updateContactEnquiryStatusAction
} from '@/actions/admin';
import {
  GraduationCap,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Building2
} from 'lucide-react';

export type TrainingEnquiryRecord = TrainingEnquiryInput & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ContactEnquiryRecord = ContactEnquiryInput & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

interface EnquiriesManagerProps {
  initialTrainingEnquiries: TrainingEnquiryRecord[];
  initialContactEnquiries: ContactEnquiryRecord[];
  currentUserRole?: string;
}

const TRAINING_STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; desc: string }
> = {
  New: {
    label: 'New Inquiry',
    badgeClass: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30',
    desc: 'Uncontacted inquiry from website form'
  },
  Contacted: {
    label: 'Contacted',
    badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-500/30',
    desc: 'Counselor reached candidate via phone/email'
  },
  'Interview Scheduled': {
    label: 'Interview Scheduled',
    badgeClass: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/30',
    desc: 'In-person offline campus verification booked'
  },
  Enrolled: {
    label: 'Enrolled',
    badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30',
    desc: 'Candidate admitted to academy offline batch'
  },
  Closed: {
    label: 'Closed',
    badgeClass: 'text-slate-400 bg-slate-900/60 border-slate-700',
    desc: 'Did not meet medical/eligibility or dropped'
  }
};

const CONTACT_STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string }
> = {
  New: {
    label: 'New Message',
    badgeClass: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30'
  },
  'In Progress': {
    label: 'In Progress',
    badgeClass: 'text-amber-400 bg-amber-950/60 border-amber-500/30'
  },
  Resolved: {
    label: 'Resolved',
    badgeClass: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
  }
};

export function EnquiriesManager({
  initialTrainingEnquiries,
  initialContactEnquiries,
  currentUserRole: _currentUserRole = 'ADMIN'
}: EnquiriesManagerProps) {
  const [activeTab, setActiveTab] = useState<'training' | 'contact'>('training');

  // Training Enquiries State
  const [trainingEnquiries, setTrainingEnquiries] = useState<TrainingEnquiryRecord[]>(initialTrainingEnquiries);
  const [trainingSearch, setTrainingSearch] = useState('');
  const [trainingStatusFilter, setTrainingStatusFilter] = useState('all');
  const [trainingPage, setTrainingPage] = useState(1);
  const [inspectingTraining, setInspectingTraining] = useState<TrainingEnquiryRecord | null>(null);
  const [targetTrainingStatus, setTargetTrainingStatus] = useState<EnquiryStatus>('New');
  const [counselorNotes, setCounselorNotes] = useState('');

  // Contact Enquiries State
  const [contactEnquiries, setContactEnquiries] = useState<ContactEnquiryRecord[]>(initialContactEnquiries);
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState('all');
  const [contactPage, setContactPage] = useState(1);
  const [inspectingContact, setInspectingContact] = useState<ContactEnquiryRecord | null>(null);
  const [targetContactStatus, setTargetContactStatus] = useState<'New' | 'In Progress' | 'Resolved'>('New');

  // Shared Action State
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const itemsPerPage = 8;

  const notify = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // Filter Training Enquiries
  const filteredTraining = useMemo(() => {
    return trainingEnquiries.filter((enq) => {
      const q = trainingSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        enq.fullName.toLowerCase().includes(q) ||
        enq.email.toLowerCase().includes(q) ||
        enq.phone.includes(q) ||
        (enq.programTitle && enq.programTitle.toLowerCase().includes(q)) ||
        (enq.cityState && enq.cityState.toLowerCase().includes(q)) ||
        enq.id.toLowerCase().includes(q);

      const matchesStatus = trainingStatusFilter === 'all' || enq.status === trainingStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [trainingEnquiries, trainingSearch, trainingStatusFilter]);

  // Filter Contact Enquiries
  const filteredContact = useMemo(() => {
    return contactEnquiries.filter((msg) => {
      const q = contactSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        msg.name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.phone.includes(q) ||
        (msg.enquiryType && msg.enquiryType.toLowerCase().includes(q)) ||
        msg.message.toLowerCase().includes(q) ||
        msg.id.toLowerCase().includes(q);

      const matchesStatus = contactStatusFilter === 'all' || msg.status === contactStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contactEnquiries, contactSearch, contactStatusFilter]);

  // Open Training Inspect
  const handleOpenTrainingInspect = (enq: TrainingEnquiryRecord) => {
    setInspectingTraining(enq);
    setTargetTrainingStatus(enq.status || 'New');
    setCounselorNotes(enq.counselorNotes || '');
    setFormError(null);
  };

  // Submit Training Status
  const handleTrainingStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingTraining) return;

    setFormError(null);
    startTransition(async () => {
      const res = await updateTrainingEnquiryStatusAction(
        inspectingTraining.id,
        targetTrainingStatus,
        counselorNotes.trim()
      );

      if (!res.success) {
        setFormError(res.message || 'Failed to update enquiry status.');
        return;
      }

      setTrainingEnquiries(
        trainingEnquiries.map((enq) =>
          enq.id === inspectingTraining.id
            ? {
                ...enq,
                status: targetTrainingStatus,
                counselorNotes: counselorNotes.trim(),
                updatedAt: new Date().toISOString()
              }
            : enq
        )
      );

      setInspectingTraining(null);
      notify(`Academy inquiry ${inspectingTraining.id} updated to "${targetTrainingStatus}".`);
    });
  };

  // Open Contact Inspect
  const handleOpenContactInspect = (msg: ContactEnquiryRecord) => {
    setInspectingContact(msg);
    setTargetContactStatus(msg.status || 'New');
    setFormError(null);
  };

  // Submit Contact Status
  const handleContactStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectingContact) return;

    setFormError(null);
    startTransition(async () => {
      const res = await updateContactEnquiryStatusAction(
        inspectingContact.id,
        targetContactStatus
      );

      if (!res.success) {
        setFormError(res.message || 'Failed to update contact enquiry status.');
        return;
      }

      setContactEnquiries(
        contactEnquiries.map((msg) =>
          msg.id === inspectingContact.id
            ? {
                ...msg,
                status: targetContactStatus,
                updatedAt: new Date().toISOString()
              }
            : msg
        )
      );

      setInspectingContact(null);
      notify(`Contact message ${inspectingContact.id} updated to "${targetContactStatus}".`);
    });
  };

  // Pagination calculations
  const trainingTotalPages = Math.ceil(filteredTraining.length / itemsPerPage) || 1;
  const paginatedTraining = useMemo(() => {
    const start = (trainingPage - 1) * itemsPerPage;
    return filteredTraining.slice(start, start + itemsPerPage);
  }, [filteredTraining, trainingPage]);

  const contactTotalPages = Math.ceil(filteredContact.length / itemsPerPage) || 1;
  const paginatedContact = useMemo(() => {
    const start = (contactPage - 1) * itemsPerPage;
    return filteredContact.slice(start, start + itemsPerPage);
  }, [filteredContact, contactPage]);

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
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <span>Inquiries & Corporate Messages</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage prospective cadet counseling, academy admissions intake, and business inquiries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-navy-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'training'
                ? 'bg-cyan-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academy Admissions ({trainingEnquiries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-cyan-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Contact ({contactEnquiries.length})</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: ACADEMY ADMISSIONS INQUIRIES                 */}
      {/* ==================================================== */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          {/* Status Metric Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(TRAINING_STATUS_CONFIG).map(([stKey, cfg]) => {
              const isSelected = trainingStatusFilter === stKey;
              const count = trainingEnquiries.filter((e) => (e.status || 'New') === stKey).length;
              return (
                <button
                  key={stKey}
                  type="button"
                  onClick={() => {
                    setTrainingStatusFilter(isSelected ? 'all' : stKey);
                    setTrainingPage(1);
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

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by cadet name, phone, email, qualification, city..."
                  value={trainingSearch}
                  onChange={(e) => {
                    setTrainingSearch(e.target.value);
                    setTrainingPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="relative">
                <select
                  value={trainingStatusFilter}
                  onChange={(e) => {
                    setTrainingStatusFilter(e.target.value);
                    setTrainingPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="all">All Admissions Stages</option>
                  {Object.keys(TRAINING_STATUS_CONFIG).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  Showing <strong className="text-white">{filteredTraining.length}</strong> of{' '}
                  <strong className="text-white">{trainingEnquiries.length}</strong> inquiries
                </span>
              </div>
              {(trainingSearch || trainingStatusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setTrainingSearch('');
                    setTrainingStatusFilter('all');
                    setTrainingPage(1);
                  }}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-800 bg-navy-900/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Prospective Cadet</th>
                    <th className="py-3.5 px-4 font-semibold">Target Training Course</th>
                    <th className="py-3.5 px-4 font-semibold">Background</th>
                    <th className="py-3.5 px-4 font-semibold">Location</th>
                    <th className="py-3.5 px-4 font-semibold">Counseling Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {paginatedTraining.length > 0 ? (
                    paginatedTraining.map((enq) => {
                      const cfg = TRAINING_STATUS_CONFIG[enq.status || 'New'] || TRAINING_STATUS_CONFIG.New;
                      return (
                        <tr key={enq.id} className="hover:bg-navy-850/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{enq.fullName}</div>
                            <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{enq.id}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'Recent'}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-200 font-medium">
                              {enq.programTitle || 'General Academy Inquiry'}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">
                              {enq.email}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-white">{enq.highestQualification}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Age: {enq.age} yrs</div>
                          </td>

                          <td className="py-3.5 px-4 text-slate-300">
                            {enq.cityState || 'Not Specified'}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded border ${cfg.badgeClass}`}>
                              {enq.status || 'New'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenTrainingInspect(enq)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-medium transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Counseling Dossier</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="text-xs">No admissions inquiries match your active filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {trainingTotalPages > 1 && (
              <div className="p-3 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Page <strong className="text-white">{trainingPage}</strong> of{' '}
                  <strong className="text-white">{trainingTotalPages}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTrainingPage((p) => Math.max(1, p - 1))}
                    disabled={trainingPage === 1}
                    className="p-1.5 rounded bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-850"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTrainingPage((p) => Math.min(trainingTotalPages, p + 1))}
                    disabled={trainingPage === trainingTotalPages}
                    className="p-1.5 rounded bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-850"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: GENERAL & CORPORATE CONTACT INQUIRIES         */}
      {/* ==================================================== */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Status Metric Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Object.entries(CONTACT_STATUS_CONFIG).map(([stKey, cfg]) => {
              const isSelected = contactStatusFilter === stKey;
              const count = contactEnquiries.filter((c) => (c.status || 'New') === stKey).length;
              return (
                <button
                  key={stKey}
                  type="button"
                  onClick={() => {
                    setContactStatusFilter(isSelected ? 'all' : stKey);
                    setContactPage(1);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-navy-850 border-cyan-500 ring-1 ring-cyan-500/50'
                      : 'bg-navy-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">{cfg.label}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${cfg.badgeClass}`}>
                      {count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by sender name, email, phone, corporate topic..."
                  value={contactSearch}
                  onChange={(e) => {
                    setContactSearch(e.target.value);
                    setContactPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="relative">
                <select
                  value={contactStatusFilter}
                  onChange={(e) => {
                    setContactStatusFilter(e.target.value);
                    setContactPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="all">All Message Statuses</option>
                  <option value="New">Status: New</option>
                  <option value="In Progress">Status: In Progress</option>
                  <option value="Resolved">Status: Resolved</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  Showing <strong className="text-white">{filteredContact.length}</strong> of{' '}
                  <strong className="text-white">{contactEnquiries.length}</strong> messages
                </span>
              </div>
              {(contactSearch || contactStatusFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setContactSearch('');
                    setContactStatusFilter('all');
                    setContactPage(1);
                  }}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Contact Table */}
          <div className="rounded-xl border border-slate-800 bg-navy-900/60 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Sender Details</th>
                    <th className="py-3.5 px-4 font-semibold">Inquiry Type</th>
                    <th className="py-3.5 px-4 font-semibold">Message Preview</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {paginatedContact.length > 0 ? (
                    paginatedContact.map((msg) => {
                      const cfg = CONTACT_STATUS_CONFIG[msg.status || 'New'] || CONTACT_STATUS_CONFIG.New;
                      return (
                        <tr key={msg.id} className="hover:bg-navy-850/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{msg.name}</div>
                            <div className="text-[11px] font-mono text-cyan-400 mt-0.5">{msg.id}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Recent'}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-200">
                              {msg.enquiryType || 'General Inquiries'}
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                              {msg.email}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-[280px]">
                            <p className="text-slate-300 truncate">{msg.message}</p>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded border ${cfg.badgeClass}`}>
                              {msg.status || 'New'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenContactInspect(msg)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-cyan-950 text-cyan-300 hover:text-cyan-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-medium transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Message</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="text-xs">No contact messages match your active filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {contactTotalPages > 1 && (
              <div className="p-3 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Page <strong className="text-white">{contactPage}</strong> of{' '}
                  <strong className="text-white">{contactTotalPages}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setContactPage((p) => Math.max(1, p - 1))}
                    disabled={contactPage === 1}
                    className="p-1.5 rounded bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-850"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactPage((p) => Math.min(contactTotalPages, p + 1))}
                    disabled={contactPage === contactTotalPages}
                    className="p-1.5 rounded bg-navy-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-850"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECT TRAINING ENQUIRY MODAL */}
      <AdminModal
        isOpen={Boolean(inspectingTraining)}
        onClose={() => !isPending && setInspectingTraining(null)}
        title={`Admissions Inquiry: ${inspectingTraining?.fullName || ''}`}
        description={`Inquiry Ref ID: ${inspectingTraining?.id || ''}`}
        maxWidth="2xl"
      >
        {inspectingTraining && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{inspectingTraining.fullName}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {inspectingTraining.id}
                    </span>
                  </h4>
                  <p className="text-xs text-cyan-300 font-medium mt-0.5">
                    Course: {inspectingTraining.programTitle || 'General Academy Inquiry'}
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {inspectingTraining.createdAt
                      ? new Date(inspectingTraining.createdAt).toLocaleString()
                      : 'Recent'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={`mailto:${inspectingTraining.email}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors p-2 rounded bg-navy-900/60 border border-slate-800"
                >
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{inspectingTraining.email}</span>
                </a>
                <a
                  href={`tel:${inspectingTraining.phone}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors p-2 rounded bg-navy-900/60 border border-slate-800"
                >
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{inspectingTraining.phone}</span>
                </a>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Qualification</span>
                  <span className="text-white font-medium">{inspectingTraining.highestQualification}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Age</span>
                  <span className="text-white font-medium">{inspectingTraining.age} Years</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">City / State</span>
                  <span className="text-white font-medium">{inspectingTraining.cityState || 'N/A'}</span>
                </div>
              </div>

              {inspectingTraining.message && (
                <div className="pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Cadet Inquiry Note</span>
                  <p className="text-slate-300 italic mt-0.5">&ldquo;{inspectingTraining.message}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Counselor Triage Form */}
            <form onSubmit={handleTrainingStatusSubmit} className="p-4 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-4">
              <h5 className="text-xs font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Admissions Counseling Status & Verification Notes</span>
              </h5>

              {formError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Admissions Status *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(TRAINING_STATUS_CONFIG).map((st) => {
                    const isSelected = targetTrainingStatus === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setTargetTrainingStatus(st as EnquiryStatus)}
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
                  Counselor Notes & Offline Batch Appointment
                </label>
                <textarea
                  rows={3}
                  placeholder="Record phone counseling date, candidate eligibility check, campus visit schedule, fee structure communicated..."
                  value={counselorNotes}
                  onChange={(e) => setCounselorNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setInspectingTraining(null)}
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
                  <span>Save Counseling Status</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </AdminModal>

      {/* INSPECT CONTACT MESSAGE MODAL */}
      <AdminModal
        isOpen={Boolean(inspectingContact)}
        onClose={() => !isPending && setInspectingContact(null)}
        title={`Message from ${inspectingContact?.name || ''}`}
        description={`Inquiry Ref: ${inspectingContact?.id || ''}`}
        maxWidth="lg"
      >
        {inspectingContact && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{inspectingContact.name}</h4>
                  <p className="text-xs text-cyan-300 mt-0.5">{inspectingContact.enquiryType || 'General Inquiries'}</p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {inspectingContact.createdAt ? new Date(inspectingContact.createdAt).toLocaleString() : 'Recent'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <a href={`mailto:${inspectingContact.email}`} className="text-cyan-400 hover:underline">
                    {inspectingContact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <a href={`tel:${inspectingContact.phone}`} className="text-slate-300 hover:text-white">
                    {inspectingContact.phone}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">Message Body</span>
                <p className="text-slate-200 leading-relaxed bg-navy-900/60 p-3 rounded-lg border border-slate-800">
                  {inspectingContact.message}
                </p>
              </div>
            </div>

            <form onSubmit={handleContactStatusSubmit} className="space-y-3">
              {formError && (
                <div className="p-3 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Message Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['New', 'In Progress', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTargetContactStatus(st as 'New' | 'In Progress' | 'Resolved')}
                      className={`p-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                        targetContactStatus === st
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500 font-bold'
                          : 'bg-navy-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setInspectingContact(null)}
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
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
