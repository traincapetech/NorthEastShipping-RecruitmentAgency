import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Ship, Waves, Sparkles, Cpu, ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'merchant-navy',
    title: 'Merchant Navy',
    subtitle: 'Commercial Cargo & Tanker Fleets',
    description: 'Career positions for Deck Officers, Marine Engineers, and Seamanship Ratings across dry cargo, container ships, and ocean tankers.',
    icon: Ship,
    accent: 'cyan',
    highlights: ['Deck Officers & Cadets', 'Marine Engine Crew', 'General Purpose Ratings', 'Tanker Safety Protocols']
  },
  {
    id: 'cruise-ship',
    title: 'Cruise Ship Fleets',
    subtitle: 'International Passenger Liners',
    description: 'Employment opportunities aboard premier international passenger liners delivering exceptional guest experience across worldwide itineraries.',
    icon: Waves,
    accent: 'ocean',
    highlights: ['Hotel Operations & Reception', 'Food & Beverage Staff', 'Guest Relations & Concierge', 'Shipboard Public Health (USPH)']
  },
  {
    id: 'hospitality-wellness',
    title: 'Hospitality & Wellness',
    subtitle: 'Luxury Ocean Spa Services',
    description: 'Specialized roles for certified spa therapists, wellness practitioners, and culinary specialists seeking international ocean-going careers.',
    icon: Sparkles,
    accent: 'cyan',
    highlights: ['Certified Spa Therapists', 'Aesthetic & Beauty Specialists', 'Executive Culinary Crew', 'Wellness Consultants']
  },
  {
    id: 'technical-engineering',
    title: 'Marine Technical',
    subtitle: 'Instrumentation & Power Systems',
    description: 'Specialized roles for marine electrical officers, automation technicians, and refrigeration specialists operating modern shipboard plants.',
    icon: Cpu,
    accent: 'ocean',
    highlights: ['Electro-Technical Officers (ETO)', 'Automation & PLC Systems', 'Refrigeration Engineers', 'High-Voltage Switchboards']
  }
];

export function CareerCategories() {
  return (
    <section className="py-20 bg-navy-900/40 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-2">
            Career Pathways
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Comprehensive Maritime & Cruise Sectors
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Connecting aspiring and certified seafarers with structured pathways across commercial navigation, hospitality, and specialized marine technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.id}
                hoverEffect
                className="card-3d-tilt flex flex-col justify-between group p-6 bg-navy-900/70 border-slate-800"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-navy-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <p className="text-[11px] font-mono text-cyan-400/90 tracking-wide uppercase">
                    {cat.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-white mt-1 mb-2 group-hover:text-cyan-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  <div className="space-y-2 border-t border-slate-800/80 pt-4">
                    {cat.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/60">
                  <Link
                    href={`/opportunities?category=${cat.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
                  >
                    <span>Explore {cat.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
