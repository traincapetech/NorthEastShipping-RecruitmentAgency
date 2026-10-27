import React from 'react';
import { Compass } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-navy-950 px-4">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-navy-900 border border-cyan-500/30 mb-4 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
        <Compass className="w-8 h-8 text-cyan-400 animate-spin [animation-duration:3s]" />
      </div>
      <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
        Navigating Coordinates...
      </p>
      <p className="text-[11px] text-slate-500 mt-1">
        Northeast Shipping & Recruitment Agency
      </p>
    </div>
  );
}
