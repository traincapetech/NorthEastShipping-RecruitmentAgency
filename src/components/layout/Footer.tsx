'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Mail, Phone, MapPin, Compass, ShieldCheck, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-cyan-500/15 bg-navy-950 text-slate-400 text-sm relative overflow-hidden">
      {/* Subtle Maritime Coordinates & Grid Accent */}
      <div className="absolute inset-0 maritime-grid pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand & Corporate Overview */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo />
            <p className="text-cyan-300 text-xs italic font-medium">
              “Navigating Trust. Delivering Excellence.”
            </p>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Official maritime recruitment and professional training facilitator specializing in Merchant Navy deck & engine personnel, luxury cruise hospitality, and certified offline pre-sea preparatory programs.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-cyan-400/90 bg-cyan-950/30 border border-cyan-500/20 px-3 py-2 rounded-lg max-w-sm">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Transparent Recruitment Advisory: We strictly follow maritime ethical standards and DG Shipping guidelines.</span>
            </div>
          </div>

          {/* Recruitment Streams */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Recruitment</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/opportunities?category=merchant-navy" className="hover:text-cyan-300 transition-colors">
                  Merchant Navy (Deck & Engine)
                </Link>
              </li>
              <li>
                <Link href="/opportunities?category=cruise-ship" className="hover:text-cyan-300 transition-colors">
                  International Cruise Liners
                </Link>
              </li>
              <li>
                <Link href="/opportunities?category=hospitality-wellness" className="hover:text-cyan-300 transition-colors">
                  Hospitality & Spa Wellness
                </Link>
              </li>
              <li>
                <Link href="/opportunities?category=technical-engineering" className="hover:text-cyan-300 transition-colors">
                  Electro-Technical & Engineering
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>Candidate Application Status</span>
                  <ExternalLink className="w-3 h-3 text-cyan-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Offline Training Programs */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Offline Training
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/training/trn-gp-rating" className="hover:text-cyan-300 transition-colors">
                  GP Rating Pre-Sea (6 Months)
                </Link>
              </li>
              <li>
                <Link href="/training/trn-dns-cadet" className="hover:text-cyan-300 transition-colors">
                  DNS Officer Cadet Program
                </Link>
              </li>
              <li>
                <Link href="/training/trn-stcw-bst" className="hover:text-cyan-300 transition-colors">
                  STCW Basic Safety Packages
                </Link>
              </li>
              <li>
                <Link href="/training/trn-eto-presea" className="hover:text-cyan-300 transition-colors">
                  Pre-Sea ETO Academy Batch
                </Link>
              </li>
              <li>
                <Link href="/training" className="hover:text-cyan-300 transition-colors text-cyan-400">
                  Admission Enquiries & Batches →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Verification */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Headquarters
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Opp. UBC Phungreitang East, Ukhrul District, Manipur – 795142, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:contact@northeastshipping.com" className="hover:text-cyan-300 transition-colors">
                  contact@northeastshipping.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="tel:9383320200" className="hover:text-cyan-300 transition-colors">
                  +91 93833 20200
                </a>
              </li>
              <li className="text-xs text-slate-400 pt-1">
                Desk Hours: Monday – Saturday (09:30 – 18:00 IST)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} Northeast Shipping & Recruitment Agency Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-cyan-300 transition-colors">
              Company Background
            </Link>
            <Link href="/contact" className="hover:text-cyan-300 transition-colors">
              Enquiry Desk
            </Link>
            <Link href="/admin" className="hover:text-cyan-300 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
