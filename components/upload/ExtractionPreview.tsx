'use client';

import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';
import type { ExtractionField } from '@/lib/ai-extractor';

interface ExtractionPreviewProps {
  fields: ExtractionField[];
  isExtracting: boolean;
  overallConfidence?: number;
}

export function ExtractionPreview({ fields, isExtracting, overallConfidence }: ExtractionPreviewProps) {
  return (
    <div className="space-y-6">
      {/* AI Animation */}
      {isExtracting && (
        <div className="flex items-center gap-3 p-4 bg-saffron-light rounded-lg">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-saffron/20 animate-ping absolute" />
            <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center relative">
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            </div>
          </div>
          <div>
            <p className="font-medium text-navy">AI is analyzing judgment...</p>
            <p className="text-sm text-muted-foreground">Extracting legal information</p>
          </div>
        </div>
      )}

      {/* Extracted fields */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.fieldName}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-jade flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">{field.fieldName}:</span>
                <span className="ml-2 text-sm font-medium">{field.value}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    field.confidenceScore >= 90
                      ? 'bg-jade'
                      : field.confidenceScore >= 75
                      ? 'bg-amber'
                      : 'bg-crimson'
                  )}
                  style={{ width: `${field.confidenceScore}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10">
                {field.confidenceScore}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overall confidence gauge */}
      {overallConfidence !== undefined && !isExtracting && (
        <div className="flex flex-col items-center p-6 bg-card border border-border rounded-xl">
          <svg viewBox="0 0 100 60" className="w-48 h-28">
            {/* Background arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={overallConfidence >= 85 ? '#1A7A4A' : overallConfidence >= 70 ? '#D4891A' : '#C0392B'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="126"
              strokeDashoffset={126 - (overallConfidence / 100) * 126}
              className="animate-gauge"
            />
            {/* Center text */}
            <text x="50" y="48" textAnchor="middle" className="text-2xl font-bold fill-foreground">
              {overallConfidence}%
            </text>
          </svg>
          <p className="text-sm text-muted-foreground mt-2">Overall Extraction Confidence</p>
        </div>
      )}
    </div>
  );
}
