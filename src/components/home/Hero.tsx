'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Compass,
  Ship,
  GraduationCap,
  ChevronRight,
  Anchor,
  Waves,
  ShieldCheck,
  Radio,
  Navigation
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  videoUrl?: string; // Configurable video support for future video reel asset
}

export function Hero({ videoUrl }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-navy-950 pt-24 pb-16">
      {/* Background Media Layer */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src="/images/maritime-hero.jpg"
            alt="Commercial fleet and cruise liner sailing in deep ocean waters at twilight"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-45 scale-105 transform motion-safe:animate-pulse [animation-duration:12s]"
          />
        )}

        {/* Cinematic Ocean Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/75 to-navy-950/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/25 via-transparent to-navy-950/90" />
      </div>

      {/* Maritime Tactical Grid Overlay */}
      <div className="absolute inset-0 maritime-grid pointer-events-none opacity-25 z-0" />

      {/* SVG Nautical Route Vector Graphics with Pulsing Waypoints */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg
          className="absolute w-full h-full opacity-30"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Navigational Route Line */}
          <path
            d="M -100,520 C 280,440 580,660 980,410 C 1180,290 1320,360 1600,260"
            stroke="#22d3ee"
            strokeWidth="1.75"
            className="route-animate"
          />

          {/* Auxiliary Track Line */}
          <path
            d="M 100,680 C 450,580 750,720 1200,520 C 1380,440 1500,480 1650,420"
            stroke="#0284c7"
            strokeWidth="1"
            strokeDasharray="4 6"
            opacity="0.4"
          />

          {/* Waypoint Markers */}
          <circle cx="340" cy="455" r="5" fill="#22d3ee" className="beacon-pulse" />
          <circle cx="340" cy="455" r="2.5" fill="#38bdf8" />
          <circle cx="980" cy="410" r="5" fill="#22d3ee" className="beacon-pulse" />
          <circle cx="980" cy="410" r="2.5" fill="#38bdf8" />

          {/* Compass Rose Ring in the background */}
          <g transform="translate(1220, 240)" className="radar-sweep">
            <circle cx="0" cy="0" r="160" stroke="#0ea5e9" strokeWidth="0.75" strokeDasharray="4 8" opacity="0.35" />
            <circle cx="0" cy="0" r="100" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.3" />
            <line x1="0" y1="-160" x2="0" y2="160" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.25" />
            <line x1="-160" y1="0" x2="160" y2="0" stroke="#0ea5e9" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.25" />
          </g>
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Primary Typography & CTAs (7 Cols) */}
          <div className="lg:col-span-7 text-center sm:text-left">
            {/* Accreditation Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <Badge variant="cyan" size="md" className="backdrop-blur-md">
                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin [animation-duration:18s]" />
                <span>Northeast Shipping & Recruitment Agency Pvt. Ltd.</span>
              </Badge>
              <span className="hidden sm:inline-block text-xs text-slate-400 font-mono tracking-wider">
                UKHRUL · MANIPUR 795142
              </span>
            </motion.div>

            {/* Primary Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]"
            >
              Navigate Your{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-ocean-400 bg-clip-text text-transparent">
                Future.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed font-normal max-w-2xl"
            >
              Explore maritime careers, recruitment opportunities, and professional training pathways.
            </motion.p>

            {/* Official Motto */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-cyan-300 font-medium italic"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>“Navigating Trust. Delivering Excellence.”</span>
            </motion.div>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-start"
            >
              <Button
                href="/opportunities"
                variant="cyan"
                size="lg"
                className="w-full sm:w-auto shadow-lg shadow-cyan-500/25"
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Explore Opportunities
              </Button>
              <Button
                href="/training"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto border-cyan-500/30 hover:border-cyan-400"
                icon={<GraduationCap className="w-4 h-4 text-cyan-400" />}
              >
                Explore Training
              </Button>
            </motion.div>

            {/* Key Operational Streams Ticker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-navy-900/90 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Merchant Navy</p>
                  <p className="text-[11px] text-slate-400">Deck & Engine</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-navy-900/90 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Cruise Fleets</p>
                  <p className="text-[11px] text-slate-400">Luxury Liners</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-navy-900/90 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Hospitality & Spa</p>
                  <p className="text-[11px] text-slate-400">Guest Services</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-navy-900/90 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Offline Training</p>
                  <p className="text-[11px] text-slate-400">Academy Batches</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Restrained 3D Telemetry HUD Instrument (5 Cols) */}
          <div className="lg:col-span-5 perspective-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="card-3d-tilt preserve-3d p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-navy-900/90 via-navy-850/90 to-navy-950/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            >
              {/* Radar Corner Graphic */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* HUD Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-semibold tracking-wider text-white uppercase">
                    Maritime Telemetry HUD
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  TRANSMITTING
                </span>
              </div>

              {/* Verified Headquarters Telemetry */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800">
                  <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                    Registered Headquarters
                  </p>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    Opp. UBC Phungreitang East, Ukhrul District, Manipur – 795142
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>COORDS: 25.11° N, 94.36° E</span>
                    <span className="text-emerald-400">VERIFIED DESK</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Direct Helpline</p>
                    <a
                      href="tel:9383320200"
                      className="text-xs sm:text-sm font-mono font-bold text-cyan-300 hover:text-white transition-colors mt-0.5 block"
                    >
                      +91 93833 20200
                    </a>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-800">
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Training Delivery</p>
                    <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                      100% Offline
                    </p>
                  </div>
                </div>

                {/* Statutory Guarantee Pill */}
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/25 flex items-start gap-2.5 text-xs text-cyan-200/90">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    Adherence to DG Shipping guidelines and MLC 2006 Seafarer Protection Conventions. Zero placement fee exploitation.
                  </span>
                </div>
              </div>

              {/* Bottom Compass Indicator */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>RADAR BEARING: 042° NNE</span>
                <span>STATUS: ACTIVE FLEET MANNING</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
