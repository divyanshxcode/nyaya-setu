export type CaseStatus = 'active' | 'disposed' | 'appeal' | 'complied' | 'overdue';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type ReviewStatus = 'pending_review' | 'approved' | 'approved_with_edits' | 'rejected' | 'needs_edit';
export type ActionType = 'compliance' | 'appeal' | 'review' | 'internal_order';
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'escalated';
export type ExtractionStep = 1 | 2 | 3 | 4;

// ============ STEP 2: CASE DETAIL EXTRACTION ============

export interface ExtractedCaseDetail {
  caseNumber: string;
  court: string;
  judge: string;
  jurisdiction: string;
  dateOfOrder: string;
  defendant: string;
  plaintiff: string;
  natureOfCase: string;
  caseDetails: string;
  keyDirectionsOrOrders: string;
  partiesInvolved: string;
  relevantTimelines: string;
  nextHearingDate: string;
  penaltiesOrConsequences: string;
  legalSections: string;
  additionalRemarks: string;
}

export interface ExtractedFieldWithMeta {
  fieldKey: keyof ExtractedCaseDetail;
  fieldLabel: string;
  value: string;
  confidenceScore: number; // 0-100
  sourceText: string; // Exact excerpt from PDF
  sourcePageNumber?: number;
  sourceBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isEdited?: boolean;
  editedValue?: string;
}

export interface CaseExtractionState {
  id: string;
  step: ExtractionStep;
  pdfFile: File | null;
  rawPdfText: string;
  extractedDetails: ExtractedCaseDetail | null;
  extractedFieldsWithMeta: ExtractedFieldWithMeta[];
  reviewStatus: ReviewStatus;
  reviewerNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

// ============ STEP 3: ACTION PLAN GENERATION ============

export interface ComplianceRequirement {
  id: string;
  description: string;
  legalBasis: string;
  priority: Priority;
  deadline?: string;
  responsibleDepartment: string;
  responsibleParty?: string;
  status: ActionStatus;
}

export interface AppealConsideration {
  groundsForAppeal: string[];
  likelihoodOfSuccess: 'low' | 'medium' | 'high';
  reasoning: string;
  recommendedNextSteps: string[];
  deadlineForFiling?: string;
}

export interface TimelineEvent {
  date: string;
  description: string;
  isExplicit: boolean; // true if mentioned in order, false if inferred
  type: 'hearing' | 'deadline' | 'milestone' | 'other';
}

export interface RiskAssessment {
  nonComplianceRisks: string[];
  financialExposure?: string;
  reputationalRisk: string;
  escalationRisks: string[];
}

export interface DocumentationRequirement {
  documentType: string;
  purpose: string;
  deadline?: string;
  priority: Priority;
}

export interface ExternalCounselInstruction {
  priority: string;
  instruction: string;
  deadline?: string;
}

export interface StakeholderCommunication {
  stakeholder: string;
  message: string;
  communicationChannel: string;
  priority: Priority;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  deadline?: string;
  responsibleParty: string;
  status: ActionStatus;
  section: 'compliance' | 'appeal' | 'timeline' | 'risk' | 'documentation' | 'external' | 'internal';
}

export interface GeneratedActionPlan {
  id: string;
  executiveSummary: string;
  complianceRequirements: ComplianceRequirement[];
  appealConsiderations: AppealConsideration;
  keyTimelines: TimelineEvent[];
  riskAssessment: RiskAssessment;
  recommendedDocumentation: DocumentationRequirement[];
  externalCounselInstructions: ExternalCounselInstruction[];
  internalCommunicationPlan: StakeholderCommunication[];
  actionItems: ActionItem[];
  generatedAt: string;
  generatedBy?: string;
}

// ============ UNIFIED CASE STATE ============

export interface CourtCase {
  id: string;
  caseNumber: string;
  courtName: string;
  benchName: string;
  judgeName: string;
  dateOfOrder: string;
  petitioner: string;
  respondent: string;
  department: string;
  status: CaseStatus;
  priority: Priority;
  extractionState?: CaseExtractionState;
  judgment?: JudgmentExtraction;
  actionPlan?: ActionPlan;
  reviewStatus: ReviewStatus;
  createdAt: string;
  deadlineDate?: string;
}

// ============ LEGACY INTERFACES (kept for compatibility) ============

export interface JudgmentExtraction {
  id: string;
  caseId: string;
  rawPdfUrl: string;
  ocrText: string;
  extractedFields: ExtractedField[];
  summary: string;
  keyDirections: string[];
  mentionedDeadlines: DeadlineItem[];
  departmentsInvolved: string[];
  appealObservation?: string;
  finalDecision: string;
  confidenceScore: number;
  extractedAt: string;
}

export interface ExtractedField {
  fieldName: string;
  value: string;
  confidenceScore: number;
  sourceHighlight: {
    pageNumber: number;
    boundingBox: { x: number; y: number; width: number; height: number };
    text: string;
  };
}

export interface ActionPlan {
  id: string;
  caseId: string;
  actionType: ActionType;
  priority: Priority;
  responsibleDepartment: string;
  responsibleOfficer?: string;
  lastDateForAction: string;
  summary: string;
  suggestedSteps: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  approvedBy?: string;
  approvedAt?: string;
}

export interface DeadlineItem {
  description: string;
  date: string;
  daysRemaining: number;
  isUrgent: boolean;
}

export interface ReviewRecord {
  id: string;
  caseId: string;
  caseName: string;
  extractionId: string;
  assignedTo: string;
  status: ReviewStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  editsMade?: number;
  confidenceScore: number;
  fieldsCount: number;
  deadline?: string;
}

export interface Department {
  id: string;
  name: string;
  shortCode: string;
  totalCases: number;
  pendingActions: number;
  overdueActions: number;
  complianceRate: number;
}

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: 'Reviewer' | 'Officer' | 'Admin';
  avatar?: string;
}

export interface ActivityItem {
  id: string;
  type: 'approved' | 'rejected' | 'uploaded' | 'deadline_alert' | 'review_started';
  description: string;
  timestamp: string;
  user: {
    name: string;
    initials: string;
  };
  caseNumber?: string;
}

export interface OcrResult {
  text: string;
  pageCount: number;
  wordCount: number;
  confidenceScore: number;
}
