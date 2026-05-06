import { NextRequest, NextResponse } from 'next/server';
import path from 'node:path';

export const runtime = 'nodejs';

interface ExtractionResponse {
  success: boolean;
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
  error?: string;
}

// Simple pattern-based structured data extraction
function extractStructuredData(text: string): ExtractionResponse['structuredData'] {
  // Pattern-based extraction
  const caseNumberMatch = text.match(/(?:Case No\.?|C\.?P\.?|W\.?P\.?)\s*[:\-]?\s*(\d+\/?\d+\/?\d*)/i);
  const courtMatch = text.match(/(?:High Court|Supreme Court|District Court|Court of|Circuit|Session)/i);
  const dateMatch = text.match(/(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i);

  // Extract judge names (look for "Before" or "Hon'ble" patterns)
  const judgeMatch = text.match(/(?:Before|Hon'ble|Honorable)\s+(?:Mr\.|Ms\.|Dr\.|Justice)?\s*([A-Z][a-zA-Z\s\.]+)/i);

  // Extract parties (simple heuristic - often after "vs" or "vs.")
  const partyMatch = text.match(/([A-Z][A-Za-z\s]+)\s+(?:vs|versus|V\.S\.)\s+([A-Z][A-Za-z\s]+)/i);

  // Try to find a summary or key decision
  const orderMatch = text.match(/(?:ORDER|DECISION|HELD|JUDGMENT)[\s\n]+([^\n]{20,200})/i);

  return {
    caseNumber: caseNumberMatch ? caseNumberMatch[1] : undefined,
    courtName: courtMatch ? courtMatch[0] : undefined,
    judge: judgeMatch ? judgeMatch[1].trim() : undefined,
    dateOfOrder: dateMatch ? dateMatch[0] : undefined,
    petitioner: partyMatch ? partyMatch[1].trim() : undefined,
    respondent: partyMatch ? partyMatch[2].trim() : undefined,
    finalDecision: orderMatch ? orderMatch[1].trim() : undefined,
    keyDirections: extractKeyDirections(text),
    summary: generateSummary(text),
  };
}

function extractKeyDirections(text: string): string[] {
  const directions: string[] = [];
  
  // Look for numbered items or bullet points
  const directivePatterns = [
    /\d+\.\s+([^\n]{10,150})/g,
    /[•\-]\s+([^\n]{10,150})/g,
  ];

  for (const pattern of directivePatterns) {
    let match;
    const matches: string[] = [];
    while ((match = pattern.exec(text)) !== null && directions.length < 5) {
      const text = match[1].trim();
      if (text.length > 10 && !text.match(/^(The|This|A|An|and)/i)) {
        matches.push(text);
      }
    }
    if (matches.length > 0) {
      directions.push(...matches.slice(0, 5 - directions.length));
      break;
    }
  }

  return directions.length > 0 ? directions : ['Key directions to be extracted from PDF'];
}

function generateSummary(text: string): string {
  // Extract first meaningful sentence or paragraph
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const firstSentence = sentences[0]?.trim() || '';
  
  // Also look for "HELD" or "ORDER" sections
  const heldMatch = text.match(/HELD[\s\n]+([^\n]{20,300})/i);
  if (heldMatch) {
    return heldMatch[1].trim().substring(0, 200);
  }

  return firstSentence.substring(0, 200) || 'Judgment document extracted from PDF.';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', success: false },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Please upload a PDF file', success: false },
        { status: 400 }
      );
    }

    // Convert File to Buffer for pdf-parse.
    const buffer = Buffer.from(await file.arrayBuffer());

    // Try to parse PDF using pdf-parse
    let extractedText = '';
    let pageCount = 1;

    try {
      const { PDFParse } = await import('pdf-parse');
      PDFParse.setWorker(
        path.join(process.cwd(), 'node_modules/pdf-parse/dist/worker/pdf.worker.mjs')
      );
      const parser = new PDFParse({ data: buffer });

      try {
        const pdfData = await parser.getText();
        extractedText = pdfData.text?.trim() || '';
        pageCount = pdfData.total || 1;
      } finally {
        await parser.destroy();
      }
    } catch (pdfError) {
      console.error('pdf-parse extraction failed:', pdfError);
      return NextResponse.json(
        {
          error: 'Failed to extract text from this PDF. If it is scanned or image-only, OCR is required.',
          success: false,
        },
        { status: 422 }
      );
    }

    if (!extractedText) {
      return NextResponse.json(
        {
          error: 'No selectable text was found in this PDF. If it is scanned or image-only, OCR is required.',
          success: false,
        },
        { status: 422 }
      );
    }

    const wordCount = extractedText.split(/\s+/).filter((w: string) => w.length > 0).length;

    // Extract structured data using pattern matching
    const structuredData = extractStructuredData(extractedText);

    const response: ExtractionResponse = {
      success: true,
      text: extractedText,
      pageCount,
      wordCount,
      confidence: 85, // Slightly lower than AI for local extraction
      structuredData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PDF extraction error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to extract PDF';
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}
