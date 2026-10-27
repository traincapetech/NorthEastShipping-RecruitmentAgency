import React from 'react';
import Link from 'next/link';
import { RecruitmentOpportunity } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Ship, Clock, MapPin, ChevronRight } from 'lucide-react';

interface JobCardProps {
  opportunity: RecruitmentOpportunity;
}

export function JobCard({ opportunity }: JobCardProps) {
  const categoryLabels = {
    'merchant-navy': 'Merchant Navy',
    'cruise-ship': 'Cruise Ship',
    'hospitality-wellness': 'Hospitality & Wellness',
    'technical-engineering': 'Technical Engineering'
  };

  return (
    <Card hoverEffect className="flex flex-col justify-between h-full group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="cyan" size="sm">
            {categoryLabels[opportunity.category]}
          </Badge>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {opportunity.status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {opportunity.title}
        </h3>

        <p className="text-xs text-slate-400 font-medium mt-1 mb-4">
          {opportunity.department}
        </p>

        {/* Operational Specs */}
        <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Ship className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="line-clamp-1">{opportunity.vesselType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{opportunity.contractDuration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{opportunity.location}</span>
          </div>
        </div>

        {/* Essential prerequisites badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {opportunity.stcwRequired && (
            <span className="text-[10px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              STCW 2010
            </span>
          )}
          {opportunity.cdcRequired && (
            <span className="text-[10px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Valid CDC
            </span>
          )}
          {opportunity.passportRequired && (
            <span className="text-[10px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              Passport
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">
          Posted {opportunity.postedAt}
        </span>
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
        >
          <span>View Details & Apply</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Card>
  );
}
