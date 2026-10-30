import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { dbAdapter, checkDatabaseHealth } from '@/lib/db';
import {
  Briefcase,
  GraduationCap,
  Users,
  MessageSquare,
  PlusCircle,
  ArrowRight,
  Database,
  ExternalLink,
  Mail,
  ShieldCheck
} from 'lucide-react';

export const instant = false;

export default async function AdminDashboardPage() {
  const [
    oppsRes,
    progsRes,
    appsRes,
    trnEnqRes,
    cntEnqRes,
    dbHealth
  ] = await Promise.all([
    dbAdapter.getOpportunities({ limit: 100 }),
    dbAdapter.getTrainingPrograms({ limit: 100 }),
    dbAdapter.getApplications({ limit: 100 }),
    dbAdapter.getTrainingEnquiries({ limit: 100 }),
    dbAdapter.getContactEnquiries({ limit: 100 }),
    checkDatabaseHealth()
  ]);

  const opportunities = oppsRes.data;
  const programs = progsRes.data;
  const applications = appsRes.data;
  const trainingEnquiries = trnEnqRes.data;
  const contactEnquiries = cntEnqRes.data;

  // Real Metric Calculations
  const openOpps = opportunities.filter((o) => o.status === 'Open').length;
  const openTraining = programs.filter((p) => p.status === 'Admissions Open').length;
  const pendingApps = applications.filter(
    (a) => a.status === 'Submitted' || a.status === 'Under Review'
  ).length;
  const newAcademyEnquiries = trainingEnquiries.filter((e) => (e.status || 'New') === 'New').length;
  const unreadMessages = contactEnquiries.filter((c) => (c.status || 'New') === 'New').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Operations Dashboard
            </h1>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Synced
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time management for seafaring vacancies, offline academy admissions, and applicant pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-cyan-500 text-navy-950 hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Opportunities</span>
          </Link>
          <Link
            href="/admin/training"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-navy-900 text-cyan-300 border border-cyan-500/30 hover:bg-navy-850 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Training Catalog</span>
          </Link>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-navy-900 text-slate-200 border border-slate-700 hover:bg-navy-850 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Triage Dossiers ({applications.length})</span>
          </Link>
        </div>
      </div>

      {/* Database Active Status Banner */}
      <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white block sm:inline">Active Datastore Driver: </strong>
            <span className="font-mono text-cyan-300">{dbHealth.driver}</span>
            <span className="text-slate-400 block sm:inline sm:ml-2">
              All records persist and synchronize immediately with public visitor pages.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>RBAC Matrix Active</span>
        </div>
      </div>

      {/* Metric Counters (Direct DB Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <Link href="/admin/opportunities" className="block group">
          <Card className="p-4 bg-navy-900/70 border-slate-800 hover:border-cyan-500/50 transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Recruitment Vacancies</span>
              <div className="w-7 h-7 rounded-lg bg-navy-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{opportunities.length}</div>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                {openOpps} Open for Applications
              </p>
            </div>
          </Card>
        </Link>

        {/* Metric 2 */}
        <Link href="/admin/training" className="block group">
          <Card className="p-4 bg-navy-900/70 border-slate-800 hover:border-cyan-500/50 transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Offline Academies</span>
              <div className="w-7 h-7 rounded-lg bg-navy-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{programs.length}</div>
              <p className="text-[11px] text-cyan-400 mt-1 font-medium">
                {openTraining} Admissions Open
              </p>
            </div>
          </Card>
        </Link>

        {/* Metric 3 */}
        <Link href="/admin/applications" className="block group">
          <Card className="p-4 bg-navy-900/70 border-slate-800 hover:border-cyan-500/50 transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Candidate Intake</span>
              <div className="w-7 h-7 rounded-lg bg-navy-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{applications.length}</div>
              <p className="text-[11px] text-amber-400 mt-1 font-medium">
                {pendingApps} Pending Triage
              </p>
            </div>
          </Card>
        </Link>

        {/* Metric 4 */}
        <Link href="/admin/enquiries" className="block group">
          <Card className="p-4 bg-navy-900/70 border-slate-800 hover:border-cyan-500/50 transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Academy Inquiries</span>
              <div className="w-7 h-7 rounded-lg bg-navy-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{trainingEnquiries.length}</div>
              <p className="text-[11px] text-cyan-300 mt-1 font-medium">
                {newAcademyEnquiries} New Inquiries
              </p>
            </div>
          </Card>
        </Link>

        {/* Metric 5 */}
        <Link href="/admin/enquiries" className="block group">
          <Card className="p-4 bg-navy-900/70 border-slate-800 hover:border-cyan-500/50 transition-all h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Corporate Messages</span>
              <div className="w-7 h-7 rounded-lg bg-navy-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Mail className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{contactEnquiries.length}</div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">
                {unreadMessages} Unread / New
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Main Activity Feeds Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications Feed */}
        <Card className="p-5 bg-navy-900/60 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Recent Seafarer Applications</h3>
            </div>
            <Link
              href="/admin/applications"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Dossiers</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{app.fullName}</span>
                    <span className="text-[10px] font-mono text-cyan-400">({app.id})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {app.opportunityTitle || 'Seafaring Vacancy'} · {app.currentRank || 'Trainee'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded block">
                    {app.status || 'Submitted'}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1 block">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            ))}

            {applications.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                No applications submitted yet.
              </p>
            )}
          </div>
        </Card>

        {/* Recent Academy Inquiries Feed */}
        <Card className="p-5 bg-navy-900/60 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Recent Academy Inquiries</h3>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Inquiries</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {trainingEnquiries.slice(0, 4).map((enq) => (
              <div
                key={enq.id}
                className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{enq.fullName}</span>
                    <span className="text-[10px] font-mono text-cyan-400">({enq.id})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {enq.programTitle || 'Maritime Training'} · {enq.cityState || 'N/A'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded block">
                    {enq.status || 'New'}
                  </span>
                  <span className="text-[9px] text-slate-500 mt-1 block">
                    {enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              </div>
            ))}

            {trainingEnquiries.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                No training enquiries submitted yet.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Published Openings & Offline Catalog Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recruitment Openings */}
        <Card className="p-5 bg-navy-900/60 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Active Recruitment Listings</h3>
            </div>
            <Link
              href="/admin/opportunities"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All ({opportunities.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {opportunities.slice(0, 4).map((opp) => (
              <div
                key={opp.id}
                className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-semibold text-white">{opp.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {opp.department} · {opp.vesselType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    opp.status === 'Open'
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                      : 'text-slate-400 bg-slate-900 border-slate-700'
                  }`}>
                    {opp.status}
                  </span>
                  <Link
                    href={`/opportunities/${opp.id}`}
                    target="_blank"
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                    title="View Public Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Offline Training Catalog */}
        <Card className="p-5 bg-navy-900/60 border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Offline Training Programs</h3>
            </div>
            <Link
              href="/admin/training"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage All ({programs.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {programs.slice(0, 4).map((prog) => (
              <div
                key={prog.id}
                className="p-3 rounded-lg bg-navy-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{prog.title}</span>
                    <span className="text-[10px] font-mono text-cyan-400">({prog.code})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {prog.duration} · {prog.deliveryMode}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    prog.status === 'Admissions Open'
                      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
                      : 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30'
                  }`}>
                    {prog.status}
                  </span>
                  <Link
                    href={`/training/${prog.id}`}
                    target="_blank"
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                    title="View Public Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
