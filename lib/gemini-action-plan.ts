import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ActionPlanResponse {
  keyDirections: string[];
  deadline: string;
  department: string;
  actionSteps: string[];
  priority: 'high' | 'medium' | 'low';
  riskFactors: string[];
  summary: string;
}

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
);

export async function generateActionPlan(
  judgmentText: string,
  onPartialResponse?: (response: Partial<ActionPlanResponse>) => void
): Promise<ActionPlanResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash' });

    const systemPrompt = `You are an expert judicial analyst specializing in Indian court judgments and legal compliance.
Your task is to analyze court judgments and extract actionable information for government departments.

When analyzing a judgment, extract:
1. Key directions/orders from the court
2. Compliance deadline
3. Responsible government department
4. Specific action steps for compliance
5. Priority level based on urgency and impact
6. Risk factors for non-compliance

Return ONLY valid JSON (no markdown, no extra text, no code blocks):
{
  "keyDirections": ["direction1", "direction2", "direction3"],
  "deadline": "30 days from order date or specific date mentioned",
  "department": "Department name if mentioned, otherwise extract from context",
  "actionSteps": ["step1", "step2", "step3", "step4"],
  "priority": "high|medium|low",
  "riskFactors": ["risk1", "risk2"],
  "summary": "Brief summary of the judgment and required action in 2-3 sentences"
}`;

    const prompt = `${systemPrompt}

Court Judgment Text:
${judgmentText}

Extract information and return ONLY the JSON object.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Response:', responseText);
      throw new Error('No JSON found in response');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]) as ActionPlanResponse;
    
    // Notify partial response
    if (onPartialResponse) {
      onPartialResponse(parsedResponse);
    }

    return parsedResponse;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate action plan from judgment');
  }
}
