'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type {
  CaseExtractionState,
  ExtractedCaseDetail,
  ExtractedFieldWithMeta,
  GeneratedActionPlan,
  ExtractionStep,
} from '@/types';
import { ExtractionContext, type ExtractionContextType } from './extraction-context';
import { extractTextFromPDF } from './pdf-extractor';
import { extractCaseDetailsFromGemini, generateComprehensiveActionPlan } from './gemini-api-service';
import { toast } from 'sonner';

interface ExtractionProviderProps {
  children: React.ReactNode;
}

export function ExtractionProvider({ children }: ExtractionProviderProps) {
  const [currentStep, setCurrentStep] = useState<ExtractionStep>(1);
  const [extraction, setExtraction] = useState<CaseExtractionState | null>(null);
  const [actionPlan, setActionPlan] = useState<GeneratedActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldExtract, setShouldExtract] = useState(false);
  const pdfFileRef = useRef<File | null>(null);
  const extractionInFlightRef = useRef(false);
  const actionPlanInFlightRef = useRef(false);

  // Listen for fallback data events
  useEffect(() => {
    const handleFallbackData = (event: Event) => {
      const customEvent = event as CustomEvent;
      const message = customEvent.detail?.message || 'Using sample data due to service unavailability';
      console.warn('⚠️ Fallback data used:', message);
      toast.warning(message, {
        description: 'AI service is temporarily unavailable. Please verify the extracted data before proceeding.',
        duration: 5000,
      });
    };

    window.addEventListener('fallback-data-used', handleFallbackData);
    return () => window.removeEventListener('fallback-data-used', handleFallbackData);
  }, []);

  // Step 1: File Upload
  const setFile = useCallback((file: File) => {
    console.log('📤 setFile called with:', file.name, file.type, file.size);
    pdfFileRef.current = file;
    setError(null);
    setActionPlan(null);
    setExtraction(null); // Reset extraction
    setShouldExtract(true); // Trigger extraction
    console.log('✅ File set, shouldExtract triggered');
  }, []);

  const clearFile = useCallback(() => {
    pdfFileRef.current = null;
    setExtraction(null);
    setActionPlan(null);
    setCurrentStep(1);
    setError(null);
  }, []);

  // Step 2: Extraction & Review
  const setRawPdfText = useCallback((text: string) => {
    setExtraction(prev => {
      if (!prev) return null;
      return { ...prev, rawPdfText: text };
    });
  }, []);

  const setExtractedDetails = useCallback((details: ExtractedCaseDetail) => {
    setExtraction(prev => {
      if (!prev) return null;
      return { ...prev, extractedDetails: details };
    });
  }, []);

  const setExtractedFieldsWithMeta = useCallback((fields: ExtractedFieldWithMeta[]) => {
    setExtraction(prev => {
      if (!prev) return null;
      return { ...prev, extractedFieldsWithMeta: fields };
    });
  }, []);

  const updateFieldValue = useCallback(
    (fieldKey: keyof ExtractedCaseDetail, editedValue: string) => {
      setExtraction(prev => {
        if (!prev) return null;
        
        // Update the field in extractedFieldsWithMeta
        const updatedFields = prev.extractedFieldsWithMeta.map(field => {
          if (field.fieldKey === fieldKey) {
            return {
              ...field,
              isEdited: true,
              editedValue: editedValue,
            };
          }
          return field;
        });

        // Update the extracted details
        const updatedDetails = prev.extractedDetails ? { ...prev.extractedDetails } : null;
        if (updatedDetails) {
          updatedDetails[fieldKey] = editedValue;
        }

        return {
          ...prev,
          extractedFieldsWithMeta: updatedFields,
          extractedDetails: updatedDetails || prev.extractedDetails,
        };
      });
    },
    []
  );

  const approveExtraction = useCallback(async (reviewerNotes?: string) => {
    setExtraction(prev => {
      if (!prev) return null;
      return {
        ...prev,
        reviewStatus: 'approved',
        reviewerNotes: reviewerNotes,
        reviewedAt: new Date().toISOString(),
      };
    });
  }, []);

  const approveWithEdits = useCallback(async (reviewerNotes?: string) => {
    setExtraction(prev => {
      if (!prev) return null;
      return {
        ...prev,
        reviewStatus: 'approved_with_edits',
        reviewerNotes: reviewerNotes,
        reviewedAt: new Date().toISOString(),
      };
    });
  }, []);

  const rejectExtraction = useCallback(async (reason: string) => {
    setExtraction(prev => {
      if (!prev) return null;
      return {
        ...prev,
        reviewStatus: 'rejected',
        reviewerNotes: reason,
      };
    });
    setCurrentStep(2); // Stay at step 2 to allow re-review
  }, []);

  // Step 3: Action Plan
  const generateActionPlan = useCallback(async () => {
    if (!extraction?.extractedDetails) {
      setError('No extracted details available for plan generation');
      return;
    }

    if (actionPlan || actionPlanInFlightRef.current) {
      setCurrentStep(3);
      return;
    }

    try {
      actionPlanInFlightRef.current = true;
      setIsLoading(true);
      setError(null);

      const plan = await generateComprehensiveActionPlan(
        extraction.extractedDetails,
        extraction.rawPdfText
      );

      setActionPlan(plan);
      setCurrentStep(3);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate action plan';
      setError(message);
    } finally {
      actionPlanInFlightRef.current = false;
      setIsLoading(false);
    }
  }, [extraction, actionPlan]);

  const updateActionItemStatus = useCallback((actionId: string, status: string) => {
    setActionPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        actionItems: prev.actionItems.map(item =>
          item.id === actionId ? { ...item, status: status as any } : item
        ),
      };
    });
  }, []);

  const updateActionItemAssignee = useCallback((actionId: string, assignee: string) => {
    setActionPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        actionItems: prev.actionItems.map(item =>
          item.id === actionId ? { ...item, responsibleParty: assignee } : item
        ),
      };
    });
  }, []);

  const updateActionItemDeadline = useCallback((actionId: string, deadline: string) => {
    setActionPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        actionItems: prev.actionItems.map(item =>
          item.id === actionId ? { ...item, deadline } : item
        ),
      };
    });
  }, []);

  // Navigation
  const goToStep = useCallback((step: ExtractionStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(async () => {
    // If moving from Step 2 to Step 3, generate action plan first
    if (currentStep === 2 && extraction?.extractedDetails && !actionPlan) {
      await generateActionPlan();
    } else {
      // For other steps, just advance
      setCurrentStep(prev => (prev < 3 ? (prev + 1) as ExtractionStep : prev));
    }
  }, [currentStep, extraction, actionPlan, generateActionPlan]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => (prev > 1 ? (prev - 1) as ExtractionStep : prev));
  }, []);

  // Export
  const exportActionPlanPDF = useCallback(async () => {
    if (!actionPlan) {
      setError('No action plan to export');
      return;
    }
    
    try {
      const { generateActionPlanHTML, exportToPDF } = await import('./export-utils');
      const html = generateActionPlanHTML(actionPlan, extraction?.extractedDetails ?? undefined);
      exportToPDF(html, `action-plan-${actionPlan.id}.pdf`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to export PDF';
      setError(message);
    }
  }, [actionPlan, extraction]);

  const exportActionPlanJSON = useCallback(() => {
    if (!actionPlan) {
      setError('No action plan to export');
      return;
    }
    const dataStr = JSON.stringify(actionPlan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `action-plan-${actionPlan.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [actionPlan]);

  // Reset
  const reset = useCallback(() => {
    setCurrentStep(1);
    setExtraction(null);
    setActionPlan(null);
    setError(null);
    pdfFileRef.current = null;
  }, []);

  // Debug logging
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔍 Extraction State:', {
        currentStep,
        extraction: extraction ? { id: extraction.id, reviewStatus: extraction.reviewStatus, hasPdf: !!extraction.pdfFile, hasDetails: !!extraction.extractedDetails } : null,
        isLoading,
        error,
      });
    }
  }, [currentStep, extraction, isLoading, error]);

  // Initialize extraction state when file is set
  React.useEffect(() => {
    console.log('🔄 useEffect triggered - shouldExtract:', shouldExtract, 'pdfFileRef:', !!pdfFileRef.current, 'extraction:', !!extraction);
    let isMounted = true;

    const initializeExtraction = async () => {
      console.log('🚀 initializeExtraction started');
      const file = pdfFileRef.current;

      if (!file || extraction || extractionInFlightRef.current) {
        console.log('❌ Stopping extraction: pdfFileRef.current:', !!pdfFileRef.current, 'extraction:', !!extraction);
        setShouldExtract(false);
        return;
      }

      try {
        extractionInFlightRef.current = true;
        setIsLoading(true);
        setError(null);
        console.log('📄 Extracting text from PDF:', file.name);

        const pendingExtraction: CaseExtractionState = {
          id: `extraction-${Date.now()}`,
          step: 1,
          pdfFile: file,
          rawPdfText: '',
          extractedDetails: null,
          extractedFieldsWithMeta: [],
          reviewStatus: 'pending_review',
          createdAt: new Date().toISOString(),
        };

        setExtraction(pendingExtraction);

        // Extract text from PDF
        const pdfText = await extractTextFromPDF(file);

        if (!isMounted) {
          console.log('⚠️ Component unmounted, skipping state update');
          return;
        }

        console.log('✅ PDF text extracted:', pdfText.substring(0, 100) + '...');

        // Initialize extraction state
        const newExtraction: CaseExtractionState = {
          ...pendingExtraction,
          step: 2,
          rawPdfText: pdfText,
        };

        setExtraction(newExtraction);
        console.log('🔧 Extraction state initialized, calling Gemini API...');

        // Proceed with extraction from Gemini
        const { details, fieldsWithMeta } = await extractCaseDetailsFromGemini(pdfText);

        if (!isMounted) {
          console.log('⚠️ Component unmounted after Gemini call, skipping state update');
          return;
        }

        console.log('✅ Gemini API response received, updating state');
        
        setExtraction(prev => {
          if (!prev) return null;
          return {
            ...prev,
            extractedDetails: details,
            extractedFieldsWithMeta: fieldsWithMeta,
          };
        });

        console.log('✅ Extraction completed, advancing to Step 2');
        setCurrentStep(2);
      } catch (err) {
        if (!isMounted) {
          console.log('⚠️ Component unmounted after error, skipping state update');
          return;
        }
        const message = err instanceof Error ? err.message : 'Failed to extract PDF';
        console.error('❌ Extraction error:', message, err);
        setError(message);
        setCurrentStep(1);
      } finally {
        extractionInFlightRef.current = false;
        if (isMounted) {
          setIsLoading(false);
          setShouldExtract(false);
          console.log('🏁 Extraction process finished');
        }
      }
    };

    if (shouldExtract && pdfFileRef.current && !extraction) {
      console.log('🎯 Conditions met, calling initializeExtraction');
      initializeExtraction();
    }

    return () => {
      console.log('🧹 Cleanup: unmounting extraction effect');
      isMounted = false;
    };
  }, [shouldExtract]);

  const value: ExtractionContextType = {
    currentStep,
    extraction,
    actionPlan,
    isLoading,
    error,
    setFile,
    clearFile,
    setRawPdfText,
    setExtractedDetails,
    setExtractedFieldsWithMeta,
    updateFieldValue,
    approveExtraction,
    approveWithEdits,
    rejectExtraction,
    generateActionPlan,
    updateActionItemStatus,
    updateActionItemAssignee,
    updateActionItemDeadline,
    goToStep,
    nextStep,
    prevStep,
    exportActionPlanPDF,
    exportActionPlanJSON,
    reset,
  };

  return (
    <ExtractionContext.Provider value={value}>
      {children}
    </ExtractionContext.Provider>
  );
}
