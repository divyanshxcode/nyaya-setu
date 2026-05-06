'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useExtraction } from '@/lib/extraction-context';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExtractionStep1 } from './ExtractionStep1';
import { ExtractionStep2 } from './ExtractionStep2';
import { ExtractionStep3 } from './ExtractionStep3';

const steps = [
  { number: 1 as const, title: 'Upload', description: 'Court order PDF', status: 'upload' },
  { number: 2 as const, title: 'Review', description: 'Verify extraction', status: 'verified' },
  { number: 3 as const, title: 'Action Plan', description: 'AI-drafted tasks', status: 'plan' },
];

export function ExtractionUploadFlow() {
  const router = useRouter();
  const { currentStep, extraction, actionPlan, isLoading, error, prevStep, goToStep } =
    useExtraction();

  const getStatusBadge = (stepNumber: number) => {
    if (stepNumber === 1) {
      return <Badge variant="outline">Upload</Badge>;
    } else if (stepNumber === 2) {
      if (!extraction) return <Badge variant="outline">Pending</Badge>;
      return extraction.reviewStatus === 'approved' || extraction.reviewStatus === 'approved_with_edits' ? (
        <Badge className="bg-green-100 text-green-800">Verified</Badge>
      ) : extraction.reviewStatus === 'rejected' ? (
        <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      ) : (
        <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      );
    } else if (stepNumber === 3) {
      return actionPlan ? (
        <Badge className="bg-green-100 text-green-800">Generated</Badge>
      ) : (
        <Badge variant="outline">Pending</Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="AI Action Plan Generator"
        description="Upload a court order, verify extracted case details, and generate a structured action plan."
      />

      {/* ERROR ALERT */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* STEPPER */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-3">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(40px,0.7fr)_minmax(0,1fr)_minmax(40px,0.7fr)_minmax(0,1fr)] items-center gap-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <button
                  onClick={() => goToStep(step.number)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all',
                      currentStep > step.number
                        ? 'bg-primary text-white'
                        : currentStep === step.number
                          ? 'border-2 border-primary bg-slate-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                    )}
                  >
                    {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className={cn('text-xs font-semibold', currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground')}>
                      {step.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{step.description}</p>
                  </div>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 w-full',
                      currentStep > step.number ? 'bg-primary' : 'bg-slate-300'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* STATUS BADGES */}
          <div className="mt-3 flex flex-wrap justify-end gap-2 border-t pt-3">
            {steps.map(step => (
              <div key={step.number} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Step {step.number}:</span>
                {getStatusBadge(step.number)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentStep > 1 && (
        <div className="flex items-center justify-between gap-3">
          <Button
            onClick={prevStep}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="bg-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === 3 && (
            <Button
              onClick={() => router.push('/cases')}
              disabled={isLoading || !actionPlan}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Submit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* STEP CONTENT */}
      <div className="min-h-[560px]">
        {currentStep === 1 && <ExtractionStep1 />}
        {currentStep === 2 && <ExtractionStep2 />}
        {currentStep === 3 && <ExtractionStep3 />}
      </div>
    </div>
  );
}
