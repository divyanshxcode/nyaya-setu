'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink, FileText } from 'lucide-react';
import type { ExtractedFieldWithMeta } from '@/types';

interface PDFViewerProps {
  file: File | null;
  highlightedField?: string | null;
  fieldsWithMeta?: ExtractedFieldWithMeta[];
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [error, setError] = useState<string | null>(null);
  const objectUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    setError(null);

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  if (!file) {
    return (
      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-muted-foreground">No PDF file selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!objectUrl) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex h-[400px] items-center justify-center text-muted-foreground">
            Preparing PDF preview...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>PDF Preview</CardTitle>
          <Button asChild size="sm" variant="outline">
            <a href={objectUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border bg-slate-50">
          <iframe
            key={objectUrl}
            src={objectUrl}
            title={file.name}
            className="h-[720px] w-full bg-white"
            onError={() => setError('Failed to load PDF preview in the browser frame.')}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-4 w-4" />
          {file.name}
        </div>
      </CardContent>
    </Card>
  );
}
