export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type CaseStatus = 
  | "PENDING_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLIED"
  | "APPEALED"
  | "OVERDUE";

export interface Department {
  id: string;
  name: string;
  activeCases: number;
  pendingReview: number;
  overdue: number;
  complied: number;
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  sourceRef: string;
  verified: boolean;
  needsEdit?: boolean;
}

export interface ActionStep {
  id: string;
  description: string;
}

export interface ActionPlan {
  actionType: "COMPLIANCE" | "APPEAL";
  priority: Priority;
  departmentId: string;
  deadline: string; // ISO Date String
  steps: ActionStep[];
  appealRecommendation: "RECOMMENDED" | "NOT_RECOMMENDED";
  aiReasoning: string;
  reviewerNotes: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  dateOfOrder: string; // ISO Date String
  petitioner: string;
  respondent: string;
  judges: string;
  status: CaseStatus;
  priority: Priority;
  departmentId: string;
  extractedFields?: {
    caseInformation: ExtractedField[];
    keyDirections: ExtractedField[];
    timelines: ExtractedField[];
  };
  actionPlan?: ActionPlan;
  assignedTo?: {
    name: string;
    avatarUrl?: string;
  };
}

export interface ActivityEvent {
  id: string;
  caseId: string;
  type: "UPLOAD" | "VERIFIED" | "REJECTED" | "EDITED" | "ESCALATED";
  description: string;
  user: string;
  timestamp: string; // ISO Date String
}
