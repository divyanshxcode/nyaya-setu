'use client';

import React, { useMemo } from 'react';
import { useExtraction } from '@/lib/extraction-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Download,
  FileJson,
  ShieldAlert,
} from 'lucide-react';
import type { ActionItem, ActionStatus, Priority } from '@/types';

function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusIcon(status: ActionStatus) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'escalated':
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case 'in_progress':
      return <Clock3 className="h-4 w-4 text-blue-600" />;
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
  }
}

function formatDate(value?: string) {
  if (!value) return 'No deadline';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

function SectionTitle({
  title,
  count,
}: {
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {typeof count === 'number' && (
        <Badge variant="outline" className="h-5 rounded-full px-2 text-[11px]">
          {count}
        </Badge>
      )}
    </div>
  );
}

function ActionItemCard({
  action,
  onStatusChange,
  onAssigneeChange,
  onDeadlineChange,
}: {
  action: ActionItem;
  onStatusChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {getStatusIcon(action.status)}
            <h4 className="text-sm font-semibold text-foreground">{action.title}</h4>
            <Badge className={`border ${getPriorityColor(action.priority)}`}>{action.priority}</Badge>
            <Badge variant="outline" className="capitalize">
              {action.section}
            </Badge>
          </div>
          <p className="text-sm leading-5 text-muted-foreground">{action.description}</p>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-3 lg:w-[390px]">
          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
            <Select value={action.status} onValueChange={onStatusChange}>
              <SelectTrigger className="h-9 bg-slate-50 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Owner</p>
            <Input
              value={action.responsibleParty}
              onChange={(e) => onAssigneeChange(e.target.value)}
              className="h-9 bg-slate-50 text-xs"
              placeholder="Assign owner"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Deadline</p>
            {action.deadline ? (
              <Input
                type="date"
                value={action.deadline.split('T')[0]}
                onChange={(e) => onDeadlineChange(e.target.value)}
                className="h-9 bg-slate-50 text-xs"
              />
            ) : (
              <div className="flex h-9 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-xs text-muted-foreground">
                No deadline
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExtractionStep3() {
  const {
    actionPlan,
    isLoading,
    error,
    updateActionItemStatus,
    updateActionItemAssignee,
    updateActionItemDeadline,
    exportActionPlanPDF,
    exportActionPlanJSON,
  } = useExtraction();

  const stats = useMemo(() => {
    if (!actionPlan) {
      return { total: 0, urgent: 0, nearest: null as string | null, riskLevel: 'unknown' as const };
    }

    const total = actionPlan.actionItems.length;
    const urgent = actionPlan.actionItems.filter(
      (item) => item.priority === 'critical' || item.priority === 'high'
    ).length;

    const now = new Date();
    const validDeadlines = actionPlan.actionItems
      .filter((item) => item.deadline)
      .map((item) => ({
        date: new Date(item.deadline!),
        deadline: item.deadline!,
      }))
      .filter((item) => item.date > now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const riskCount = actionPlan.riskAssessment?.nonComplianceRisks?.length || 0;
    const riskLevel = riskCount > 3 ? 'high' : riskCount > 1 ? 'medium' : 'low';

    return { total, urgent, nearest: validDeadlines[0]?.deadline || null, riskLevel };
  }, [actionPlan]);

  const groupedActions = useMemo(() => {
    if (!actionPlan) return { immediate: [], backlog: [] as ActionItem[] };

    return {
      immediate: actionPlan.actionItems.filter(
        (item) => item.priority === 'critical' || item.priority === 'high'
      ),
      backlog: actionPlan.actionItems.filter(
        (item) => item.priority !== 'critical' && item.priority !== 'high'
      ),
    };
  }, [actionPlan]);

  if (!actionPlan) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <p>No action plan available. Please complete Step 2 first.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between p-3.5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total actions</p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{stats.total}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-slate-300" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between p-3.5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Urgent now</p>
              <p className="mt-2 text-3xl font-semibold text-red-600">{stats.urgent}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-200" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between p-3.5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nearest deadline</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{formatDate(stats.nearest || undefined)}</p>
            </div>
            <Clock3 className="h-8 w-8 text-slate-300" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center justify-between p-3.5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Risk level</p>
              <div className="mt-2">
                <Badge className={`border ${getPriorityColor(stats.riskLevel as Priority)}`}>
                  {stats.riskLevel.charAt(0).toUpperCase() + stats.riskLevel.slice(1)}
                </Badge>
              </div>
            </div>
            <ShieldAlert className="h-8 w-8 text-slate-300" />
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm leading-6 text-foreground">{actionPlan.executiveSummary}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <SectionTitle title="Action Items" count={actionPlan.actionItems.length} />
                <div className="text-xs text-muted-foreground">Directly editable</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {groupedActions.immediate.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Immediate focus
                  </p>
                  {groupedActions.immediate.map((action) => (
                    <ActionItemCard
                      key={action.id}
                      action={action}
                      onStatusChange={(value) => updateActionItemStatus(action.id, value)}
                      onAssigneeChange={(value) => updateActionItemAssignee(action.id, value)}
                      onDeadlineChange={(value) => updateActionItemDeadline(action.id, value)}
                    />
                  ))}
                </div>
              )}

              {groupedActions.backlog.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Remaining items
                  </p>
                  {groupedActions.backlog.map((action) => (
                    <ActionItemCard
                      key={action.id}
                      action={action}
                      onStatusChange={(value) => updateActionItemStatus(action.id, value)}
                      onAssigneeChange={(value) => updateActionItemAssignee(action.id, value)}
                      onDeadlineChange={(value) => updateActionItemDeadline(action.id, value)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {actionPlan.complianceRequirements.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <SectionTitle title="Compliance Requirements" count={actionPlan.complianceRequirements.length} />
              </CardHeader>
              <CardContent className="grid gap-2.5 pt-0 md:grid-cols-2">
                {actionPlan.complianceRequirements.map((req) => (
                  <div key={req.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-semibold text-foreground">{req.description}</h4>
                      <Badge className={`border shrink-0 ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </Badge>
                    </div>
                    {req.legalBasis && (
                      <p className="mt-1.5 text-sm leading-5 text-muted-foreground">{req.legalBasis}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{req.responsibleDepartment || 'No department assigned'}</span>
                      <Badge variant="outline" className="h-5 rounded-full px-2 text-[11px]">{formatDate(req.deadline)}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {actionPlan.keyTimelines.length > 0 && (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-2">
                <SectionTitle title="Key Timelines" count={actionPlan.keyTimelines.length} />
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {actionPlan.keyTimelines.map((timeline, idx) => (
                  <div key={idx} className="flex gap-3 rounded-lg border border-slate-200 p-3">
                    <div className="min-w-28">
                      <Badge variant="outline" className="rounded-full px-2 text-[11px]">{formatDate(timeline.date)}</Badge>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">{timeline.description}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-[11px]">{timeline.isExplicit ? 'Explicit' : 'Inferred'}</Badge>
                        <Badge variant="outline" className="capitalize text-[11px]">{timeline.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm xl:sticky xl:top-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Risk & Decision Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {actionPlan.appealConsiderations && (
                <div className="space-y-2.5">
                  <SectionTitle title="Appeal Considerations" />
                  <Badge
                    className={`border ${getPriorityColor(
                      actionPlan.appealConsiderations.likelihoodOfSuccess === 'high'
                        ? 'high'
                        : actionPlan.appealConsiderations.likelihoodOfSuccess === 'medium'
                          ? 'medium'
                          : 'low'
                    )}`}
                  >
                    {actionPlan.appealConsiderations.likelihoodOfSuccess} likelihood
                  </Badge>
                  {actionPlan.appealConsiderations.reasoning && (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {actionPlan.appealConsiderations.reasoning}
                    </p>
                  )}
                  {actionPlan.appealConsiderations.groundsForAppeal.length > 0 && (
                    <div className="space-y-1.5">
                      {actionPlan.appealConsiderations.groundsForAppeal.map((ground, idx) => (
                        <div key={idx} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-foreground">
                          {ground}
                        </div>
                      ))}
                    </div>
                  )}
                  {actionPlan.appealConsiderations.recommendedNextSteps.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Recommended next steps
                      </p>
                      {actionPlan.appealConsiderations.recommendedNextSteps.map((step, idx) => (
                        <div key={idx} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                          {step}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {actionPlan.riskAssessment && (
                <div className="space-y-2.5">
                  <SectionTitle title="Risk Assessment" />
                  {actionPlan.riskAssessment.nonComplianceRisks.length > 0 && (
                    <div className="space-y-1.5">
                      {actionPlan.riskAssessment.nonComplianceRisks.map((risk, idx) => (
                        <div key={idx} className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-900">
                          {risk}
                        </div>
                      ))}
                    </div>
                  )}
                  {actionPlan.riskAssessment.financialExposure && (
                    <div className="rounded-md border border-slate-200 px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Financial exposure
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {actionPlan.riskAssessment.financialExposure}
                      </p>
                    </div>
                  )}
                  {actionPlan.riskAssessment.reputationalRisk && (
                    <div className="rounded-md border border-slate-200 px-3 py-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Reputational risk
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {actionPlan.riskAssessment.reputationalRisk}
                      </p>
                    </div>
                  )}
                  {actionPlan.riskAssessment.escalationRisks.length > 0 && (
                    <div className="space-y-1.5">
                      {actionPlan.riskAssessment.escalationRisks.map((risk, idx) => (
                        <div key={idx} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                          {risk}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {actionPlan.recommendedDocumentation.length > 0 && (
                <div className="space-y-2.5">
                  <SectionTitle title="Documentation" count={actionPlan.recommendedDocumentation.length} />
                  <div className="space-y-1.5">
                    {actionPlan.recommendedDocumentation.map((doc, idx) => (
                      <div key={idx} className="rounded-md border border-slate-200 px-3 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{doc.documentType}</p>
                          <Badge className={`border ${getPriorityColor(doc.priority)}`}>{doc.priority}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{doc.purpose}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{formatDate(doc.deadline)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {actionPlan.externalCounselInstructions.length > 0 && (
                <div className="space-y-2.5">
                  <SectionTitle title="External Counsel" count={actionPlan.externalCounselInstructions.length} />
                  {actionPlan.externalCounselInstructions.map((instruction, idx) => (
                    <div key={idx} className="rounded-md border border-slate-200 px-3 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline">{instruction.priority}</Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(instruction.deadline)}</span>
                      </div>
                      <p className="mt-2 text-sm text-foreground">{instruction.instruction}</p>
                    </div>
                  ))}
                </div>
              )}

              {actionPlan.internalCommunicationPlan.length > 0 && (
                <div className="space-y-2.5">
                  <SectionTitle title="Internal Communication" count={actionPlan.internalCommunicationPlan.length} />
                  {actionPlan.internalCommunicationPlan.map((comm, idx) => (
                    <div key={idx} className="rounded-md border border-slate-200 px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{comm.stakeholder}</p>
                          <p className="text-xs text-muted-foreground">{comm.communicationChannel}</p>
                        </div>
                        <Badge className={`border ${getPriorityColor(comm.priority)}`}>{comm.priority}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{comm.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={exportActionPlanPDF}
          disabled={isLoading}
          className="sm:flex-1"
          variant="outline"
        >
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        <Button
          onClick={exportActionPlanJSON}
          disabled={isLoading}
          className="sm:flex-1"
          variant="outline"
        >
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </Button>
      </div>
    </div>
  );
}
