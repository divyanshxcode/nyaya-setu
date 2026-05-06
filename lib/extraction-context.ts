import { createContext, useContext } from 'react';
import type {
  CaseExtractionState,
  ExtractedCaseDetail,
  ExtractedFieldWithMeta,
  GeneratedActionPlan,
  ReviewStatus,
  ExtractionStep,
} from '@/types';

export interface ExtractionContextType {
  // State
  currentStep: ExtractionStep;
  extraction: CaseExtractionState | null;
  actionPlan: GeneratedActionPlan | null;
  isLoading: boolean;
  error: string | null;

  // Step 1: File Upload
  setFile: (file: File) => void;
  clearFile: () => void;

  // Step 2: Extraction & Review
  setRawPdfText: (text: string) => void;
  setExtractedDetails: (details: ExtractedCaseDetail) => void;
  setExtractedFieldsWithMeta: (fields: ExtractedFieldWithMeta[]) => void;
  updateFieldValue: (fieldKey: keyof ExtractedCaseDetail, editedValue: string) => void;
  
  // Review controls
  approveExtraction: (reviewerNotes?: string) => Promise<void>;
  approveWithEdits: (reviewerNotes?: string) => Promise<void>;
  rejectExtraction: (reason: string) => Promise<void>;
  
  // Step 3: Action Plan
  generateActionPlan: () => Promise<void>;
  updateActionItemStatus: (actionId: string, status: string) => void;
  updateActionItemAssignee: (actionId: string, assignee: string) => void;
  updateActionItemDeadline: (actionId: string, deadline: string) => void;

  // Navigation
  goToStep: (step: ExtractionStep) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;

  // Export
  exportActionPlanPDF: () => Promise<void>;
  exportActionPlanJSON: () => void;

  // Reset
  reset: () => void;
}

export const ExtractionContext = createContext<ExtractionContextType | undefined>(undefined);

export function useExtraction() {
  const context = useContext(ExtractionContext);
  if (!context) {
    throw new Error('useExtraction must be used within ExtractionProvider');
  }
  return context;
}
