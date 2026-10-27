import React from 'react';
import { Button } from '@/components/ui/Button';
import { Compass, GraduationCap, Mail, Phone, ArrowRight } from 'lucide-react';

export function ContactCTA() {
  return (
    <section className="py-20 bg-gradient-to-b from-navy-900/60 to-navy-950 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background visual flair */}
      <div className="absolute inset-0 maritime-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-850 p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                <Compass className="w-3.5 h-3.5" />
                <span>Begin Your Journey Today</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Ready to Chart Your Course in the Maritime Industry?
              </h2>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Connect with our recruitment advisors for commercial fleet openings, passenger cruise careers, or offline academy admissions.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>contact@northeastshipping.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <a href="tel:9383320200" className="hover:text-cyan-300 transition-colors">
                    +91 93833 20200
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3.5">
              <Button
                href="/opportunities"
                variant="cyan"
                size="lg"
                className="w-full justify-between"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Active Openings
              </Button>
              <Button
                href="/contact?type=training"
                variant="secondary"
                size="lg"
                className="w-full justify-between border-cyan-500/30"
                icon={<GraduationCap className="w-4 h-4 text-cyan-400" />}
              >
                Offline Training Enquiries
              </Button>
              <p className="text-center text-[11px] text-slate-400">
                Dedicated recruitment desk: Monday – Saturday (IST)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
