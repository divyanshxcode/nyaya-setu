'use client';

import React from 'react';
import { useExtraction } from '@/lib/extraction-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { DropZone } from './DropZone';

export function ExtractionStep1() {
  const { extraction, isLoading, setFile, clearFile } = useExtraction();

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Upload Court Order PDF</CardTitle>
        <CardDescription>
          Select a court judgment or order PDF for processing. The system will extract case details and
          prepare them for human review.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(300px,2fr)]">
          <div className="space-y-4">
            <DropZone
              onFileSelect={setFile}
              file={extraction?.pdfFile || null}
              onClear={clearFile}
            />

            {isLoading && extraction?.pdfFile && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="flex items-center gap-2 text-sm text-blue-900">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" />
                  Processing PDF and extracting case details...
                </p>
              </div>
            )}

            {!isLoading && extraction?.pdfFile && extraction?.extractedDetails && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-sm text-emerald-900">
                  PDF processed successfully. Opening review...
                </p>
              </div>
            )}

            {!isLoading && extraction?.pdfFile && !extraction?.extractedDetails && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm text-slate-800">
                  PDF ready. Extraction will begin automatically.
                </p>
              </div>
            )}

            {!extraction?.pdfFile && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div className="text-sm text-amber-900">
                  <p className="mb-1 font-medium">No file selected</p>
                  <p>Upload a PDF file to proceed with case detail extraction.</p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 text-sm font-semibold">What happens next?</h4>
            <ul className="space-y-3 text-sm leading-5 text-muted-foreground">
              <li>Raw text extraction from PDF using PDF.js</li>
              <li>Gemini AI processes text for structured extraction</li>
              <li>Move to Step 2 for human review and verification</li>
              <li>Then generate comprehensive action plan in Step 3</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
