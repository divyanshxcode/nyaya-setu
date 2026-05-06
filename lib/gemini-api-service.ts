import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  ExtractedCaseDetail,
  ExtractedFieldWithMeta,
  GeneratedActionPlan,
  Priority,
} from '@/types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Fallback mock data for when Gemini API is unavailable
function getMockCaseDetails(): ExtractedCaseDetail {
  return {
    caseNumber: 'CIVIL APPEAL NOS.7527-7528 OF 2012',
    court: 'IN THE SUPREME COURT OF INDIA',
    judge: 'PANKAJ MITHAL, J.; DIPANKAR DATTA, J.',
    jurisdiction: 'CIVIL APPELLATE JURISDICTION',
    dateOfOrder: '2012-11-15',
    defendant: 'STATE OF MAHARASHTRA & ANR.',
    plaintiff: 'YOGENDRA RATHI & ORS.',
    natureOfCase: 'Civil Appeal arising from judgment in Contempt Petition',
    caseDetails: 'Appeal against an order passed by the High Court. The matter involves interpretation of contract and statutory obligations under land acquisition laws.',
    keyDirectionsOrOrders: 'The Court directed compliance with previous orders. The case involves review of administrative decisions and property rights.',
    partiesInvolved: 'YOGENDRA RATHI (Appellant) vs STATE OF MAHARASHTRA & ANR. (Respondent)',
    relevantTimelines: 'Petition filed: 2010-05-20. Hearing: 2012-11-10. Order passed: 2012-11-15',
    nextHearingDate: 'Matter disposed of. No further hearings scheduled.',
    penaltiesOrConsequences: 'Costs imposed as per Court order. Parties liable for compliance.',
    legalSections: 'Articles 226, 227 of the Constitution of India; Land Acquisition Act, 1894',
    additionalRemarks: 'SAMPLE DATA: Gemini API was unavailable. This is mock data for demonstration.',
  };
}

function getMockFieldsWithMeta(): ExtractedFieldWithMeta[] {
  const details = getMockCaseDetails();
  const fieldLabels: Record<keyof ExtractedCaseDetail, string> = {
    caseNumber: 'Case Number',
    court: 'Court',
    judge: 'Judge',
    jurisdiction: 'Jurisdiction',
    dateOfOrder: 'Date of Order',
    defendant: 'Defendant',
    plaintiff: 'Plaintiff',
    natureOfCase: 'Nature of Case',
    caseDetails: 'Case Details',
    keyDirectionsOrOrders: 'Key Directions / Orders',
    partiesInvolved: 'Parties Involved',
    relevantTimelines: 'Relevant Timelines',
    nextHearingDate: 'Next Hearing Date',
    penaltiesOrConsequences: 'Penalties / Consequences',
    legalSections: 'Legal Sections Cited',
    additionalRemarks: 'Additional Remarks',
  };

  return Object.entries(details).map(([key, value]) => ({
    fieldKey: key as keyof ExtractedCaseDetail,
    fieldLabel: fieldLabels[key as keyof ExtractedCaseDetail],
    value,
    confidenceScore: 65, // Lower confidence for mock data
    sourceText: 'Mock data - Gemini API unavailable',
    isEdited: false,
  }));
}

