import React from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, FileCheck2, Scale, Building2, AlertTriangle, PhoneCall } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="py-20 bg-navy-900/50 border-y border-slate-800/80 relative overflow-hidden">
      {/* Background nautical pattern */}
      <div className="absolute inset-0 maritime-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
            Verification & Compliance Standards
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Statutory Trust & Seafarer Protection
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Operating strictly within international maritime conventions and domestic statutory guidelines. We uphold complete transparency across all recruitment and training pathways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
          <Card className="card-3d-tilt p-6 border-slate-800 bg-navy-950/85">
            <div className="w-11 h-11 rounded-xl bg-navy-850 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Registered Entity</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Northeast Shipping & Recruitment Agency Pvt. Ltd., registered with official headquarters in Ukhrul, Manipur.
            </p>
            <div className="text-[10px] font-mono text-cyan-400">
              STATE: MANIPUR · PIN: 795142
            </div>
          </Card>

          <Card className="card-3d-tilt p-6 border-slate-800 bg-navy-950/85">
            <div className="w-11 h-11 rounded-xl bg-navy-850 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">STCW 2010 Guidelines</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              All candidates undergo rigorous verification adhering to the International Convention on Standards of Training, Certification and Watchkeeping.
            </p>
            <div className="text-[10px] font-mono text-cyan-400">
              MANILA AMENDMENTS COMPLIANT
            </div>
          </Card>

          <Card className="card-3d-tilt p-6 border-slate-800 bg-navy-950/85">
            <div className="w-11 h-11 rounded-xl bg-navy-850 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">MLC 2006 Standards</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Strict adherence to Maritime Labour Convention safeguards: transparent contracts, medical security, and zero fee exploitation.
            </p>
            <div className="text-[10px] font-mono text-cyan-400">
              SEAFARER BILL OF RIGHTS
            </div>
          </Card>

          <Card className="card-3d-tilt p-6 border-slate-800 bg-navy-950/85">
            <div className="w-11 h-11 rounded-xl bg-navy-850 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Offline Academy Rigor</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              We exclusively facilitate admissions to recognized physical maritime academies with certified marine simulators and approved workshops.
            </p>
            <div className="text-[10px] font-mono text-cyan-400">
              PHYSICAL CAMPUS SIMULATORS
            </div>
          </Card>
        </div>

        {/* Official Anti-Fraud / Seafarer Cautionary Notice */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-amber-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                <strong className="text-white font-bold block mb-1">
                  Official Anti-Fraud & Seafarer Cautionary Advisory:
                </strong>
                Northeast Shipping & Recruitment Agency Pvt. Ltd. does not charge unauthorized placement fees for job allotments or demand payments into personal accounts. Always verify opportunities and correspondence via our verified official desk line: <strong className="text-cyan-300 font-mono">+91 93833 20200</strong>.
              </div>
            </div>

            <a
              href="tel:9383320200"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/25 transition-colors shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Verify at 9383320200</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
