'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { DropZone } from '@/components/upload/DropZone';
import { OcrProgressStepper } from '@/components/upload/OcrProgressStepper';
import { ExtractionPreview } from '@/components/upload/ExtractionPreview';
import { ExtractedDataDisplay } from '@/components/upload/ExtractedDataDisplay';
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
import { extractTextFromPDF, extractStructuredDataFromPDF } from '@/lib/pdf-extractor';
import type { StructuredPDFData } from '@/lib/pdf-extractor';
import { departments } from '@/lib/mock-data';

type Step = 1 | 2 | 3 | 4;

const steps = [
  { number: 1, title: 'Upload', description: 'Upload judgment PDF' },
  { number: 2, title: 'Extract & Review', description: 'Review extracted content with PDF preview' },
  { number: 3, title: 'AI Analysis', description: 'Analyze with corrected data' },
  { number: 4, title: 'Action Plan', description: 'Review AI action plan' },
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

  const [ocrStages, setOcrStages] = useState<OcrStage[]>([]);
  const [currentOcrStage, setCurrentOcrStage] = useState(0);
  const [ocrText, setOcrText] = useState('');
  const [ocrStats, setOcrStats] = useState<{ pageCount: number; wordCount: number; confidence: number } | null>(null);

  // Extracted fields that can be edited by user
  const [extractedFieldsForReview, setExtractedFieldsForReview] = useState<ExtractionField[]>([]);
  const [editableFields, setEditableFields] = useState<Record<string, string>>({});
  const [structuredPdfData, setStructuredPdfData] = useState<StructuredPDFData | null>(null);

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
      
      // Extract structured data from PDF using Gemini
      const pdfData = await extractStructuredDataFromPDF(file);
      
      setOcrText(pdfData.text);
      setOcrStats({ 
        pageCount: pdfData.pageCount, 
        wordCount: pdfData.wordCount, 
        confidence: pdfData.confidence 
      });
      setStructuredPdfData(pdfData);
      
      // Pre-fill form fields from structured data
      if (pdfData.structuredData) {
        if (pdfData.structuredData.caseNumber) {
          setCaseNumber(pdfData.structuredData.caseNumber);
        }
        if (pdfData.structuredData.courtName) {
          setCourtName(pdfData.structuredData.courtName);
        }
        if (pdfData.structuredData.dateOfOrder) {
          setDateOfOrder(pdfData.structuredData.dateOfOrder);
        }
      }
      
      // Stay at step 2 for human review - don't auto-advance
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract PDF';
      setError(errorMessage);
      setCurrentStep(1);
    }
  };

  const proceedToAiAnalysis = async () => {
    try {
      setCurrentStep(3);
      setIsExtracting(true);
      setExtractedFields([]);
      setError(null);

      // Use corrected text from editableFields or original ocrText
      const textToAnalyze = ocrText;

      await extractWithGemini(
        textToAnalyze,
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
          // Don't auto-advance - let user click button to proceed
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

        {/* Step 2: Extract & Review with PDF Preview */}
        {currentStep === 2 && structuredPdfData && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Extracted Metadata & Data</CardTitle>
                <CardDescription>
                  AI-extracted case information with source highlighting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExtractedDataDisplay 
                  data={structuredPdfData}
                  sourceText={ocrText}
                />
                
                <div className="flex gap-3 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-navy hover:bg-navy-light"
                    onClick={proceedToAiAnalysis}
                  >
                    Proceed to Full Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw Extracted Text</CardTitle>
                <CardDescription>
                  Review and edit the extracted text if needed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editableOcrText">Text (Editable)</Label>
                  <textarea
                    id="editableOcrText"
                    value={ocrText}
                    onChange={(e) => setOcrText(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg font-mono text-xs bg-muted/50 focus:outline-none focus:ring-2 focus:ring-navy"
                    style={{ height: '300px' }}
                  />
                </div>

                {ocrStats && (
                  <div className="p-3 bg-jade-light rounded-lg grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-jade">{ocrStats.pageCount}</p>
                      <p className="text-xs text-muted-foreground">Pages</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-jade">{ocrStats.wordCount}</p>
                      <p className="text-xs text-muted-foreground">Words</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-jade">{ocrStats.confidence}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 2: Extract & Review (Old layout - fallback) */}
        {currentStep === 2 && !structuredPdfData && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Extracted Content</CardTitle>
                <CardDescription>
                  Review extracted text. Make corrections if needed before AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editableOcrText">Extracted Text (Editable)</Label>
                  <textarea
                    id="editableOcrText"
                    value={ocrText}
                    onChange={(e) => setOcrText(e.target.value)}
                    className="w-full p-3 border border-border rounded-lg font-mono text-xs bg-muted/50 focus:outline-none focus:ring-2 focus:ring-navy"
                    style={{ height: '300px' }}
                  />
                </div>

                {ocrStats && (
                  <div className="p-3 bg-jade-light rounded-lg grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-jade">{ocrStats.pageCount}</p>
                      <p className="text-xs text-muted-foreground">Pages</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-jade">{ocrStats.wordCount}</p>
                      <p className="text-xs text-muted-foreground">Words</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-jade">{ocrStats.confidence}%</p>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-navy hover:bg-navy-light"
                    onClick={proceedToAiAnalysis}
                  >
                    Proceed to AI Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PDF Preview</CardTitle>
                <CardDescription>
                  Original judgment document with highlighted sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-border rounded-lg p-6 overflow-y-auto" style={{ height: '400px' }}>
                  <div className="prose prose-sm max-w-none text-xs">
                    <p className="text-muted-foreground mb-4">
                      Page 1 of 4
                    </p>
                    <h3 className="text-center font-bold">
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
                    <h4 className="mt-6 font-bold">DIRECTIONS:</h4>
                    <ol className="text-sm list-decimal list-inside">
                      <li>
                        <mark className="bg-yellow-200">
                          The respondent No. 2 (PWD) is directed to complete the road repair work within 30 days
                        </mark>
                      </li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 3: AI Analysis */}
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

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-navy hover:bg-navy-light"
                        onClick={() => setCurrentStep(4)}
                      >
                        Proceed to Action Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Step 4: Action Plan Review */}
        {currentStep === 4 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>AI Action Plan & Summary</CardTitle>
                <CardDescription>
                  Review the AI-generated action plan and case summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {extractionResult && (
                  <>
                    <div className="border-b pb-4">
                      <h4 className="text-sm font-semibold mb-2">Case Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {extractionResult.summary}
                      </p>
                    </div>

                    <div className="border-b pb-4">
                      <h4 className="text-sm font-semibold mb-3">Key Directions</h4>
                      <ul className="space-y-2">
                        {extractionResult.keyDirections.map((direction, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-jade text-white text-xs font-medium shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-muted-foreground pt-0.5">{direction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-jade-light/50 rounded-lg border border-jade/20">
                      <h4 className="text-sm font-semibold mb-3">Action Items</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Action Type:</span>
                          <span className="ml-2 font-medium px-2 py-1 bg-jade text-white rounded text-xs">
                            {extractionResult.actionType.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Priority:</span>
                          <span className="ml-2 font-medium">{extractionResult.priority}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Deadline:</span>
                          <span className="ml-2 font-medium">{extractionResult.deadline}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Responsible Dept:</span>
                          <span className="ml-2 font-medium">{extractionResult.responsibleDepartment}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-jade hover:bg-jade/90"
                        onClick={handleSubmitForReview}
                      >
                        Submit for Human Review
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Extracted Case Details</CardTitle>
                <CardDescription>
                  Information extracted from the judgment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Case Number</Label>
                  <p className="text-sm font-medium">{caseNumber || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Court Name</Label>
                  <p className="text-sm font-medium">{courtName || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Date of Order</Label>
                  <p className="text-sm font-medium">{dateOfOrder || '-'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Department</Label>
                  <p className="text-sm font-medium">{department || '-'}</p>
                </div>

                {extractionResult && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">Extracted Fields</h4>
                      <div className="space-y-2">
                        {extractionResult.fields.slice(0, 6).map((field) => (
                          <div key={field.fieldName} className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{field.fieldName}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full',
                                    field.confidenceScore >= 90
                                      ? 'bg-jade'
                                      : field.confidenceScore >= 75
                                      ? 'bg-amber'
                                      : 'bg-crimson'
                                  )}
                                  style={{ width: `${field.confidenceScore}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground w-8">
                                {field.confidenceScore}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
