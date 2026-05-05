export interface ExtractionProgress {
  stage: number;
  totalPages: number;
  currentPage: number;
  partialText: string;
}

export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: ExtractionProgress) => void
): Promise<string> {
  try {
    // Create FormData to send file to API
    const formData = new FormData();
    formData.append('file', file);

    // Call API route for PDF extraction
    const response = await fetch('/api/extract-pdf', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to extract PDF');
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'PDF extraction failed');
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
