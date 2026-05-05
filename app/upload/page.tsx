"use client";

import { useState } from "react";
import { DropZone } from "@/components/upload/DropZone";
import { ProcessingStatus } from "@/components/upload/ProcessingStatus";
import { ExtractionPreview } from "@/components/upload/ExtractionPreview";
import { Upload as UploadIcon, Cpu, Eye, BadgeCheck } from "lucide-react";

export default function UploadPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const steps = [
    { id: 1, label: "Upload PDF", icon: UploadIcon },
    { id: 2, label: "AI Extraction", icon: Cpu },
    { id: 3, label: "Review", icon: Eye },
    { id: 4, label: "Verified", icon: BadgeCheck }
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col gap-6 h-full">
      <div className="shrink-0">
        <h1 className="font-playfair text-[28px] font-semibold text-[var(--text-primary)]">Upload Court Judgment</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Upload PDF judgment files for AI-powered extraction and analysis</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center w-full max-w-3xl mx-auto shrink-0 mb-4">
        {steps.map((s, idx) => {
          const isActive = step === s.id;
          const isPast = step > s.id;
          
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                  isActive ? "bg-[var(--accent-navy)] text-white" : 
                  isPast ? "bg-[var(--status-verified)] text-white" : 
                  "bg-[var(--surface-raised)] border border-[var(--border-strong)] text-[var(--text-muted)]"
                }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs absolute -bottom-6 w-24 text-center font-bold tracking-wider uppercase ${
                  isActive || isPast ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-colors duration-300 ${
                  isPast ? "bg-[var(--status-verified)]" : "bg-[var(--border)]"
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 mt-6">
        {step === 1 && (
          <div className="h-full flex items-center">
            <DropZone onFileSelected={() => setStep(2)} />
          </div>
        )}
        
        {step === 2 && (
          <div className="h-full flex items-center">
            <ProcessingStatus onComplete={() => setStep(3)} />
          </div>
        )}
        
        {step === 3 && (
          <ExtractionPreview />
        )}
      </div>
    </div>
  );
}
