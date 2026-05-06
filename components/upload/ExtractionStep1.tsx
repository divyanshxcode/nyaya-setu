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
      <CardHeader className="pb-4">
        <CardTitle>Upload Court Order PDF</CardTitle>
        <CardDescription>
          Select a court judgment or order PDF for processing. The system will extract case details and
          prepare them for human review.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DropZone
          onFileSelect={setFile}
          file={extraction?.pdfFile || null}
          onClear={clearFile}
        />

        {isLoading && extraction?.pdfFile && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm text-blue-900 flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-600 border-t-transparent animate-spin" />
              Processing PDF and extracting case details...
            </p>
          </div>
        )}

        {!isLoading && extraction?.pdfFile && extraction?.extractedDetails && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <p className="text-sm text-emerald-900">
              ✓ PDF processed successfully. Click Next to review extracted details.
            </p>
          </div>
        )}

        {!isLoading && extraction?.pdfFile && !extraction?.extractedDetails && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm text-slate-800">
              ✓ PDF ready for processing. Click Next to proceed with extraction.
            </p>
          </div>
        )}

        {!extraction?.pdfFile && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium mb-1">No file selected</p>
              <p>Upload a PDF file to proceed with case detail extraction.</p>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <h4 className="mb-2 text-sm font-semibold">What happens next?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Raw text extraction from PDF using PDF.js</li>
            <li>✓ Gemini AI processes text for structured extraction</li>
            <li>✓ Move to Step 2 for human review and verification</li>
            <li>✓ Then generate comprehensive action plan in Step 3</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
