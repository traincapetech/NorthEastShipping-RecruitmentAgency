import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Compass, Anchor, ShieldCheck, Target, Award, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Northeast Shipping & Recruitment Agency Pvt Ltd, our corporate vision, recruitment principles, and offline maritime cadetship programs.'
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-navy-950">
      {/* Page Header */}
      <div className="border-b border-slate-800/80 bg-navy-900/40 py-16 relative">
        <div className="absolute inset-0 maritime-grid opacity-20 pointer-events-none" />
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Institutional Profile</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              About Northeast Shipping
            </h1>
            <p className="mt-4 text-lg text-slate-300 leading-relaxed">
              Fostering excellence in international maritime recruitment and facilitating structured pathways into accredited offline seafaring academies.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-16 space-y-16">
        {/* Company Narrative & Purpose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 text-slate-300 text-sm leading-relaxed">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Bridging Regional Seafaring Aspiration with Global Fleet Standards
            </h2>
            <p>
              Incorporated as <strong>Northeast Shipping & Recruitment Agency Pvt Ltd</strong>, our organization was created to provide a structured, transparent, and merit-focused gateway for seafarers and maritime trainees seeking careers across international commercial cargo carriers and luxury cruise fleets.
            </p>
            <p>
              Headquartered with registered office infrastructure in India, our mandate spans two complementary maritime vectors: sourcing verified qualified marine crew for global vessel managers, and guiding qualified young aspirants into certified offline residential maritime academies for pre-sea cadetship and rating programs.
            </p>
            <p>
              We firmly reject predatory manning practices. Every recruitment recommendation is governed by documentary authenticity, technical competence, and complete adherence to maritime labor conventions.
            </p>
          </div>

          <div className="lg:col-span-5">
            <Card glow className="p-8 bg-navy-900/90 border-cyan-500/30">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span>Our Core Mandate</span>
              </h3>
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Facilitate direct, credential-verified recruitment for Deck, Engine, and Shipboard Hotel crew.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Advise candidates into accredited offline pre-sea institutions upholding DG Shipping standards.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Promote maritime employment opportunities for promising talent across regional corridors.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Enforce zero-fee exploitation policies in accordance with MLC 2006 regulations.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Operational Pillars */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Four Primary Operations</h2>
            <p className="mt-2 text-sm text-slate-400">
              Specialized departments tailored to international shipping requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-navy-900/60 border-slate-800">
              <Anchor className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Merchant Navy Crewing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recruiting Navigating Officers, Marine Engineers, and Seamanship Ratings for commercial bulkers, container ships, and tankers.
              </p>
            </Card>

            <Card className="p-6 bg-navy-900/60 border-slate-800">
              <Award className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Cruise Ship Manning</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Placing hospitality professionals, pursers, culinary talent, and guest services crew aboard international cruise liners.
              </p>
            </Card>

            <Card className="p-6 bg-navy-900/60 border-slate-800">
              <Users className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Hospitality & Wellness</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Screening certified spa therapists, beauty practitioners, and wellness coordinators for luxury shipboard spas.
              </p>
            </Card>

            <Card className="p-6 bg-navy-900/60 border-slate-800">
              <ShieldCheck className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-base font-bold text-white mb-2">Offline Cadet Admissions</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Facilitating offline residential enrollment for GP Rating, DNS Officer Cadetship, and STCW modular courses.
              </p>
            </Card>
          </div>
        </div>

        {/* Corporate Commitment & CTA */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Have Questions for Our Board or Recruitment Officers?</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              We welcome enquiries from seafarers, aspiring cadets, and international shipping principals seeking reliable crewing collaboration.
            </p>
          </div>
          <Button href="/contact" variant="cyan" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Contact Official Desk
          </Button>
        </div>
      </Container>
    </div>
  );
}
