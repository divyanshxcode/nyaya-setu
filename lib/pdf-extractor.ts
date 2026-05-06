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
  file: File
): Promise<StructuredPDFData> {
  const formData = new FormData();
  formData.append('file', file);

  // Try primary endpoint first
  try {
    const response = await fetch('/api/extract-pdf', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data: StructuredPDFData = await response.json();
      if (data && typeof data.text === 'string') {
        return data;
      }
    }
  } catch (error) {
    console.warn('Primary PDF extraction failed, will try Gemini fallback:', error);
  }

  // Fallback to Gemini endpoint if primary fails
  console.log('Attempting Gemini-based extraction as fallback...');
  const formData2 = new FormData();
  formData2.append('file', file);

  const response = await fetch('/api/extract-pdf-gemini', {
    method: 'POST',
    body: formData2,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || 'Failed to extract PDF with both methods');
  }

  const data: StructuredPDFData = await response.json();

  if (!data || typeof data.text !== 'string') {
    throw new Error('Invalid response format from PDF extraction');
  }

  return data;
}

export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: ExtractionProgress) => void
): Promise<string> {
  try {
    const data = await extractViaApi(file);

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
    return await extractViaApi(file);
  } catch (error) {
    console.error('PDF extraction error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to extract data from PDF. Please ensure the file is a valid PDF.');
  }
}
