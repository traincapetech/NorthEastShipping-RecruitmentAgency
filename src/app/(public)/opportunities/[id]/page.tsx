import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ApplicationForm } from '@/components/forms/ApplicationForm';
import { getOpportunityById } from '@/services/recruitment.service';
import { Ship, Clock, MapPin, ArrowLeft, CheckCircle2, ShieldCheck, FileCheck, AlertTriangle } from 'lucide-react';

type OpportunityPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: OpportunityPageProps): Promise<Metadata> {
  const { id } = await params;
  const opp = await getOpportunityById(id);
  if (!opp) return { title: 'Opportunity Not Found' };
  return {
    title: `${opp.title} (${opp.department}) | Seafaring Opportunities`,
    description: `${opp.description} Contract: ${opp.contractDuration}. Vessel: ${opp.vesselType}. Location: ${opp.location}.`
  };
}

export default async function OpportunityDetailPage({ params }: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 bg-navy-950 min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800/80 bg-navy-900/40 py-12 relative">
        <Container>
          <div className="mb-4">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all opportunities</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="cyan" size="sm">
                  {opportunity.category.replace('-', ' ').toUpperCase()}
                </Badge>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Status: {opportunity.status}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {opportunity.title}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {opportunity.department} · Reference ID: {opportunity.id.toUpperCase()}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 p-4 rounded-xl bg-navy-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Ship className="w-4 h-4 text-cyan-400" />
                <span>{opportunity.vesselType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{opportunity.contractDuration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>{opportunity.location}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Details (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Position Overview */}
            <Card className="p-6 sm:p-8 bg-navy-900/60 border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Position Overview</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {opportunity.description}
              </p>
              <div className="p-3 bg-navy-950 rounded-lg text-xs text-slate-300 border border-slate-800/80">
                <strong className="text-cyan-400">Experience Benchmark:</strong> {opportunity.experienceRequired}
              </div>
            </Card>

            {/* Key Responsibilities */}
            <Card className="p-6 sm:p-8 bg-navy-900/60 border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Operational & Shipboard Responsibilities</h3>
              <ul className="space-y-3">
                {opportunity.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Mandatory Qualifications & Documents */}
            <Card className="p-6 sm:p-8 bg-navy-900/60 border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Mandatory Documentation & Prerequisites</h3>
              <div className="flex flex-wrap gap-2 pb-2">
                {opportunity.stcwRequired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-navy-950 border border-cyan-500/30 text-xs text-cyan-300">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>STCW-2010 Mandatory</span>
                  </span>
                )}
                {opportunity.cdcRequired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-navy-950 border border-cyan-500/30 text-xs text-cyan-300">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Continuous Discharge Certificate (CDC)</span>
                  </span>
                )}
                {opportunity.passportRequired && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-navy-950 border border-cyan-500/30 text-xs text-cyan-300">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>International Passport</span>
                  </span>
                )}
              </div>
              <ul className="space-y-3">
                {opportunity.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* MLC 2006 Zero-Fee Seafarer Protection Notice */}
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>MLC 2006 Seafarer Rights & Compliance</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                In compliance with the Maritime Labour Convention (MLC 2006) Regulation 1.4, <strong>Northeast Shipping & Recruitment Agency Pvt Ltd charges ZERO recruitment or placement fees</strong> to candidates directly or indirectly. Shipowners bear all authorized crewing costs.
              </p>
            </div>

            {/* Anti-fraud advisory */}
            <div className="p-4 rounded-xl bg-navy-900/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Report any fraudulent agents soliciting money on behalf of our agency immediately to our grievance desk at <strong className="text-white">crewing@northeastshipping.com</strong>.
              </span>
            </div>
          </div>

          {/* Application Submission Form (Right 5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <ApplicationForm opportunity={opportunity} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
