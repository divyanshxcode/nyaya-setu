export type CaseStatus = 'active' | 'disposed' | 'appeal' | 'complied' | 'overdue';
export type Priority = 'high' | 'medium' | 'low';
export type ReviewStatus = 'pending_review' | 'approved' | 'rejected' | 'needs_edit';
export type ActionType = 'compliance' | 'appeal' | 'review' | 'internal_order';

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
  judgment?: JudgmentExtraction;
  actionPlan?: ActionPlan;
  reviewStatus: ReviewStatus;
  createdAt: string;
  deadlineDate?: string;
}

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
  editsMade: number;
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
