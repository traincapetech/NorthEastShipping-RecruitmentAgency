import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Compass, Anchor, ShieldCheck, Target, ArrowRight } from 'lucide-react';

export function AboutOverview() {
  return (
    <section className="py-20 bg-navy-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>About Our Agency</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Bridging Regional Talent with Global Seafaring Fleets
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Northeast Shipping & Recruitment Agency Pvt Ltd was established to facilitate structured, professional maritime pathways for aspiring and experienced marine personnel. We connect certified seafarers with commercial cargo lines and premier international cruise operators.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              In addition to seafarer recruitment across deck, engine, and hotel hospitality divisions, we facilitate guidance and offline enrollment into accredited pre-sea cadetship academies and STCW modular safety institutions. Our operations emphasize regulatory integrity, transparent evaluation, and seafarer welfare.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800 flex items-start gap-3">
                <Anchor className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Fleet Diversity</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Placements spanning bulk carriers, container ships, ocean tankers, and passenger cruise liners.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Full Regulatory Adherence</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Strict adherence to DG Shipping regulatory standards, IMO conventions, and MLC guidelines.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button href="/about" variant="secondary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                Read More About Us
              </Button>
            </div>
          </div>

          {/* Right Column: Corporate Principles Card */}
          <div className="lg:col-span-5">
            <Card glow className="p-8 border-cyan-500/20 bg-navy-900/90 relative">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Core Operating Principles</h3>
              </div>

              <div className="space-y-5">
                <div className="border-l-2 border-cyan-400 pl-4">
                  <h5 className="text-sm font-semibold text-white">Ethical Seafarer Sourcing</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Transparent candidate evaluation with zero tolerance for misleading promises or unverified claims.
                  </p>
                </div>

                <div className="border-l-2 border-ocean-500 pl-4">
                  <h5 className="text-sm font-semibold text-white">Comprehensive Offline Rigor</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Recognizing that genuine seamanship and firefighting competencies cannot be substituted with digital classes.
                  </p>
                </div>

                <div className="border-l-2 border-slate-600 pl-4">
                  <h5 className="text-sm font-semibold text-white">Documentation Integrity</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Complete verification of INDoS, CDC, STCW certificates, and DG medical certifications prior to nomination.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                  <span className="text-cyan-300 font-semibold italic">“Navigating Trust. Delivering Excellence.”</span>
                  <span className="font-mono text-cyan-400 font-medium">Pvt Ltd Registered Entity</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Headquarters: Opp. UBC Phungreitang East, Ukhrul, Manipur – 795142
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
