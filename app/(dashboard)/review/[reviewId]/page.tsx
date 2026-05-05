'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { courtCases, departments } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  Send,
  Save,
  Eye,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface ReviewFormPageProps {
  params: Promise<{ reviewId: string }>;
}

export default function ReviewFormPage({ params }: ReviewFormPageProps) {
  const { reviewId } = use(params);
  const router = useRouter();
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const courtCase = courtCases.find((c) => c.id === reviewId);

  // Form state
  const [formData, setFormData] = useState({
    caseNumber: courtCase?.caseNumber || '',
    courtName: courtCase?.courtName || '',
    judge: courtCase?.judgeName || '',
    dateOfOrder: courtCase?.dateOfOrder || '',
    petitioner: courtCase?.petitioner || '',
    respondent: courtCase?.respondent || '',
    finalDecision: courtCase?.judgment?.finalDecision || '',
    keyDirections: courtCase?.judgment?.keyDirections || [''],
    deadline: courtCase?.deadlineDate || '',
    department: courtCase?.department || '',
    actionType: courtCase?.actionPlan?.actionType || 'compliance',
    priority: courtCase?.actionPlan?.priority || 'medium',
    responsibleDepartment: courtCase?.actionPlan?.responsibleDepartment || '',
    suggestedSteps: courtCase?.actionPlan?.suggestedSteps || [''],
  });

  // Field confidence scores (simulated)
  const fieldConfidence: Record<string, number> = {
    caseNumber: 98,
    courtName: 99,
    judge: 97,
    dateOfOrder: 96,
    petitioner: 94,
    respondent: 95,
    finalDecision: 92,
    keyDirections: 88,
    deadline: 91,
    department: 94,
  };

  const [fieldApprovals, setFieldApprovals] = useState<Record<string, boolean | null>>(
    Object.keys(fieldConfidence).reduce((acc, key) => ({ ...acc, [key]: null }), {})
  );

  if (!courtCase) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-2">Review Not Found</h1>
        <p className="text-muted-foreground mb-4">The review you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/review')}>Back to Review Queue</Button>
      </div>
    );
  }

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addListItem = (field: 'keyDirections' | 'suggestedSteps') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ''],
    }));
  };

  const removeListItem = (field: 'keyDirections' | 'suggestedSteps', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const updateListItem = (field: 'keyDirections' | 'suggestedSteps', index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleApprove = () => {
    // Simulate approval
    router.push('/review?status=approved');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    // Simulate rejection
    setRejectDialogOpen(false);
    router.push('/review?status=rejected');
  };

  const handleSendBack = () => {
    router.push('/review?status=needs_edit');
  };

  const overallConfidence = courtCase.judgment?.confidenceScore || 94;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Human Verification"
        description={`Review extracted data for ${courtCase.caseNumber}`}
      >
        <Button variant="outline" onClick={() => router.push('/review')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Queue
        </Button>
      </PageHeader>

      {/* Confidence Gauge */}
      <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 60 35" className="w-20 h-12">
            <path
              d="M 5 30 A 25 25 0 0 1 55 30"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 5 30 A 25 25 0 0 1 55 30"
              fill="none"
              stroke={overallConfidence >= 85 ? '#1A7A4A' : overallConfidence >= 70 ? '#D4891A' : '#C0392B'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="79"
              strokeDashoffset={79 - (overallConfidence / 100) * 79}
            />
          </svg>
          <div>
            <p className="text-2xl font-bold">{overallConfidence}%</p>
            <p className="text-xs text-muted-foreground">Overall Confidence</p>
          </div>
        </div>
        <div className="flex-1 h-px bg-border" />
        <div className="text-right">
          <p className="text-sm font-medium">{courtCase.courtName}</p>
          <p className="text-xs text-muted-foreground">{courtCase.department}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Data Verification</CardTitle>
              <CardDescription>
                Review and edit AI-extracted fields. Click &quot;View in PDF&quot; to see source.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FieldRow
                label="Case Number"
                value={formData.caseNumber}
                onChange={(v) => updateFormData('caseNumber', v)}
                confidence={fieldConfidence.caseNumber}
                onViewSource={() => setHighlightedField('caseNumber')}
                isHighlighted={highlightedField === 'caseNumber'}
                approval={fieldApprovals.caseNumber}
                onApprovalChange={(v) => setFieldApprovals((p) => ({ ...p, caseNumber: v }))}
              />
              <FieldRow
                label="Court Name"
                value={formData.courtName}
                onChange={(v) => updateFormData('courtName', v)}
                confidence={fieldConfidence.courtName}
                onViewSource={() => setHighlightedField('courtName')}
                isHighlighted={highlightedField === 'courtName'}
                approval={fieldApprovals.courtName}
                onApprovalChange={(v) => setFieldApprovals((p) => ({ ...p, courtName: v }))}
              />
              <FieldRow
                label="Judge"
                value={formData.judge}
                onChange={(v) => updateFormData('judge', v)}
                confidence={fieldConfidence.judge}
                onViewSource={() => setHighlightedField('judge')}
                isHighlighted={highlightedField === 'judge'}
                approval={fieldApprovals.judge}
                onApprovalChange={(v) => setFieldApprovals((p) => ({ ...p, judge: v }))}
              />
              <FieldRow
                label="Date of Order"
                value={formData.dateOfOrder}
                onChange={(v) => updateFormData('dateOfOrder', v)}
                confidence={fieldConfidence.dateOfOrder}
                onViewSource={() => setHighlightedField('dateOfOrder')}
                isHighlighted={highlightedField === 'dateOfOrder'}
                type="date"
                approval={fieldApprovals.dateOfOrder}
                onApprovalChange={(v) => setFieldApprovals((p) => ({ ...p, dateOfOrder: v }))}
              />
              <FieldRow
                label="Petitioner"
                value={formData.petitioner}
                onChange={(v) => updateFormData('petitioner', v)}
                confidence={fieldConfidence.petitioner}
                onViewSource={() => setHighlightedField('petitioner')}
                isHighlighted={highlightedField === 'petitioner'}
                approval={fieldApprovals.petitioner}
                onApprovalChange={(v) => setFieldApprovals((p) => ({ ...p, petitioner: v }))}
              />
              <FieldRow
                label="Respondent"
                value={formData.respondent}
                onChange={(v) => updateFormData('respondent', v)}
                confidence={fieldConfidence.respondent}
                onViewSource={() => setHighlightedField('respondent')}
                isHighlighted={highlightedField === 'respondent'}
                approval={fieldApprovals.respondent}
                onApprovalChange={(v) => setFieldApprovals((p) => ({ ...p, respondent: v }))}
              />
              <FieldRow
                label="Final Decision"
                value={formData.finalDecision}
                onChange={(v) => updateFormData('finalDecision', v)}
                confidence={fieldConfidence.finalDecision}
                onViewSource={() => setHighlightedField('finalDecision')}
                isHighlighted={highlightedField === 'finalDecision'}
                approval={fieldApprovals.finalDecision}
                onApprovalChange={(v) => setFieldApprovals((p) => ({ ...p, finalDecision: v }))}
              />
              <FieldRow
                label="Deadline"
                value={formData.deadline}
                onChange={(v) => updateFormData('deadline', v)}
                confidence={fieldConfidence.deadline}
                onViewSource={() => setHighlightedField('deadline')}
                isHighlighted={highlightedField === 'deadline'}
                type="date"
                approval={fieldApprovals.deadline}
                onApprovalChange={(v) => setFieldApprovals((p) => ({ ...p, deadline: v }))}
              />

              {/* Key Directions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Key Directions</Label>
                  <ConfidenceBar score={fieldConfidence.keyDirections} />
                </div>
                {formData.keyDirections.map((direction, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={direction}
                      onChange={(e) => updateListItem('keyDirections', index, e.target.value)}
                      placeholder={`Direction ${index + 1}`}
                    />
                    {formData.keyDirections.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem('keyDirections', index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addListItem('keyDirections')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Direction
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Plan Section */}
          <Card>
            <CardHeader>
              <CardTitle>Action Plan Review</CardTitle>
              <CardDescription>Review and adjust the AI-generated action plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Action Type</Label>
                <Select
                  value={formData.actionType}
                  onValueChange={(v) => updateFormData('actionType', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="appeal">Appeal</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="internal_order">Internal Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(v) => updateFormData('priority', v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="flex items-center gap-1.5 cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-crimson" />
                      High
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="flex items-center gap-1.5 cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-amber" />
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="flex items-center gap-1.5 cursor-pointer">
                      <span className="w-2 h-2 rounded-full bg-jade" />
                      Low
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Responsible Department</Label>
                <Select
                  value={formData.responsibleDepartment}
                  onValueChange={(v) => updateFormData('responsibleDepartment', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Suggested Steps</Label>
                {formData.suggestedSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <Input
                      value={step}
                      onChange={(e) => updateListItem('suggestedSteps', index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                    />
                    {formData.suggestedSteps.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem('suggestedSteps', index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addListItem('suggestedSteps')}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - PDF Viewer */}
        <Card className="sticky top-24">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>PDF Viewer</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">Page {currentPage} of 4</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(4, p + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white border border-border rounded-lg p-6 min-h-[600px] overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-center font-serif">
                  IN THE HIGH COURT OF{' '}
                  {highlightedField === 'courtName' ? (
                    <mark className="bg-yellow-200 animate-pulse">{formData.courtName.toUpperCase()}</mark>
                  ) : (
                    formData.courtName.toUpperCase()
                  )}
                </h3>
                <p className="text-center">
                  {highlightedField === 'caseNumber' ? (
                    <mark className="bg-yellow-200 animate-pulse">{formData.caseNumber}</mark>
                  ) : (
                    formData.caseNumber
                  )}
                </p>
                <p className="text-center text-sm">
                  Reserved on: 10th January, 2024
                  <br />
                  Pronounced on:{' '}
                  {highlightedField === 'dateOfOrder' ? (
                    <mark className="bg-yellow-200 animate-pulse">{formData.dateOfOrder}</mark>
                  ) : (
                    formData.dateOfOrder
                  )}
                </p>
                <p className="text-center text-sm mt-4">
                  CORAM:
                  <br />
                  {highlightedField === 'judge' ? (
                    <mark className="bg-yellow-200 animate-pulse">{formData.judge.toUpperCase()}</mark>
                  ) : (
                    formData.judge.toUpperCase()
                  )}
                </p>
                <p className="mt-4">
                  <strong>Petitioner:</strong>{' '}
                  {highlightedField === 'petitioner' ? (
                    <mark className="bg-yellow-200 animate-pulse">{formData.petitioner}</mark>
                  ) : (
                    formData.petitioner
                  )}
                </p>
                <p className="text-center">versus</p>
                <p>
                  <strong>Respondent:</strong>{' '}
                  {highlightedField === 'respondent' ? (
                    <mark className="bg-yellow-200 animate-pulse">{formData.respondent}</mark>
                  ) : (
                    formData.respondent
                  )}
                </p>
                <h4 className="mt-6">JUDGMENT</h4>
                <p className="text-sm">
                  {courtCase?.judgment?.summary ||
                    'The present writ petition has been filed seeking a direction to the respondents...'}
                </p>
                <h4 className="mt-4">DIRECTIONS:</h4>
                <ol className="text-sm">
                  {formData.keyDirections.map((direction, index) => (
                    <li key={index}>
                      {highlightedField === 'keyDirections' ? (
                        <mark className="bg-yellow-200 animate-pulse">{direction}</mark>
                      ) : (
                        direction
                      )}
                    </li>
                  ))}
                </ol>
                <h4 className="mt-4">FINAL DECISION:</h4>
                <p className="text-sm">
                  {highlightedField === 'finalDecision' ? (
                    <mark className="bg-yellow-200 animate-pulse">{formData.finalDecision}</mark>
                  ) : (
                    formData.finalDecision
                  )}
                </p>
                <p className="text-sm mt-4">
                  <strong>Deadline:</strong>{' '}
                  {highlightedField === 'deadline' ? (
                    <mark className="bg-yellow-200 animate-pulse">{formData.deadline}</mark>
                  ) : (
                    formData.deadline
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4 -mx-6 mt-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => router.push('/review')}>
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="outline" className="text-amber border-amber hover:bg-saffron-light" onClick={handleSendBack}>
              <Send className="mr-2 h-4 w-4" />
              Send Back for Edit
            </Button>
            <Button variant="outline" className="text-crimson border-crimson hover:bg-crimson-light" onClick={() => setRejectDialogOpen(true)}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button className="bg-jade hover:bg-jade/90" onClick={handleApprove}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve & Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-crimson">
              <AlertTriangle className="h-5 w-5" />
              Reject Extraction
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be recorded in the audit log.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-crimson hover:bg-crimson/90"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface FieldRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  confidence: number;
  onViewSource: () => void;
  isHighlighted: boolean;
  type?: 'text' | 'date';
  approval: boolean | null;
  onApprovalChange: (value: boolean | null) => void;
}

function FieldRow({
  label,
  value,
  onChange,
  confidence,
  onViewSource,
  isHighlighted,
  type = 'text',
  approval,
  onApprovalChange,
}: FieldRowProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-colors',
        isHighlighted ? 'bg-yellow-50 border-yellow-300' : 'bg-muted/30 border-border'
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm">{label}</Label>
        <div className="flex items-center gap-2">
          <ConfidenceBar score={confidence} />
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onViewSource}>
            <Eye className="h-3 w-3 mr-1" />
            View in PDF
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="flex-1" />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', approval === true && 'bg-jade-light text-jade')}
            onClick={() => onApprovalChange(approval === true ? null : true)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', approval === false && 'bg-crimson-light text-crimson')}
            onClick={() => onApprovalChange(approval === false ? null : false)}
          >
            <AlertTriangle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full',
            score >= 90 ? 'bg-jade' : score >= 75 ? 'bg-amber' : 'bg-crimson'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{score}%</span>
    </div>
  );
}
