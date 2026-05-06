'use client';

import React from 'react';
import { ExtractionProvider } from '@/lib/extraction-provider';
import { ExtractionUploadFlow } from '@/components/upload/ExtractionUploadFlow';

export default function UploadPage() {
  return (
    <ExtractionProvider>
      <ExtractionUploadFlow />
    </ExtractionProvider>
  );
}
