'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { CaseStatusBadge, PriorityBadge } from '@/components/cases/CaseStatusBadge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { courtCases } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import {
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Building2,
  User,
  Scale,
} from 'lucide-react';

interface CaseDetailPageProps {
  params: Promise<{ caseId: string }>;
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { caseId } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [highlightedField, setHighlightedField] = useState<string | null>(null);

  const courtCase = courtCases.find((c) => c.id === caseId);

  if (!courtCase) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold mb-2">Case Not Found</h1>
        <p className="text-muted-foreground mb-4">The case you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push('/cases')}>Back to Cases</Button>
      </div>
    );
  }

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const extractedFields = courtCase.judgment?.extractedFields || [
    { fieldName: 'Case Number', value: courtCase.caseNumber, confidenceScore: 98 },
    { fieldName: 'Court Name', value: courtCase.courtName, confidenceScore: 99 },
    { fieldName: 'Judge', value: courtCase.judgeName, confidenceScore: 97 },
    { fieldName: 'Date of Order', value: courtCase.dateOfOrder, confidenceScore: 96 },
    { fieldName: 'Petitioner', value: courtCase.petitioner, confidenceScore: 94 },
    { fieldName: 'Respondent', value: courtCase.respondent, confidenceScore: 95 },
    { fieldName: 'Final Decision', value: courtCase.judgment?.finalDecision || 'N/A', confidenceScore: 92 },
    { fieldName: 'Department', value: courtCase.department, confidenceScore: 94 },
  ];

  const historyEvents = [
    { date: courtCase.createdAt, event: 'Case uploaded to system', user: 'Sh. Rakesh Kumar' },
    { date: courtCase.createdAt, event: 'OCR processing completed', user: 'System' },
    { date: courtCase.createdAt, event: 'AI extraction completed', user: 'System' },
    { date: courtCase.actionPlan?.approvedAt || courtCase.createdAt, event: 'Human verification completed', user: 'Dr. Amit Sharma' },
    { date: courtCase.actionPlan?.approvedAt || courtCase.createdAt, event: 'Action plan approved', user: courtCase.actionPlan?.approvedBy || 'Pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/cases')}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold">{courtCase.caseNumber}</h1>
          <p className="text-muted-foreground mt-1">
            {courtCase.courtName} | {courtCase.dateOfOrder}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <CaseStatusBadge status={courtCase.status} />
            <PriorityBadge priority={courtCase.priority} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Judgment PDF
          </Button>
          {courtCase.reviewStatus === 'approved' && (
            <Button className="bg-jade hover:bg-jade/90">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Action Plan
            </Button>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
          {['overview', 'judgment', 'action', 'history'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                'rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-colors',
                'data-[state=active]:border-saffron data-[state=active]:bg-transparent'
              )}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'judgment' && 'Judgment Extraction'}
              {tab === 'action' && 'Action Plan'}
              {tab === 'history' && 'History'}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Info */}
            <Card>
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow icon={<Scale className="h-4 w-4" />} label="Case Number" value={courtCase.caseNumber} />
                  <InfoRow icon={<Building2 className="h-4 w-4" />} label="Court" value={courtCase.courtName} />
                  <InfoRow label="Bench" value={courtCase.benchName} />
                  <InfoRow icon={<User className="h-4 w-4" />} label="Judge" value={courtCase.judgeName} />
                  <InfoRow label="Petitioner" value={courtCase.petitioner} />
                  <InfoRow label="Respondent" value={courtCase.respondent} />
                  <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date of Order" value={courtCase.dateOfOrder} />
                  <InfoRow icon={<Building2 className="h-4 w-4" />} label="Department" value={courtCase.department} />
                </div>
              </CardContent>
            </Card>

            {/* Decision & Directions */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Final Decision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-jade-light rounded-lg border border-jade/20">
                    <p className="font-medium text-jade">
                      {courtCase.judgment?.finalDecision || 'Decision pending verification'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {courtCase.judgment?.summary ||
                      'Court has issued directions to the respondent department. Please refer to the judgment extraction tab for detailed information.'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Key Directions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {(courtCase.judgment?.keyDirections || ['Direction 1', 'Direction 2', 'Direction 3']).map(
                      (direction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Checkbox
                            id={`direction-${index}`}
                            checked={checkedSteps.has(index)}
                            onCheckedChange={() => toggleStep(index)}
                          />
                          <label
                            htmlFor={`direction-${index}`}
                            className={cn(
                              'text-sm cursor-pointer transition-colors',
                              checkedSteps.has(index) ? 'text-muted-foreground line-through' : ''
                            )}
                          >
                            {direction}
                          </label>
                        </li>
                      )
                    )}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Deadlines Card */}
          {courtCase.judgment?.mentionedDeadlines && courtCase.judgment.mentionedDeadlines.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {courtCase.judgment.mentionedDeadlines.map((deadline, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-4 rounded-lg border flex-1 min-w-[200px]',
                        deadline.daysRemaining < 0
                          ? 'bg-crimson-light border-crimson/20'
                          : deadline.isUrgent
                          ? 'bg-saffron-light border-saffron/20'
                          : 'bg-jade-light border-jade/20'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {deadline.daysRemaining < 0 ? (
                          <AlertTriangle className="h-4 w-4 text-crimson" />
                        ) : deadline.isUrgent ? (
                          <Clock className="h-4 w-4 text-amber" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-jade" />
                        )}
                        <span className="font-medium text-sm">{deadline.description}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{deadline.date}</p>
                      <p
                        className={cn(
                          'text-sm font-medium mt-1',
                          deadline.daysRemaining < 0 ? 'text-crimson' : deadline.isUrgent ? 'text-amber' : 'text-jade'
                        )}
                      >
                        {deadline.daysRemaining < 0
                          ? `${Math.abs(deadline.daysRemaining)} days overdue`
                          : `${deadline.daysRemaining} days remaining`}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Judgment Extraction Tab */}
        <TabsContent value="judgment" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Extracted Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Extracted Fields</CardTitle>
                <CardDescription>
                  Fields extracted from the judgment with confidence scores
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Overall Confidence:</span>
                  <span className="text-lg font-bold text-jade">
                    {courtCase.judgment?.confidenceScore || 94}%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {extractedFields.map((field, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-3 rounded-lg border transition-colors cursor-pointer',
                        highlightedField === field.fieldName
                          ? 'bg-yellow-50 border-yellow-300'
                          : 'bg-muted/30 border-border hover:bg-muted/50'
                      )}
                      onClick={() => setHighlightedField(field.fieldName)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">{field.fieldName}</p>
                          <p className="text-sm font-medium">{field.value}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
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
                          <span className="text-xs text-muted-foreground w-10">
                            {field.confidenceScore}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PDF Preview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Judgment Preview</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Page 1 of 4</span>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-border rounded-lg p-6 min-h-[500px]">
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-center">
                      IN THE HIGH COURT OF{' '}
                      {highlightedField === 'Court Name' ? (
                        <mark className="bg-yellow-200">{courtCase.courtName.toUpperCase()}</mark>
                      ) : (
                        courtCase.courtName.toUpperCase()
                      )}
                    </h3>
                    <p className="text-center">
                      {highlightedField === 'Case Number' ? (
                        <mark className="bg-yellow-200">{courtCase.caseNumber}</mark>
                      ) : (
                        courtCase.caseNumber
                      )}
                    </p>
                    <p className="text-center text-sm mt-4">
                      CORAM:
                      <br />
                      {highlightedField === 'Judge' ? (
                        <mark className="bg-yellow-200">{courtCase.judgeName.toUpperCase()}</mark>
                      ) : (
                        courtCase.judgeName.toUpperCase()
                      )}
                    </p>
                    <p className="mt-4">
                      <strong>Petitioner:</strong>{' '}
                      {highlightedField === 'Petitioner' ? (
                        <mark className="bg-yellow-200">{courtCase.petitioner}</mark>
                      ) : (
                        courtCase.petitioner
                      )}
                    </p>
                    <p className="text-center">versus</p>
                    <p>
                      <strong>Respondent:</strong>{' '}
                      {highlightedField === 'Respondent' ? (
                        <mark className="bg-yellow-200">{courtCase.respondent}</mark>
                      ) : (
                        courtCase.respondent
                      )}
                    </p>
                    <p className="mt-4 text-sm">
                      <strong>Date of Order:</strong>{' '}
                      {highlightedField === 'Date of Order' ? (
                        <mark className="bg-yellow-200">{courtCase.dateOfOrder}</mark>
                      ) : (
                        courtCase.dateOfOrder
                      )}
                    </p>
                    <h4 className="mt-6">JUDGMENT</h4>
                    <p className="text-sm">{courtCase.judgment?.summary || 'Judgment text...'}</p>
                    <h4 className="mt-4">FINAL DECISION</h4>
                    <p className="text-sm">
                      {highlightedField === 'Final Decision' ? (
                        <mark className="bg-yellow-200">{courtCase.judgment?.finalDecision}</mark>
                      ) : (
                        courtCase.judgment?.finalDecision
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Action Plan Tab */}
        <TabsContent value="action" className="mt-6">
          {courtCase.actionPlan ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Action Plan</CardTitle>
                    <CardDescription>AI-generated action plan based on court directions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        courtCase.actionPlan.actionType === 'compliance'
                          ? 'bg-jade-light text-jade'
                          : courtCase.actionPlan.actionType === 'appeal'
                          ? 'bg-purple-50 text-purple-700'
                          : 'bg-blue-50 text-blue-700'
                      )}
                    >
                      {courtCase.actionPlan.actionType.charAt(0).toUpperCase() +
                        courtCase.actionPlan.actionType.slice(1)}
                    </span>
                    <PriorityBadge priority={courtCase.actionPlan.priority} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Responsible Department</p>
                    <p className="font-medium">{courtCase.actionPlan.responsibleDepartment}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Responsible Officer</p>
                    <p className="font-medium">{courtCase.actionPlan.responsibleOfficer || 'Not assigned'}</p>
                  </div>
                  <div className="p-4 bg-saffron-light rounded-lg">
                    <p className="text-xs text-muted-foreground">Last Date for Action</p>
                    <p className="font-medium text-amber">{courtCase.actionPlan.lastDateForAction}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <p className="text-sm text-muted-foreground">{courtCase.actionPlan.summary}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Suggested Next Steps</h4>
                  <ol className="space-y-3">
                    {courtCase.actionPlan.suggestedSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Checkbox
                          id={`step-${index}`}
                          checked={checkedSteps.has(index + 100)}
                          onCheckedChange={() => toggleStep(index + 100)}
                        />
                        <label
                          htmlFor={`step-${index}`}
                          className={cn(
                            'text-sm cursor-pointer transition-colors',
                            checkedSteps.has(index + 100) ? 'text-muted-foreground line-through' : ''
                          )}
                        >
                          {step}
                        </label>
                      </li>
                    ))}
                  </ol>
                </div>

                {courtCase.actionPlan.approvedBy ? (
                  <div className="p-4 bg-jade-light rounded-lg border border-jade/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-jade" />
                      <span className="font-medium text-jade">Action Plan Approved</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Approved by {courtCase.actionPlan.approvedBy} on {courtCase.actionPlan.approvedAt}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-saffron-light rounded-lg border border-saffron/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber" />
                      <span className="font-medium text-amber">Awaiting Human Verification</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      This action plan requires review and approval before execution.
                    </p>
                    <Link href={`/review/${courtCase.id}`}>
                      <Button className="mt-3 bg-navy hover:bg-navy-light">Start Review</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No action plan generated for this case yet.</p>
                <Button className="mt-4" variant="outline">
                  Generate Action Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>Complete timeline of all actions on this case</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {historyEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white text-xs font-medium shrink-0">
                      {event.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{event.event}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.user} &bull; {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
