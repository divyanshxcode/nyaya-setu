export interface ExtractionProgress {
  stage: number;
  totalPages: number;
  currentPage: number;
  partialText: string;
}

export interface StructuredPDFData {
  text: string;
  pageCount: number;
  wordCount: number;
  confidence: number;
  structuredData: {
    caseNumber?: string;
    courtName?: string;
    judge?: string;
    dateOfOrder?: string;
    petitioner?: string;
    respondent?: string;
    finalDecision?: string;
    keyDirections?: string[];
    summary?: string;
  };
}

async function extractViaApi(
  file: File,
  endpoint: '/api/extract-pdf' | '/api/extract-pdf-gemini'
): Promise<StructuredPDFData> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to extract PDF');
  }

  const data: StructuredPDFData = await response.json();

  if (!data || typeof data.text !== 'string') {
    throw new Error('Invalid response format from PDF extraction');
  }

  return data;
}

async function extractWithFallback(file: File): Promise<StructuredPDFData> {
  try {
    return await extractViaApi(file, '/api/extract-pdf');
  } catch (localError) {
    console.warn('Local PDF extraction failed, trying Gemini OCR fallback:', localError);

    try {
      return await extractViaApi(file, '/api/extract-pdf-gemini');
    } catch (geminiError) {
      if (geminiError instanceof Error) {
        throw geminiError;
      }
      if (localError instanceof Error) {
        throw localError;
      }
      throw new Error('Failed to extract PDF');
    }
  }
}

export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: ExtractionProgress) => void
): Promise<string> {
  try {
    const data = await extractWithFallback(file);

    // Notify progress
    if (onProgress) {
      onProgress({
        stage: 3,
        totalPages: data.pageCount,
        currentPage: data.pageCount,
        partialText: data.text,
      });
    }

    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
  }
}

export async function extractStructuredDataFromPDF(
  file: File
): Promise<StructuredPDFData> {
  try {
    return await extractWithFallback(file);
  } catch (error) {
    console.error('PDF extraction error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to extract data from PDF. Please ensure the file is a valid PDF.');
  }
}
