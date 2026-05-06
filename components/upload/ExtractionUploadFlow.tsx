'use client';

import React from 'react';
import { useExtraction } from '@/lib/extraction-context';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExtractionStep1 } from './ExtractionStep1';
import { ExtractionStep2 } from './ExtractionStep2';
import { ExtractionStep3 } from './ExtractionStep3';

const steps = [
  { number: 1 as const, title: 'Upload', description: 'Upload PDF', status: 'upload' },
  { number: 2 as const, title: 'Extract & Review', description: 'Human review', status: 'verified' },
  { number: 3 as const, title: 'Action Plan', description: 'AI-generated plan', status: 'plan' },
];

export function ExtractionUploadFlow() {
  const { currentStep, extraction, actionPlan, isLoading, error, nextStep, prevStep, goToStep } =
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
        title="Case Processing Workflow"
        description="Upload court judgment PDF for AI-powered extraction, human review, and action plan generation"
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
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <button
                  onClick={() => goToStep(step.number)}
                  disabled={isLoading}
                  className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity"
                >
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all',
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
                    <p className={cn('text-sm font-semibold', currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground')}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-1 mx-2',
                      currentStep > step.number ? 'bg-primary' : 'bg-slate-300'
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* STATUS BADGES */}
          <div className="mt-4 flex flex-wrap justify-end gap-2 border-t pt-4">
            {steps.map(step => (
              <div key={step.number} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Step {step.number}:</span>
                {getStatusBadge(step.number)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* STEP CONTENT */}
      <div className="min-h-[560px]">
        {currentStep === 1 && <ExtractionStep1 />}
        {currentStep === 2 && <ExtractionStep2 />}
        {currentStep === 3 && <ExtractionStep3 />}
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between gap-3">
        <Button
          onClick={prevStep}
          disabled={currentStep <= 1 || isLoading}
          variant="outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </div>

        <Button
          onClick={nextStep}
          disabled={
            currentStep >= steps.length ||
            isLoading ||
            (currentStep === 1 && !extraction?.pdfFile) ||
            (currentStep === 2 &&
              (!extraction ||
                (extraction.reviewStatus !== 'approved' && extraction.reviewStatus !== 'approved_with_edits')))
          }
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? 'Processing...' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
