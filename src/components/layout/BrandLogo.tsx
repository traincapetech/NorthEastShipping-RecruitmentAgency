'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
  lightText?: boolean;
}

export function BrandLogo({ className = '', showSubtitle = true, lightText = true }: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href="/" className={`group flex items-center gap-3 focus-visible:outline-cyan-400 ${className}`}>
      {!imageError ? (
        <div className="relative h-10 sm:h-11 flex items-center bg-white px-2 py-1 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:border-cyan-400 transition-all">
          <Image
            src="/brand/logo.jpeg"
            alt="Northeast Shipping & Recruitment Agency Pvt Ltd"
            width={180}
            height={44}
            className="h-8 sm:h-9 w-auto object-contain"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      ) : (
        /* Emblem + Typography Fallback */
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:border-cyan-400 transition-colors">
            <svg
              className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" className="stroke-cyan-500/40" />
              <polygon points="12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9" fill="currentColor" fillOpacity="0.25" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold tracking-wider text-base sm:text-lg leading-tight ${lightText ? 'text-white' : 'text-slate-900'}`}>
                NORTHEAST
              </span>
              <span className="font-light tracking-wider text-base sm:text-lg leading-tight text-cyan-400">
                SHIPPING
              </span>
            </div>
            {showSubtitle && (
              <span className="text-[10px] tracking-widest uppercase font-medium text-slate-400 group-hover:text-cyan-300 transition-colors">
                & Recruitment Agency Pvt Ltd
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}
