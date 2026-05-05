import { Case, Department, ActivityEvent } from "./types";

export const mockDepartments: Department[] = [
  { id: "dept-pwd", name: "Public Works Department", activeCases: 82, pendingReview: 14, overdue: 3, complied: 51 },
  { id: "dept-rev", name: "Revenue Department", activeCases: 145, pendingReview: 28, overdue: 12, complied: 89 },
  { id: "dept-edu", name: "Education Department", activeCases: 64, pendingReview: 5, overdue: 1, complied: 42 },
  { id: "dept-health", name: "Health & Family Welfare", activeCases: 42, pendingReview: 8, overdue: 2, complied: 25 },
  { id: "dept-fin", name: "Finance Department", activeCases: 38, pendingReview: 2, overdue: 0, complied: 30 },
  { id: "dept-urban", name: "Urban Development", activeCases: 112, pendingReview: 19, overdue: 7, complied: 76 },
  { id: "dept-forest", name: "Forest Department", activeCases: 29, pendingReview: 4, overdue: 1, complied: 18 },
];

export const mockCases: Case[] = [
  {
    id: "case-1",
    caseNumber: "WP No. 4521/2024",
    title: "State of Karnataka v/s M/s Apex Constructions Ltd",
    court: "High Court of Karnataka",
    dateOfOrder: "2025-03-15T00:00:00Z",
    petitioner: "State of Karnataka",
    respondent: "M/s Apex Constructions Ltd",
    judges: "Hon. Justice A.K. Sharma",
    status: "PENDING_REVIEW",
    priority: "HIGH",
    departmentId: "dept-pwd",
    assignedTo: { name: "Rajesh Kumar" },
    extractedFields: {
      caseInformation: [
        { label: "Case Number", value: "WP No. 4521/2024", confidence: 98, sourceRef: "page1-para1", verified: true },
        { label: "Date of Order", value: "15 March 2025", confidence: 97, sourceRef: "page1-para2", verified: true },
        { label: "Petitioner", value: "State of Karnataka", confidence: 95, sourceRef: "page1-para3", verified: true },
        { label: "Respondent", value: "M/s Apex Constructions Ltd", confidence: 94, sourceRef: "page1-para4", verified: true },
        { label: "Judges", value: "Hon. Justice A.K. Sharma", confidence: 92, sourceRef: "page1-para5", verified: true },
      ],
      keyDirections: [
        { label: "Direction 1", value: "The respondent shall submit the revised compliance report reflecting the recent ecological survey.", confidence: 91, sourceRef: "page3-para1", verified: true },
        { label: "Direction 2", value: "The concerned department must disburse the withheld payments within 4 weeks.", confidence: 87, sourceRef: "page3-para2", verified: false, needsEdit: true },
      ],
      timelines: [
        { label: "Compliance by", value: "12 April 2025", confidence: 89, sourceRef: "page4-para1", verified: true },
        { label: "Appeal deadline", value: "13 June 2025", confidence: 85, sourceRef: "page4-para2", verified: false, needsEdit: true },
      ]
    },
    actionPlan: {
      actionType: "COMPLIANCE",
      priority: "HIGH",
      departmentId: "dept-pwd",
      deadline: "2025-04-12T00:00:00Z",
      steps: [
        { id: "step-1", description: "Notify concerned PWD division immediately." },
        { id: "step-2", description: "Prepare the revised compliance report." },
        { id: "step-3", description: "Submit report to the court registry." },
      ],
      appealRecommendation: "NOT_RECOMMENDED",
      aiReasoning: "The court order appears straightforward with clear compliance directives. Appeal grounds are weak based on precedent analysis.",
      reviewerNotes: ""
    }
  },
  {
    id: "case-2",
    caseNumber: "WA No. 1289/2023",
    title: "Venkatesh Rao v/s Revenue Dept",
    court: "High Court of Karnataka",
    dateOfOrder: "2025-03-20T00:00:00Z",
    petitioner: "Venkatesh Rao",
    respondent: "Revenue Department, Govt of Karnataka",
    judges: "Hon. Justice M.N. Venugopal",
    status: "VERIFIED",
    priority: "CRITICAL",
    departmentId: "dept-rev",
    actionPlan: {
      actionType: "APPEAL",
      priority: "CRITICAL",
      departmentId: "dept-rev",
      deadline: "2025-04-05T00:00:00Z",
      steps: [
        { id: "step-1", description: "Draft Special Leave Petition." },
        { id: "step-2", description: "Seek approval from Law Department." }
      ],
      appealRecommendation: "RECOMMENDED",
      aiReasoning: "The judgment contradicts the recent amendment to Section 45 of the Land Revenue Act.",
      reviewerNotes: "Verified by legal cell. Appeal is necessary to prevent significant financial loss to the state."
    }
  },
  {
    id: "case-3",
    caseNumber: "WP No. 8832/2024",
    title: "Global Tech Parks v/s Urban Development",
    court: "High Court of Karnataka",
    dateOfOrder: "2025-02-10T00:00:00Z",
    petitioner: "Global Tech Parks",
    respondent: "Urban Development Dept",
    judges: "Hon. Justice S. Patil",
    status: "OVERDUE",
    priority: "MEDIUM",
    departmentId: "dept-urban",
    actionPlan: {
      actionType: "COMPLIANCE",
      priority: "MEDIUM",
      departmentId: "dept-urban",
      deadline: "2025-03-10T00:00:00Z", // Past date
      steps: [
        { id: "step-1", description: "Issue the revised zoning certificate." }
      ],
      appealRecommendation: "NOT_RECOMMENDED",
      aiReasoning: "Standard procedural compliance requested by the court.",
      reviewerNotes: "Delayed due to pending environmental clearance."
    }
  },
  {
    id: "case-4",
    caseNumber: "PIL No. 45/2025",
    title: "Citizens for Clean Air v/s State",
    court: "High Court of Karnataka",
    dateOfOrder: "2025-04-01T00:00:00Z",
    petitioner: "Citizens for Clean Air (NGO)",
    respondent: "Health & Family Welfare Dept",
    judges: "Hon. Chief Justice",
    status: "PROCESSING",
    priority: "HIGH",
    departmentId: "dept-health",
  },
  {
    id: "case-5",
    caseNumber: "WP No. 1102/2024",
    title: "Teachers Association v/s Education Dept",
    court: "High Court of Karnataka",
    dateOfOrder: "2025-03-25T00:00:00Z",
    petitioner: "Karnataka State Teachers Association",
    respondent: "Education Department",
    judges: "Hon. Justice R. Devadas",
    status: "PENDING_REVIEW",
    priority: "MEDIUM",
    departmentId: "dept-edu",
    assignedTo: { name: "Priya S." },
  }
];

export const mockActivities: ActivityEvent[] = [
  { id: "act-1", caseId: "WP No. 4521/2024", type: "UPLOAD", description: "Judgment uploaded for Case #WP-2024-4521", user: "System", timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: "act-2", caseId: "WA No. 1289/2023", type: "VERIFIED", description: "Action plan verified and approved", user: "Rajesh Kumar", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: "act-3", caseId: "WP No. 8832/2024", type: "ESCALATED", description: "Marked as OVERDUE", user: "System", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  { id: "act-4", caseId: "WP No. 1102/2024", type: "UPLOAD", description: "Judgment uploaded via High Court API", user: "System", timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
];
