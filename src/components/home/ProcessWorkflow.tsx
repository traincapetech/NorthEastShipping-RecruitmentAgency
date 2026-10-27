import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileCheck, Stethoscope, UserCheck, PlaneTakeoff, ShieldAlert } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Application & Dossier Review',
    subtitle: 'Documentation Intake',
    description: 'Candidate submits application with verified passport, CDC, STCW certificates, and documented sea-time records.',
    icon: FileCheck
  },
  {
    step: '02',
    title: 'Medical & Credential Screening',
    subtitle: 'Maritime Fitness',
    description: 'Physical fitness assessment with DG-approved medical examiners, eyesight/color vision verification, and certificate authenticity audits.',
    icon: Stethoscope
  },
  {
    step: '03',
    title: 'Technical Evaluation & Interview',
    subtitle: 'Principal Assessment',
    description: 'Technical interviews with master mariners / chief engineers and shipowner representative evaluations for specific vessel types.',
    icon: UserCheck
  },
  {
    step: '04',
    title: 'Articles of Agreement & Embarkation',
    subtitle: 'Sign-On & Flight Dispatch',
    description: 'Execution of compliant maritime employment agreements, flag-state endorsements, transit visas, and port embarkation dispatch.',
    icon: PlaneTakeoff
  }
];

export function ProcessWorkflow() {
  return (
    <section className="py-20 bg-navy-900/60 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
            Application Pipeline
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How Recruitment Applications Work
          </h2>
          <p className="mt-3 text-base text-slate-400">
            A transparent, merit-based selection protocol ensuring complete compliance with international maritime labor standards and shipowner criteria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative perspective-container">
          {STEPS.map((s, index) => {
            const Icon = s.icon;
            return (
              <Card key={s.step} hoverEffect className="card-3d-tilt relative p-6 flex flex-col justify-between bg-navy-950/80 border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-mono text-cyan-400/40">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-navy-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-wide">
                    {s.subtitle}
                  </p>
                  <h3 className="text-base font-bold text-white mt-1 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Step {index + 1} of 4</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Ethical recruitment banner */}
        <div className="mt-12 p-4 rounded-xl bg-navy-950 border border-slate-800 flex items-center gap-3 max-w-3xl mx-auto">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-xs text-slate-400">
            <strong className="text-slate-200">Zero Fee Exploitation Policy:</strong> Under Maritime Labour Convention (MLC 2006) standards, seafarers are never charged unauthorized recruitment placement fees. All selections are strictly merit and credential-based.
          </p>
        </div>
      </div>
    </section>
  );
}
