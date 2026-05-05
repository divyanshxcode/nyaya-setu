import type { OcrResult } from '@/types';

const sampleJudgmentText = `IN THE HIGH COURT OF DELHI AT NEW DELHI

W.P.(C) No. 2024/XXXXX

Reserved on: 10th January, 2024
Pronounced on: 15th January, 2024

CORAM:
HON'BLE MR. JUSTICE R.K. SHARMA

IN THE MATTER OF:

Petitioner: [PETITIONER NAME]
...Petitioner(s)

versus

State of Delhi & Ors.
...Respondent(s)

Advocates who appeared in this case:
For the Petitioner: Mr. Advocate Name, Advocate
For the Respondent: Mr. Standing Counsel

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

export interface OcrStage {
  name: string;
  status: 'pending' | 'processing' | 'completed';
}

export async function simulateOCR(
  onProgress: (stage: number, stages: OcrStage[], partialText?: string) => void
): Promise<OcrResult> {
  const stages: OcrStage[] = [
    { name: 'PDF Received', status: 'pending' },
    { name: 'Running OCR Engine', status: 'pending' },
    { name: 'Text Extraction', status: 'pending' },
    { name: 'Layout Analysis', status: 'pending' },
    { name: 'Page Segmentation', status: 'pending' },
  ];

  // Stage 1: PDF Received
  stages[0].status = 'completed';
  onProgress(0, [...stages]);
  await delay(800);

  // Stage 2: Running OCR Engine
  stages[1].status = 'processing';
  onProgress(1, [...stages]);
  await delay(1500);
  stages[1].status = 'completed';
  onProgress(1, [...stages]);

  // Stage 3: Text Extraction
  stages[2].status = 'processing';
  onProgress(2, [...stages]);
  
  // Simulate text appearing progressively
  const words = sampleJudgmentText.split(' ');
  const chunks = 5;
  const chunkSize = Math.ceil(words.length / chunks);
  
  for (let i = 0; i < chunks; i++) {
    await delay(600);
    const partialText = words.slice(0, (i + 1) * chunkSize).join(' ');
    onProgress(2, [...stages], partialText);
  }
  
  stages[2].status = 'completed';
  onProgress(2, [...stages], sampleJudgmentText);

  // Stage 4: Layout Analysis
  stages[3].status = 'processing';
  onProgress(3, [...stages], sampleJudgmentText);
  await delay(1000);
  stages[3].status = 'completed';
  onProgress(3, [...stages], sampleJudgmentText);

  // Stage 5: Page Segmentation
  stages[4].status = 'processing';
  onProgress(4, [...stages], sampleJudgmentText);
  await delay(800);
  stages[4].status = 'completed';
  onProgress(4, [...stages], sampleJudgmentText);

  return {
    text: sampleJudgmentText,
    pageCount: 4,
    wordCount: sampleJudgmentText.split(/\s+/).length,
    confidenceScore: 94,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
