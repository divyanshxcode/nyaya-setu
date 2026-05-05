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

export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: ExtractionProgress) => void
): Promise<string> {
  try {
    // Create FormData to send file to API
    const formData = new FormData();
    formData.append('file', file);

    // Call Gemini-powered PDF extraction API
    const response = await fetch('/api/extract-pdf-gemini', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract PDF');
    }

    const data: StructuredPDFData = await response.json();

    if (!data || typeof data.text !== 'string') {
      throw new Error('Invalid response format from PDF extraction');
    }

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
    throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
  }
}

export async function extractStructuredDataFromPDF(
  file: File
): Promise<StructuredPDFData> {
  try {
    // Create FormData to send file to API
    const formData = new FormData();
    formData.append('file', file);

    // Call Gemini-powered PDF extraction API
    const response = await fetch('/api/extract-pdf-gemini', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract PDF');
    }

    const data: StructuredPDFData = await response.json();

    if (!data || typeof data.text !== 'string') {
      throw new Error('Invalid response format from PDF extraction');
    }

    return data;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract data from PDF. Please ensure the file is a valid PDF.');
  }
}
