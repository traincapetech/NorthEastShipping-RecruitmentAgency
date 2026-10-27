'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from './BrandLogo';
import { Button } from '@/components/ui/Button';
import { Menu, X, Anchor, UserCheck, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Opportunities', href: '/opportunities', badge: 'Active' },
  { label: 'Training Programs', href: '/training', badge: 'Offline' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-md border-b border-cyan-500/20 shadow-xl shadow-black/50'
          : 'bg-gradient-to-b from-navy-950 via-navy-950/80 to-transparent'
      }`}
    >
      {/* Top Maritime Telemetry Bar */}
      <div className="hidden md:block border-b border-slate-800/80 bg-navy-950/90 text-[11px] text-slate-400 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-mono text-cyan-400">LAT 25.11°N · LON 94.36°E</span>
            <span className="text-slate-600">|</span>
            <span>HQ: Ukhrul District, Manipur – 795142</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300 italic font-medium">“Navigating Trust. Delivering Excellence.”</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:9383320200"
              className="text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1 font-mono font-medium"
            >
              <span>Desk: +91 93833 20200</span>
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Recruitment Open</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <BrandLogo />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden xl:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 px-2.5 py-1.5 rounded border border-slate-800 hover:border-cyan-500/30 transition-colors"
              title="Restricted Staff Portal"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400/80" />
              <span>Admin</span>
            </Link>

            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-cyan-300 px-3 py-2 transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Candidate Portal</span>
            </Link>

            <Button
              href="/opportunities"
              variant="cyan"
              size="sm"
              icon={<Anchor className="w-3.5 h-3.5" />}
            >
              Apply Now
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus-visible:outline-cyan-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-cyan-500/20 bg-navy-950/98 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3 mt-2 shadow-2xl">
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-500/10 border-l-2 border-cyan-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-slate-700/80 text-sm font-medium text-slate-200 hover:border-cyan-500/40"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Candidate Portal Sign In</span>
            </Link>
            <Button
              href="/opportunities"
              variant="cyan"
              size="md"
              className="w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Recruitment Openings
            </Button>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center text-xs text-slate-400 hover:text-cyan-300 py-1 flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff / Admin Console</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
