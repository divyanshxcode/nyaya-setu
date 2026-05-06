'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { ExtractedFieldWithMeta } from '@/types';

interface PDFViewerProps {
  file: File | null;
  highlightedField?: string | null;
  fieldsWithMeta?: ExtractedFieldWithMeta[];
}

export function PDFViewer({ file, highlightedField, fieldsWithMeta }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pdfReady, setPdfReady] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    setPdfReady(true);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ PDF loaded successfully, pages:', numPages);
    setNumPages(numPages);
    setCurrentPage(prev => Math.min(prev, numPages));
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('❌ Error loading PDF:', error);
    setError('Failed to load PDF. Please ensure it is a valid PDF file.');
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => (numPages ? Math.min(prev + 1, numPages) : prev));
  };

  useEffect(() => {
    // Scroll to highlighted content if available
    if (highlightedField && documentRef.current && fieldsWithMeta) {
      const field = fieldsWithMeta.find(f => f.fieldKey === highlightedField);
      if (field?.sourcePageNumber) {
        setCurrentPage(field.sourcePageNumber);
        // Small delay to ensure page is rendered before scrolling
        setTimeout(() => {
          if (documentRef.current) {
            documentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [highlightedField, fieldsWithMeta]);

  if (!file) {
    return (
      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">No PDF file selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pdfReady) {
    return (
      <Card>
        <CardContent className="pt-6 h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Initializing PDF viewer...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Preview with Source Highlights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div
          ref={documentRef}
          className="border rounded-lg bg-white overflow-auto"
          style={{ maxHeight: '500px' }}
        >
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div className="p-8 text-center text-muted-foreground">Loading PDF...</div>}
          >
            <Page
              pageNumber={currentPage}
              scale={1.2}
              renderTextLayer={true}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {numPages || '—'}
          </span>

          <Button
            onClick={goToNextPage}
            disabled={!numPages || currentPage >= numPages}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
