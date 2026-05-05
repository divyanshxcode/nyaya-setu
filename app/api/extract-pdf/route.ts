import { NextRequest, NextResponse } from 'next/server';

// Mock judgment text for demo (same one we've been using)
const mockJudgmentText = `IN THE HIGH COURT OF DELHI AT NEW DELHI

W.P.(C) No. 2024/00134

Reserved on: 10th January, 2024
Pronounced on: 15th January, 2024

CORAM:
HON'BLE MR. JUSTICE R.K. SHARMA

IN THE MATTER OF:

Petitioner: Rajesh Kumar Singh
...Petitioner(s)

versus

State of Delhi & Ors.
...Respondent(s)

JUDGMENT

1. The present writ petition has been filed seeking a direction to the respondents to complete the road repair work in the petitioner's locality within a stipulated time frame.

2. The learned counsel for the petitioner submits that despite repeated representations to the concerned authorities, the road in question has remained in a dilapidated condition causing immense hardship to the residents.

3. The learned standing counsel for the respondent-State submits that due to budgetary constraints, the repair work could not be taken up earlier. However, necessary funds have now been allocated and the work shall be completed within 30 days.

4. Having heard the learned counsel for the parties and perused the material on record, this Court is of the view that the respondent authorities must complete the road repair work within 30 days from the date of this order.

DIRECTIONS:

i) The respondent No. 2 (PWD) is directed to complete the road repair work within 30 days from today.

ii) The respondent shall submit a compliance report along with photographic evidence within 35 days.

iii) The respondent shall also ensure proper drainage system installation in the said locality.

5. The writ petition is disposed of in the above terms. No costs.

R.K. SHARMA, J
January 15, 2024`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check if file is PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    // For demo: return mock extracted text
    // In production, you would use a proper PDF extraction library here
    const extractedText = mockJudgmentText;
    const pageCount = 4;
    const wordCount = extractedText.split(/\s+/).length;

    return NextResponse.json({
      success: true,
      text: extractedText,
      pageCount,
      wordCount,
      confidence: 92,
    });
  } catch (error) {
    console.error('PDF extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract PDF text' },
      { status: 500 }
    );
  }
}
