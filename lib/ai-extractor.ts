import type { ExtractedField } from '@/types';

export interface ExtractionField {
  fieldName: string;
  value: string;
  confidenceScore: number;
}

const extractionFields: ExtractionField[] = [
  { fieldName: 'Case Number', value: 'WP/2024/00134', confidenceScore: 98 },
  { fieldName: 'Court Name', value: 'Delhi High Court', confidenceScore: 99 },
  { fieldName: 'Judge', value: "Hon'ble Justice R.K. Sharma", confidenceScore: 97 },
  { fieldName: 'Date of Order', value: '15th January, 2024', confidenceScore: 96 },
  { fieldName: 'Petitioner', value: 'Rajesh Kumar Singh', confidenceScore: 94 },
  { fieldName: 'Respondent', value: 'State of Delhi & Ors.', confidenceScore: 95 },
  { fieldName: 'Final Decision', value: 'Petition Allowed', confidenceScore: 95 },
  { fieldName: 'Key Directions', value: '3 items found', confidenceScore: 92 },
  { fieldName: 'Deadline', value: '30 days from order', confidenceScore: 91 },
  { fieldName: 'Department', value: 'PWD', confidenceScore: 94 },
];

const keyDirections = [
  'Complete road repair work within 30 days',
  'Submit compliance report with photographic evidence',
  'Ensure proper drainage system installation',
];

const suggestedSteps = [
  'Survey damaged road sections',
  'Procure materials for repair',
  'Execute repair work',
  'Install drainage system',
  'Submit compliance report with photos',
];

export interface ExtractionResult {
  fields: ExtractionField[];
  summary: string;
  keyDirections: string[];
  suggestedSteps: string[];
  overallConfidence: number;
  actionType: 'compliance' | 'appeal' | 'review' | 'internal_order';
  priority: 'high' | 'medium' | 'low';
  deadline: string;
  responsibleDepartment: string;
}

export async function simulateExtraction(
  onFieldExtracted: (field: ExtractionField, index: number) => void,
  onComplete: (result: ExtractionResult) => void
): Promise<ExtractionResult> {
  const extractedFields: ExtractionField[] = [];

  for (let i = 0; i < extractionFields.length; i++) {
    await delay(randomBetween(300, 500));
    const field = extractionFields[i];
    extractedFields.push(field);
    onFieldExtracted(field, i);
  }

  await delay(500);

  const result: ExtractionResult = {
    fields: extractedFields,
    summary: 'Court directed the PWD to complete road repair work within 30 days and submit compliance report.',
    keyDirections,
    suggestedSteps,
    overallConfidence: 94,
    actionType: 'compliance',
    priority: 'high',
    deadline: '30 days from order date',
    responsibleDepartment: 'Public Works Department',
  };

  onComplete(result);
  return result;
}

export function createExtractedFields(fields: ExtractionField[]): ExtractedField[] {
  return fields.map((field, index) => ({
    fieldName: field.fieldName,
    value: field.value,
    confidenceScore: field.confidenceScore,
    sourceHighlight: {
      pageNumber: Math.floor(index / 3) + 1,
      boundingBox: { x: 50, y: 100 + index * 50, width: 400, height: 20 },
      text: `Source text for ${field.fieldName}`,
    },
  }));
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
