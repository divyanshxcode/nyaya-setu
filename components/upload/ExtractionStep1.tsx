'use client';

import React from 'react';
import { useExtraction } from '@/lib/extraction-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { DropZone } from './DropZone';

export function ExtractionStep1() {
  const { extraction, isLoading, setFile, clearFile } = useExtraction();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Court Order PDF</CardTitle>
        <CardDescription>
          Select a court judgment or order PDF for processing. The system will extract case details and
          prepare them for human review.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DropZone
          onFileSelect={setFile}
          file={extraction?.pdfFile || null}
          onClear={clearFile}
        />

        {isLoading && extraction?.pdfFile && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900 flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Processing PDF and extracting case details...
            </p>
          </div>
        )}

        {!isLoading && extraction?.pdfFile && extraction?.extractedDetails && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900">
              ✓ PDF processed successfully. Click Next to review extracted details.
            </p>
          </div>
        )}

        {!isLoading && extraction?.pdfFile && !extraction?.extractedDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              ✓ PDF ready for processing. Click Next to proceed with extraction.
            </p>
          </div>
        )}

        {!extraction?.pdfFile && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium mb-1">No file selected</p>
              <p>Upload a PDF file to proceed with case detail extraction.</p>
            </div>
          </div>
        )}

        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-3">What happens next?</h4>
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
