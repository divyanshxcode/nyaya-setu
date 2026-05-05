'use client';

import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OcrStage } from '@/lib/ocr-simulator';

interface OcrProgressStepperProps {
  stages: OcrStage[];
  currentStage: number;
}

export function OcrProgressStepper({ stages, currentStage }: OcrProgressStepperProps) {
  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div key={stage.name} className="flex items-center gap-4">
          {/* Status indicator */}
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
              stage.status === 'completed'
                ? 'bg-jade text-white'
                : stage.status === 'processing'
                ? 'bg-saffron text-white'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {stage.status === 'completed' ? (
              <Check className="h-4 w-4" />
            ) : stage.status === 'processing' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <span className="text-xs font-medium">{index + 1}</span>
            )}
          </div>

          {/* Label */}
          <span
            className={cn(
              'text-sm font-medium transition-colors',
              stage.status === 'completed'
                ? 'text-jade'
                : stage.status === 'processing'
                ? 'text-saffron'
                : 'text-muted-foreground'
            )}
          >
            {stage.name}
          </span>
        </div>
      ))}
    </div>
  );
}
