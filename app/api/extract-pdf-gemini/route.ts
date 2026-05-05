import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
);

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

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

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

    // Convert File to Buffer and save to temp location
    const buffer = Buffer.from(await file.arrayBuffer());
    tempFilePath = path.join(os.tmpdir(), `judgment_${Date.now()}.pdf`);
    fs.writeFileSync(tempFilePath, buffer);

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Read the file as base64 for direct upload
    const fileContent = fs.readFileSync(tempFilePath);
    const base64Content = fileContent.toString('base64');

    // Create extraction prompt
    const extractionPrompt = `You are an expert judicial analyst specializing in Indian court judgments.
    
Analyze this PDF judgment document and extract:
1. Full text of the judgment
2. Structured metadata (case number, court, judge, dates, parties, etc.)
3. Key directions and orders
4. Summary of the judgment

Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "extractedText": "Full text of the judgment...",
  "caseNumber": "Case number from document",
  "courtName": "Name of the court",
  "judge": "Judge name",
  "dateOfOrder": "Date of order",
  "dateReserved": "Date reserved if mentioned",
  "petitioner": "Petitioner name",
  "respondent": "Respondent name",
  "finalDecision": "Final decision/verdict",
  "keyDirections": ["Direction 1", "Direction 2", "Direction 3"],
  "summary": "2-3 sentence summary of the judgment and key orders",
  "totalPages": estimated number of pages
}

Extract all text and structured information from the PDF. Be comprehensive.`;

    // Call Gemini API with PDF content
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Content,
        },
      },
      extractionPrompt,
    ]);

    const responseText = result.response.text();

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Gemini Response:', responseText);
      throw new Error('Failed to parse Gemini response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);

    // Extract text and calculate stats
    const extractedText = parsedData.extractedText || '';
    const wordCount = extractedText.split(/\s+/).filter((w: string) => w.length > 0).length;
    const pageCount = parsedData.totalPages || 1;

    const response: ExtractionResponse = {
      success: true,
      text: extractedText,
      pageCount,
      wordCount,
      confidence: 92, // High confidence when using Gemini
      structuredData: {
        caseNumber: parsedData.caseNumber,
        courtName: parsedData.courtName,
        judge: parsedData.judge,
        dateOfOrder: parsedData.dateOfOrder,
        petitioner: parsedData.petitioner,
        respondent: parsedData.respondent,
        finalDecision: parsedData.finalDecision,
        keyDirections: parsedData.keyDirections,
        summary: parsedData.summary,
      },
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
  } finally {
    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error('Error deleting temp file:', err);
      }
    }
  }
}
