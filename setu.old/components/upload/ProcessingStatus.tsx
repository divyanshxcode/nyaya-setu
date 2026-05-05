"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Cpu } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

interface ProcessingStatusProps {
  onComplete: () => void;
}

const STAGES = [
  "PDF uploaded successfully",
  "Parsing document structure...",
  "Extracting case details",
  "Identifying legal directives",
  "Generating action plan",
  "Calculating confidence scores"
];

export function ProcessingStatus({ onComplete }: ProcessingStatusProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progression
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        // Update stage based on progress
        const newStage = Math.floor((p / 100) * STAGES.length);
        if (newStage !== currentStage && newStage < STAGES.length) {
          setCurrentStage(newStage);
        }
        
        return p + 2; // +2% every 100ms = 5s total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStage, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 flex flex-col gap-8 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-blue-light)] flex items-center justify-center mb-2">
          <Cpu className="w-8 h-8 text-[var(--accent-blue)] animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-playfair font-semibold text-[var(--text-primary)]">AI Extraction in Progress</h2>
          <p className="text-[var(--text-secondary)] mt-1">Analyzing legal language and structural context...</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-[var(--text-primary)]">Processing...</span>
          <span className="text-[var(--accent-blue)]">{progress}%</span>
        </div>
        <ProgressBar progress={progress} height="h-2" />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {STAGES.map((stage, idx) => {
          const isComplete = idx < currentStage || progress === 100;
          const isActive = idx === currentStage && progress < 100;
          const isPending = idx > currentStage;

          return (
            <div key={idx} className={cn(
              "flex items-center gap-3 transition-opacity duration-300",
              isPending ? "opacity-40" : "opacity-100"
            )}>
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--status-verified)] shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-5 h-5 text-[var(--accent-blue)] animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[var(--border-strong)] shrink-0" />
              )}
              <span className={cn(
                "text-sm font-medium transition-colors",
                isComplete ? "text-[var(--text-secondary)]" : isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              )}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
