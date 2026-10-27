'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to observability pipeline
    console.error('System Navigational Failure:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4 relative">
      <div className="max-w-md w-full text-center p-8 rounded-2xl bg-navy-900 border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-1">
          Navigational Interruption
        </p>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          An Unexpected Error Occurred
        </h1>
        <p className="text-xs text-slate-400 mt-2 mb-8 leading-relaxed">
          The requested system operation encountered an issue while loading. Please try recalibrating the page or returning home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => reset()}
            variant="cyan"
            size="md"
            icon={<RotateCcw className="w-4 h-4" />}
          >
            Retry Request
          </Button>
          <Button
            href="/"
            variant="secondary"
            size="md"
            icon={<Home className="w-4 h-4" />}
          >
            Return to Port
          </Button>
        </div>
      </div>
    </div>
  );
}
