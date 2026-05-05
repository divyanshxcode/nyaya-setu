import type { ExtractedField } from '@/types';
import { generateActionPlan, type ActionPlanResponse } from './gemini-action-plan';

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

// Real extraction using Gemini API
export async function extractWithGemini(
  judgmentText: string,
  onFieldExtracted?: (field: ExtractionField, index: number) => void,
  onComplete?: (result: ExtractionResult) => void
): Promise<ExtractionResult> {
  try {
    const actionPlan = await generateActionPlan(judgmentText);
    
    // Extract metadata from the judgment text
    const extractedFields = extractMetadataFields(judgmentText, actionPlan);
    
    // Animate field extraction
    if (onFieldExtracted) {
      for (let i = 0; i < extractedFields.length; i++) {
        await delay(randomBetween(200, 400));
        onFieldExtracted(extractedFields[i], i);
      }
    }

    await delay(500);

    const result: ExtractionResult = {
      fields: extractedFields,
      summary: actionPlan.summary,
      keyDirections: actionPlan.keyDirections,
      suggestedSteps: actionPlan.actionSteps,
      overallConfidence: 85,
      actionType: 'compliance',
      priority: actionPlan.priority,
      deadline: actionPlan.deadline,
      responsibleDepartment: actionPlan.department,
    };

    if (onComplete) {
      onComplete(result);
    }

    return result;
  } catch (error) {
    console.error('Gemini extraction error:', error);
    throw error;
  }
}

// Helper function to extract metadata from judgment text
function extractMetadataFields(
  judgmentText: string,
  actionPlan: ActionPlanResponse
): ExtractionField[] {
  const fields: ExtractionField[] = [];

  // Case Number extraction
  const caseNumberMatch = judgmentText.match(/(?:W\.P|C\.A|S\.L\.P)\s*(?:\(C\))?\s*No\.?\s*([^\n]+)/i);
  if (caseNumberMatch) {
    fields.push({
      fieldName: 'Case Number',
      value: caseNumberMatch[1].trim(),
      confidenceScore: 95,
    });
  }

  // Court Name
  const courtMatch = judgmentText.match(/IN THE\s+([^AT]*?)AT/i);
  if (courtMatch) {
    fields.push({
      fieldName: 'Court Name',
      value: courtMatch[1].trim(),
      confidenceScore: 98,
    });
  }

  // Judge extraction
  const judgeMatch = judgmentText.match(/(?:HON.?BLE|HONOURABLE)\s+(?:MR\.?\s+|MRS\.?\s+)?(?:JUSTICE|J\.)\s+([^\n]+)/i);
  if (judgeMatch) {
    fields.push({
      fieldName: 'Judge',
      value: judgeMatch[1].trim(),
      confidenceScore: 92,
    });
  }

  // Date extraction
  const dateMatch = judgmentText.match(/Pronounced on:\s*([^\n]+)|(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)[^,]*,?\s*\d{4})/i);
  if (dateMatch) {
    fields.push({
      fieldName: 'Date of Order',
      value: (dateMatch[1] || dateMatch[2]).trim(),
      confidenceScore: 90,
    });
  }

  // Department from action plan
  fields.push({
    fieldName: 'Department',
    value: actionPlan.department,
    confidenceScore: 88,
  });

  // Deadline
  fields.push({
    fieldName: 'Deadline',
    value: actionPlan.deadline,
    confidenceScore: 85,
  });

  // Priority
  fields.push({
    fieldName: 'Priority',
    value: actionPlan.priority.toUpperCase(),
    confidenceScore: 90,
  });

  return fields;
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
