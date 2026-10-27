import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { getTrainingProgramById } from '@/services/training.service';
import { Clock, Calendar, ArrowLeft, CheckCircle2, School, ShieldCheck, Award, Home, AlertCircle } from 'lucide-react';

type TrainingDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: TrainingDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const program = await getTrainingProgramById(id);
  if (!program) return { title: 'Program Not Found' };
  return {
    title: `${program.title} (${program.code}) | Offline Maritime Academy`,
    description: `${program.overview} Duration: ${program.duration}. Residential offline academy training with approved simulators.`
  };
}

export default async function TrainingProgramDetailPage({ params }: TrainingDetailsProps) {
  const { id } = await params;
  const program = await getTrainingProgramById(id);

  if (!program) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 bg-navy-950 min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-800/80 bg-navy-900/40 py-12 relative">
        <Container>
          <div className="mb-4">
            <Link
              href="/training"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all training programs</span>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="ocean" size="sm">
                  {program.code}
                </Badge>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  <School className="w-3 h-3 text-cyan-400" />
                  <span>{program.deliveryMode}</span>
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {program.title}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Curriculum Standard: {program.certificationBody}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 p-4 rounded-xl bg-navy-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{program.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{program.batchSchedule}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Details (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Overview */}
            <Card className="p-6 sm:p-8 bg-navy-900/60 border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Program Overview</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {program.overview}
              </p>
              <div className="p-4 bg-navy-950 rounded-xl text-xs text-slate-300 border border-slate-800/80 space-y-1">
                <strong className="text-cyan-400 font-semibold block">Career Pathway & Industry Outcome:</strong>
                <p className="leading-relaxed">{program.careerOutcome}</p>
              </div>
            </Card>

            {/* Academic & Medical Eligibility */}
            <Card className="p-6 sm:p-8 bg-navy-900/60 border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Entry Qualifications & Medical Prerequisites</h3>
              <div className="p-4 rounded-xl bg-navy-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {program.eligibility}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-cyan-950/30 rounded-lg text-xs text-cyan-300/90 border border-cyan-500/20 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Seafarer Eye Test:</strong> 6/6 vision (with or without glasses based on department) with normal color vision required.
                  </span>
                </div>
                <div className="p-3 bg-cyan-950/30 rounded-lg text-xs text-cyan-300/90 border border-cyan-500/20 flex items-start gap-2">
                  <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Medical Fitness:</strong> Formal medical fitness test by a Directorate General of Shipping authorized physician.
                  </span>
                </div>
              </div>
            </Card>

            {/* Curriculum Breakdown */}
            <Card className="p-6 sm:p-8 bg-navy-900/60 border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Structured Practical & Theoretical Modules</h3>
              <p className="text-xs text-slate-400">
                All training components are administered in person across bridge/engine simulators, seamanship yards, and live safety tanks:
              </p>
              <ul className="space-y-3">
                {program.curriculum.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Residential Campus & Hostel Facilities */}
            <Card className="p-6 sm:p-8 bg-navy-900/60 border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Home className="w-5 h-5 text-cyan-400" />
                <span>Residential Academy Lifestyle</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                To foster authentic shipboard discipline, all pre-sea candidates reside on campus. Residential amenities include:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Hostel dormitories & laundry services</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Nutritious dining hall (mess facilities)</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Swimming pool for wet PST survival drills</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Physical training (PT), parade & sports arena</span>
                </div>
              </div>
            </Card>

            {/* Warning Banner */}
            <div className="p-4 rounded-xl bg-navy-900/40 border border-cyan-500/20 text-xs text-slate-400 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>No Course Payment Online:</strong> We do not accept course payments online. Admissions, fee structure receipts, and medical schedules are provided solely in person upon document screening.
              </span>
            </div>
          </div>

          {/* Enquiry / Admission Form (Right 5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <EnquiryForm program={program} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
