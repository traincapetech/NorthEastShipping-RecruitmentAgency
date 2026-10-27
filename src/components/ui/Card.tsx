import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
  glow?: boolean;
}

export function Card({ children, hoverEffect = false, glow = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-800/80 bg-navy-900/60 backdrop-blur-md p-6 transition-all duration-300 ${
        hoverEffect ? 'hover:border-cyan-500/40 hover:bg-navy-850/80 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5' : ''
      } ${glow ? 'shadow-[0_0_25px_rgba(6,182,212,0.1)] border-cyan-500/30' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
