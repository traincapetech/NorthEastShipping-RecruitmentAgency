import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'ocean' | 'navy' | 'emerald' | 'amber' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'cyan', size = 'sm', className = '' }: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-medium tracking-wide',
    md: 'text-xs px-3 py-1 rounded-full font-medium tracking-wide'
  };

  const variantStyles = {
    cyan: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
    ocean: 'bg-ocean-500/15 text-ocean-300 border border-ocean-500/30',
    navy: 'bg-navy-800/90 text-slate-300 border border-slate-700/60',
    emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    slate: 'bg-slate-800/80 text-slate-400 border border-slate-700/40'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