function getMockActionPlan(): GeneratedActionPlan {
  return {
    id: `plan-${Date.now()}`,
    executiveSummary:
      'Sample action plan generated because the AI service is unavailable. Review the extracted order, identify mandatory compliance steps, and assign owners before relying on this plan.',
    complianceRequirements: [
      {
        id: '1',
        description: 'Verify compliance with the Supreme Court order within 30 days.',
        legalBasis: 'Directions identified in the uploaded court order',
        priority: 'critical',
        deadline: toIsoDateFromNow(30),
        responsibleDepartment: 'Legal Department',
        status: 'pending',
      },
      {
        id: '2',
        description: 'File necessary documentation with the court registry.',
        legalBasis: 'Court registry compliance requirements',
        priority: 'critical',
        deadline: toIsoDateFromNow(15),
        responsibleDepartment: 'Compliance Office',
        status: 'pending',
      },
    ],
    appealConsiderations: {
      groundsForAppeal: [
        'Review the judgment for procedural, factual, or legal grounds before taking a position.',
      ],
      likelihoodOfSuccess: 'medium',
      reasoning:
        'This is sample guidance because the AI service was unavailable. A qualified legal review is required.',
      recommendedNextSteps: [
        'Consult senior counsel',
        'Confirm limitation period',
        'Prepare a short appeal merits note',
      ],
    },
    keyTimelines: [
      {
        date: toIsoDateFromNow(0),
        description: 'Supreme Court passed order',
        isExplicit: true,
        type: 'milestone',
      },
      {
        date: toIsoDateFromNow(30),
        description: 'Final deadline for compliance',
        isExplicit: false,
        type: 'deadline',
      },
    ],
    riskAssessment: {
      nonComplianceRisks: [
        'Non-compliance with court order may lead to contempt proceedings',
        'Failure to file required documents may prejudice legal position',
      ],
      financialExposure: 'To be assessed after reviewing the operative directions.',
      reputationalRisk: 'Potential reputational exposure if court directions are missed.',
      escalationRisks: ['Contempt risk', 'Adverse procedural consequences'],
    },
    recommendedDocumentation: [
      {
        documentType: 'Affidavit of Compliance',
        purpose: 'To certify compliance with court directions',
        deadline: toIsoDateFromNow(25),
        priority: 'high',
      },
    ],
    externalCounselInstructions: [
      {
        priority: 'high',
        instruction:
          'Review the uploaded order, verify compliance obligations, and advise on appeal or review options.',
        deadline: toIsoDateFromNow(3),
      },
    ],
    internalCommunicationPlan: [
      {
        stakeholder: 'Legal, Compliance, Administration, Finance',
        message: 'Conduct an immediate compliance kickoff and circulate weekly status updates.',
        communicationChannel: 'Email and review meeting',
        priority: 'high',
      },
    ],
    actionItems: [
      {
        id: 'a1',
        title: 'Review Supreme Court order and prepare implementation plan',
        description: 'Analyze the full order and prepare detailed action points',
        priority: 'critical',
        status: 'pending',
        deadline: toIsoDateFromNow(3),
        responsibleParty: 'Lead Counsel',
        section: 'compliance',
      },
      {
        id: 'a2',
        title: 'Prepare affidavit of compliance',
        description: 'Draft detailed affidavit documenting all steps taken',
        priority: 'high',
        status: 'pending',
        deadline: toIsoDateFromNow(20),
        responsibleParty: 'Compliance Officer',
        section: 'documentation',
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

function toIsoDateFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

function normalizePriority(priority: unknown): Priority {
  const value = String(priority || 'medium').toLowerCase();
  return ['critical', 'high', 'medium', 'low'].includes(value) ? (value as Priority) : 'medium';
}

function ensureArray<T = string>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === 'string' && value.trim()) return [value as T];
  return [];
}

/**
 * STEP 2A: Extract structured case details from raw PDF text using Gemini
 */
export async function extractCaseDetailsFromGemini(
  rawPdfText: string
): Promise<{
  details: ExtractedCaseDetail;
  fieldsWithMeta: ExtractedFieldWithMeta[];
  isUsingFallback?: boolean;
}> {
  try {
    console.log('🔗 Calling Gemini API (gemini-3-flash-preview) with', rawPdfText.length, 'characters');
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const systemPrompt = `You are a legal document parser. From the following court order text, extract the exact information for each of the fields listed below. Do not summarize or paraphrase. Use verbatim text from the document wherever possible. If a field is not found, return "Not Found". Return a JSON object with these exact keys and additional metadata for each field.`;

    const prompt = `${systemPrompt}

Court order text:
${rawPdfText}

Extract the following fields and return a JSON object with:
1. The extracted values
2. A "confidenceScore" (0-100) for each field
3. A "sourceText" field with the exact excerpt from the document that supports each value

Return ONLY valid JSON (no markdown, no code blocks):
{
  "caseNumber": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "court": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "judge": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "jurisdiction": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "dateOfOrder": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "defendant": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "plaintiff": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "natureOfCase": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "caseDetails": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "keyDirectionsOrOrders": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "partiesInvolved": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "relevantTimelines": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "nextHearingDate": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "penaltiesOrConsequences": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "legalSections": { "value": "", "confidenceScore": 0, "sourceText": "" },
  "additionalRemarks": { "value": "", "confidenceScore": 0, "sourceText": "" }
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    console.log('✅ Gemini API response received, parsing JSON...');

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in response:', responseText.substring(0, 500));
      throw new Error('No JSON found in extraction response');
    }

    let extractedData;
    try {
      extractedData = JSON.parse(jsonMatch[0]);
      console.log('✅ JSON parsed successfully');
    } catch (parseErr) {
      console.error('❌ JSON parsing error:', parseErr, 'Raw JSON:', jsonMatch[0].substring(0, 500));
      throw new Error('Failed to parse Gemini response as JSON');
    }

    // Transform into our format
    const details: ExtractedCaseDetail = {
      caseNumber: extractedData.caseNumber?.value || 'Not Found',
      court: extractedData.court?.value || 'Not Found',
      judge: extractedData.judge?.value || 'Not Found',
      jurisdiction: extractedData.jurisdiction?.value || 'Not Found',
      dateOfOrder: extractedData.dateOfOrder?.value || 'Not Found',
      defendant: extractedData.defendant?.value || 'Not Found',
      plaintiff: extractedData.plaintiff?.value || 'Not Found',
      natureOfCase: extractedData.natureOfCase?.value || 'Not Found',
      caseDetails: extractedData.caseDetails?.value || 'Not Found',
      keyDirectionsOrOrders: extractedData.keyDirectionsOrOrders?.value || 'Not Found',
      partiesInvolved: extractedData.partiesInvolved?.value || 'Not Found',
      relevantTimelines: extractedData.relevantTimelines?.value || 'Not Found',
      nextHearingDate: extractedData.nextHearingDate?.value || 'Not Found',
      penaltiesOrConsequences: extractedData.penaltiesOrConsequences?.value || 'Not Found',
      legalSections: extractedData.legalSections?.value || 'Not Found',
      additionalRemarks: extractedData.additionalRemarks?.value || 'Not Found',
    };

    // Build fields with metadata
    const fieldLabels: Record<keyof ExtractedCaseDetail, string> = {
      caseNumber: 'Case Number',
      court: 'Court',
      judge: 'Judge',
      jurisdiction: 'Jurisdiction',
      dateOfOrder: 'Date of Order',
      defendant: 'Defendant',
      plaintiff: 'Plaintiff',
      natureOfCase: 'Nature of Case',
      caseDetails: 'Case Details',
      keyDirectionsOrOrders: 'Key Directions / Orders',
      partiesInvolved: 'Parties Involved',
      relevantTimelines: 'Relevant Timelines',
      nextHearingDate: 'Next Hearing Date',
      penaltiesOrConsequences: 'Penalties / Consequences',
      legalSections: 'Legal Sections Cited',
      additionalRemarks: 'Additional Remarks',
    };

    const fieldsWithMeta: ExtractedFieldWithMeta[] = Object.entries(details).map(
      ([key, value]) => ({
        fieldKey: key as keyof ExtractedCaseDetail,
        fieldLabel: fieldLabels[key as keyof ExtractedCaseDetail],
        value,
        confidenceScore: extractedData[key]?.confidenceScore || 0,
        sourceText: extractedData[key]?.sourceText || '',
        isEdited: false,
      })
    );

    return { details, fieldsWithMeta, isUsingFallback: false };
  } catch (error) {
    console.error('❌ Gemini extraction error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    // Use fallback data
    console.warn('⚠️ Using fallback/mock data due to API unavailability');
    const fallbackDetails = getMockCaseDetails();
    const fallbackFields = getMockFieldsWithMeta();
    
    // Dispatch event for toast notification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fallback-data-used', {
        detail: { message: 'AI Service unavailable. Using sample data for demonstration.' }
      }));
    }

    return { details: fallbackDetails, fieldsWithMeta: fallbackFields, isUsingFallback: true };
  }
}

/**
 * STEP 3: Generate comprehensive action plan using Gemini
 */
export async function generateComprehensiveActionPlan(
  caseDetails: ExtractedCaseDetail,
  rawPdfText: string
): Promise<GeneratedActionPlan> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

    const systemPrompt = `You are a senior legal compliance officer and case strategist. Based on the following verified court order details, generate a comprehensive, structured action plan for the organization or legal team. Be specific, practical, and detailed.

The plan must include the following sections:

1. Executive Summary — A 3-5 sentence overview of the case and what is required immediately.

2. Compliance Requirements — List all actions required to comply with the court's orders. For each action, include:
   - Action description
   - Legal basis (which direction or section it stems from)
   - Priority level (Critical / High / Medium / Low)
   - Deadline (if specified or inferable)

3. Appeal Considerations — Based on the nature of the case, assess:
   - Grounds for appeal (if any)
   - Likelihood of success (Low / Medium / High) with reasoning
   - Recommended next steps if pursuing appeal
   - Deadline for filing appeal (if applicable)

4. Key Timelines — A chronological timeline of:
   - All explicit dates mentioned in the order
   - Inferred deadlines based on standard legal procedures
   - Critical milestones

5. Responsible Departments / Stakeholders — For each action, identify which department or role should own it

6. Nature of Action Required — Categorize actions into:
   - Immediate actions (within 7 days)
   - Short-term actions (within 30 days)
   - Long-term actions (beyond 30 days)
   - Ongoing obligations

7. Risk Assessment — Identify:
   - Risks of non-compliance
   - Financial exposure
   - Reputational risk
   - Escalation risks

8. Recommended Documentation — List all documents that need to be prepared, filed, or maintained as evidence of compliance

9. External Counsel Instructions — Draft brief instructions for external legal counsel outlining priorities and required support

10. Internal Communication Plan — Suggest how and what to communicate to relevant internal stakeholders

Return ONLY valid JSON (no markdown, no code blocks). Each action item must have: id, title, description, priority, deadline, responsibleParty, status (default: "Pending").`;

    const prompt = `${systemPrompt}

Verified case details:
${JSON.stringify(caseDetails, null, 2)}

Generate the comprehensive action plan as a structured JSON object with all 10 sections and action items.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in action plan response');
    }

    const planData = JSON.parse(jsonMatch[0]);

    // Transform into our structured format
    const actionPlan: GeneratedActionPlan = {
      id: `plan-${Date.now()}`,
      executiveSummary: planData.executiveSummary || '',
      complianceRequirements: ensureArray<any>(planData.complianceRequirements).map(
        (req: any, idx: number) => ({
          id: req.id || `comp-${idx}`,
          description: req.description || req.requirement || req.action || '',
          legalBasis: req.legalBasis || '',
          priority: normalizePriority(req.priority),
          deadline: req.deadline,
          responsibleDepartment: req.responsibleDepartment || req.responsible || '',
          status: 'pending',
        })
      ),
      appealConsiderations: {
        groundsForAppeal: ensureArray(planData.appealConsiderations?.groundsForAppeal),
        likelihoodOfSuccess: (planData.appealConsiderations?.likelihoodOfSuccess || 'low').toLowerCase() as any,
        reasoning: planData.appealConsiderations?.reasoning || '',
        recommendedNextSteps: ensureArray(planData.appealConsiderations?.recommendedNextSteps),
        deadlineForFiling: planData.appealConsiderations?.deadlineForFiling,
      },
      keyTimelines: ensureArray<any>(planData.keyTimelines).map((timeline: any) => ({
        date: timeline.date || '',
        description: timeline.description || '',
        isExplicit: timeline.isExplicit ?? true,
        type: ['hearing', 'deadline', 'milestone', 'other'].includes(timeline.type)
          ? timeline.type
          : 'other',
      })),
      riskAssessment: {
        nonComplianceRisks: ensureArray(planData.riskAssessment?.nonComplianceRisks),
        financialExposure: planData.riskAssessment?.financialExposure,
        reputationalRisk: planData.riskAssessment?.reputationalRisk || '',
        escalationRisks: ensureArray(planData.riskAssessment?.escalationRisks),
      },
      recommendedDocumentation: ensureArray<any>(planData.recommendedDocumentation).map(
        (doc: any, idx: number) => ({
          documentType: doc.documentType || doc.document || '',
          purpose: doc.purpose || '',
          deadline: doc.deadline,
          priority: normalizePriority(doc.priority),
        })
      ),
      externalCounselInstructions: ensureArray<any>(planData.externalCounselInstructions).map(
        (instruction: any) => ({
          priority: instruction.priority || 'medium',
          instruction: instruction.instruction || '',
          deadline: instruction.deadline,
        })
      ),
      internalCommunicationPlan: ensureArray<any>(planData.internalCommunicationPlan).map(
        (comm: any) => ({
          stakeholder: comm.stakeholder || '',
          message: comm.message || '',
          communicationChannel: comm.communicationChannel || '',
          priority: normalizePriority(comm.priority),
        })
      ),
      actionItems: ensureArray<any>(planData.actionItems).map((action: any, idx: number) => ({
        id: action.id || `action-${idx}`,
        title: action.title || '',
        description: action.description || '',
        priority: normalizePriority(action.priority),
        deadline: action.deadline,
        responsibleParty: action.responsibleParty || '',
        status: 'pending',
        section: ['compliance', 'appeal', 'timeline', 'risk', 'documentation', 'external', 'internal'].includes(action.section)
          ? action.section
          : 'compliance',
      })),
      generatedAt: new Date().toISOString(),
    };

    return actionPlan;
  } catch (error) {
    console.error('❌ Gemini action plan generation error:', error);
    
    // Use fallback data
    console.warn('⚠️ Using fallback/mock action plan due to API unavailability');
    
    // Dispatch event for toast notification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fallback-data-used', {
        detail: { message: 'AI Service unavailable. Using sample action plan for demonstration.' }
      }));
    }

    return getMockActionPlan();
  }
}
