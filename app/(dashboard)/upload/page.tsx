'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { DropZone } from '@/components/upload/DropZone';
import { OcrProgressStepper } from '@/components/upload/OcrProgressStepper';
import { ExtractionPreview } from '@/components/upload/ExtractionPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import type { OcrStage } from '@/lib/ocr-simulator';
import { simulateOCR } from '@/lib/ocr-simulator';
import type { ExtractionField, ExtractionResult } from '@/lib/ai-extractor';
import { extractWithGemini } from '@/lib/ai-extractor';
import { extractTextFromPDF } from '@/lib/pdf-extractor';
import { departments } from '@/lib/mock-data';

type Step = 1 | 2 | 3 | 4;

const steps = [
  { number: 1, title: 'Upload', description: 'Upload judgment PDF' },
  { number: 2, title: 'OCR Processing', description: 'Extract text from PDF' },
  { number: 3, title: 'AI Extraction', description: 'Analyze legal content' },
  { number: 4, title: 'Review & Submit', description: 'Verify and submit' },
];

export default function UploadPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [file, setFile] = useState<File | null>(null);
  const [autoFetch, setAutoFetch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [dateOfOrder, setDateOfOrder] = useState('');
  const [department, setDepartment] = useState('');

  // OCR state
  const [ocrStages, setOcrStages] = useState<OcrStage[]>([]);
  const [currentOcrStage, setCurrentOcrStage] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [ocrStats, setOcrStats] = useState<{ pageCount: number; wordCount: number; confidence: number } | null>(null);

  // Extraction state
  const [extractedFields, setExtractedFields] = useState<ExtractionField[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
  };

  const startOcrProcess = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setError(null);
      setCurrentStep(2);
      
      // Extract text from PDF
      const extractedText = await extractTextFromPDF(file, (progress) => {
        setOcrText(progress.partialText);
        // Simulate OCR stages for visual feedback
        const stageNumber = Math.min(progress.stage, 4);
        const stages: OcrStage[] = [
          { name: 'PDF Received', status: stageNumber > 0 ? 'completed' : 'pending' },
          { name: 'Running OCR Engine', status: stageNumber > 1 ? 'completed' : stageNumber === 1 ? 'processing' : 'pending' },
          { name: 'Text Extraction', status: stageNumber > 2 ? 'completed' : stageNumber === 2 ? 'processing' : 'pending' },
          { name: 'Layout Analysis', status: stageNumber > 3 ? 'completed' : stageNumber === 3 ? 'processing' : 'pending' },
          { name: 'Page Segmentation', status: stageNumber > 4 ? 'completed' : 'pending' },
        ];
        setOcrStages(stages);
        setCurrentOcrStage(Math.min(stageNumber, 4));
      });

      // Calculate stats
      const wordCount = extractedText.split(/\s+/).length;
      const pageMatches = extractedText.match(/--- PAGE \d+ ---/g) || [];
      const pageCount = pageMatches.length;

      setOcrText(extractedText);
      setOcrStats({ pageCount, wordCount, confidence: 92 });
      
      // Auto-advance after a delay
      setTimeout(() => startAiExtraction(extractedText), 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract PDF';
      setError(errorMessage);
      setCurrentStep(1);
    }
  };

  const startAiExtraction = async (extractedText: string) => {
    try {
      setCurrentStep(3);
      setIsExtracting(true);
      setExtractedFields([]);
      setError(null);

      await extractWithGemini(
        extractedText,
        (field) => {
          setExtractedFields(prev => [...prev, field]);
        },
        (result) => {
          setExtractionResult(result);
          setIsExtracting(false);
          // Auto-fill form fields from extraction result
          setCaseNumber(result.fields.find(f => f.fieldName === 'Case Number')?.value || '');
          setCourtName(result.fields.find(f => f.fieldName === 'Court Name')?.value || '');
          setDateOfOrder(result.fields.find(f => f.fieldName === 'Date of Order')?.value || '');
          setDepartment(result.responsibleDepartment.toLowerCase().replace(/\s+/g, '-'));
          setTimeout(() => setCurrentStep(4), 1500);
        }
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract judgment details';
      setError(errorMessage);
      setIsExtracting(false);
      setCurrentStep(2);
    }
  };

  const handleSubmitForReview = () => {
    // Navigate to review queue
    router.push('/review');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Judgment"
        description="Upload court judgment PDF for AI-powered extraction and analysis"
      />

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-crimson-light border border-crimson rounded-lg">
          <AlertCircle className="h-5 w-5 text-crimson shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-navy">Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {/* Stepper */}
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all',
                    currentStep > step.number
                      ? 'bg-jade text-white'
                      : currentStep === step.number
                      ? 'bg-navy text-white'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className={cn(
                    'text-sm font-medium',
                    currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    currentStep > step.number ? 'bg-jade' : 'bg-muted'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Upload Judgment PDF</CardTitle>
                <CardDescription>
                  Drag and drop or click to upload the court judgment document
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <DropZone
                  onFileSelect={handleFileSelect}
                  file={file}
                  onClear={handleClearFile}
                />

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Auto-fetch from CCMS API</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically retrieve case details from court system
                    </p>
                  </div>
                  <Switch checked={autoFetch} onCheckedChange={setAutoFetch} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Metadata</CardTitle>
                <CardDescription>
                  Enter or verify the case details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="caseNumber">Case Number</Label>
                  <Input
                    id="caseNumber"
                    placeholder="e.g., WP/2024/00134"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courtName">Court Name</Label>
                  <Select value={courtName} onValueChange={setCourtName}>
                    <SelectTrigger id="courtName">
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi-hc">Delhi High Court</SelectItem>
                      <SelectItem value="bombay-hc">Bombay High Court</SelectItem>
                      <SelectItem value="madras-hc">Madras High Court</SelectItem>
                      <SelectItem value="supreme-court">Supreme Court of India</SelectItem>
                      <SelectItem value="ph-hc">Punjab & Haryana High Court</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfOrder">Date of Order</Label>
                  <Input
                    id="dateOfOrder"
                    type="date"
                    value={dateOfOrder}
                    onChange={(e) => setDateOfOrder(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.shortCode.toLowerCase()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-navy hover:bg-navy-light"
                  disabled={!file}
                  onClick={startOcrProcess}
                >
                  Start Processing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 2: OCR Processing */}
        {currentStep === 2 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>OCR Processing</CardTitle>
                <CardDescription>
                  Extracting text from the uploaded PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OcrProgressStepper stages={ocrStages} currentStage={currentOcrStage} />
                
                {ocrStats && (
                  <div className="mt-6 p-4 bg-jade-light rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-jade">{ocrStats.pageCount}</p>
                        <p className="text-xs text-muted-foreground">Pages</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-jade">{ocrStats.wordCount}</p>
                        <p className="text-xs text-muted-foreground">Words</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-jade">{ocrStats.confidence}%</p>
                        <p className="text-xs text-muted-foreground">Confidence</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extracted Text Preview</CardTitle>
                <CardDescription>
                  Live preview of OCR output
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 h-[400px] overflow-y-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                    {ocrText || 'Processing...'}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: AI Extraction */}
        {currentStep === 3 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>AI Field Extraction</CardTitle>
                <CardDescription>
                  Analyzing judgment text to extract legal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExtractionPreview
                  fields={extractedFields}
                  isExtracting={isExtracting}
                  overallConfidence={extractionResult?.overallConfidence}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extracted Content</CardTitle>
                <CardDescription>
                  Key directions and action plan preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {extractionResult && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {extractionResult.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Key Directions</h4>
                      <ul className="space-y-2">
                        {extractionResult.keyDirections.map((direction, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground">{direction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-saffron-light rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-saffron text-white text-xs font-medium rounded">
                          {extractionResult.actionType.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-navy">
                          Priority: {extractionResult.priority}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Deadline: {extractionResult.deadline}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Department: {extractionResult.responsibleDepartment}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Extracted Fields</CardTitle>
                <CardDescription>
                  Review and edit extracted information before submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="finalCaseNumber">Case Number</Label>
                  <Input id="finalCaseNumber" defaultValue="WP/2024/00134" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalCourt">Court Name</Label>
                  <Input id="finalCourt" defaultValue="Delhi High Court" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalJudge">Judge</Label>
                  <Input id="finalJudge" defaultValue="Hon'ble Justice R.K. Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalDate">Date of Order</Label>
                  <Input id="finalDate" type="date" defaultValue="2024-01-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalPetitioner">Petitioner</Label>
                  <Input id="finalPetitioner" defaultValue="Rajesh Kumar Singh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalRespondent">Respondent</Label>
                  <Input id="finalRespondent" defaultValue="State of Delhi & Ors." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finalDecision">Final Decision</Label>
                  <Input id="finalDecision" defaultValue="Petition Allowed" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PDF Preview</CardTitle>
                <CardDescription>
                  Highlighted sections in the judgment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-border rounded-lg p-6 h-[400px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-xs text-muted-foreground mb-4">
                      Page 1 of 4
                    </p>
                    <h3 className="text-center">
                      IN THE HIGH COURT OF DELHI AT NEW DELHI
                    </h3>
                    <p className="text-center">
                      <mark className="bg-yellow-200">W.P.(C) No. 2024/00134</mark>
                    </p>
                    <p className="text-center text-sm">
                      Reserved on: 10th January, 2024<br />
                      Pronounced on: <mark className="bg-yellow-200">15th January, 2024</mark>
                    </p>
                    <p className="text-center text-sm mt-4">
                      CORAM:<br />
                      <mark className="bg-yellow-200">HON&apos;BLE MR. JUSTICE R.K. SHARMA</mark>
                    </p>
                    <p className="mt-4">
                      <strong>Petitioner:</strong> <mark className="bg-yellow-200">Rajesh Kumar Singh</mark>
                    </p>
                    <p className="text-center">versus</p>
                    <p>
                      <strong>Respondent:</strong> <mark className="bg-yellow-200">State of Delhi & Ors.</mark>
                    </p>
                    <h4 className="mt-6">DIRECTIONS:</h4>
                    <ol className="text-sm">
                      <li>
                        <mark className="bg-yellow-200">
                          The respondent No. 2 (PWD) is directed to complete the road repair work within 30 days
                        </mark>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Edit Before Submitting
                  </Button>
                  <Button
                    className="flex-1 bg-jade hover:bg-jade/90"
                    onClick={handleSubmitForReview}
                  >
                    Submit for Human Review
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
