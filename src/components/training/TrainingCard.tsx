import React from 'react';
import Link from 'next/link';
import { TrainingProgram } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock, Award, ChevronRight, School } from 'lucide-react';

interface TrainingCardProps {
  program: TrainingProgram;
}

export function TrainingCard({ program }: TrainingCardProps) {
  return (
    <Card hoverEffect className="card-3d-tilt flex flex-col justify-between group h-full bg-navy-900/70 border-slate-800">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="ocean" size="sm">
            {program.code}
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
            <School className="w-3 h-3 text-cyan-400" />
            <span>Offline Campus</span>
          </span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
          {program.title}
        </h3>

        <div className="mt-3 space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="line-clamp-1">{program.batchSchedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="line-clamp-1">{program.certificationBody}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
          {program.overview}
        </p>

        {/* Curriculum Preview */}
        <div className="bg-navy-950/70 p-3.5 rounded-lg border border-slate-800/80 mb-4">
          <p className="text-[11px] font-semibold text-slate-300 mb-2">Key Training Modules:</p>
          <ul className="space-y-1.5">
            {program.curriculum.slice(0, 3).map((item, idx) => (
              <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                <span className="text-cyan-400 font-bold shrink-0">·</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {program.status}
        </span>
        <Link
          href={`/training/${program.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors group/link"
        >
          <span>Admission Details</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Card>
  );
}
