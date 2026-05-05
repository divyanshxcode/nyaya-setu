'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { reviewRecords, courtCases } from '@/lib/mock-data';
import type { ReviewStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle, CheckCircle, XCircle, Edit, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | ReviewStatus>('all');

  const filteredRecords =
    activeFilter === 'all'
      ? reviewRecords
      : reviewRecords.filter((r) => r.status === activeFilter);

  const statusCounts = {
    all: reviewRecords.length,
    pending_review: reviewRecords.filter((r) => r.status === 'pending_review').length,
    approved: reviewRecords.filter((r) => r.status === 'approved').length,
    rejected: reviewRecords.filter((r) => r.status === 'rejected').length,
    needs_edit: reviewRecords.filter((r) => r.status === 'needs_edit').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Pending Reviews (${statusCounts.pending_review})`}
        description="Human verification queue for AI-extracted case data"
      />

      {/* Filter Tabs */}
      <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as typeof activeFilter)}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="all" className="gap-2">
            All <span className="text-xs bg-muted px-1.5 rounded">{statusCounts.all}</span>
          </TabsTrigger>
          <TabsTrigger value="pending_review" className="gap-2">
            Pending <span className="text-xs bg-amber/20 text-amber px-1.5 rounded">{statusCounts.pending_review}</span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            Approved <span className="text-xs bg-jade/20 text-jade px-1.5 rounded">{statusCounts.approved}</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            Rejected <span className="text-xs bg-crimson/20 text-crimson px-1.5 rounded">{statusCounts.rejected}</span>
          </TabsTrigger>
          <TabsTrigger value="needs_edit" className="gap-2">
            Needs Edit <span className="text-xs bg-blue-500/20 text-blue-600 px-1.5 rounded">{statusCounts.needs_edit}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredRecords.map((record) => {
          const courtCase = courtCases.find((c) => c.id === record.caseId);
          const isLowConfidence = record.confidenceScore < 75;
          const isUrgent = record.deadline && new Date(record.deadline) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

          return (
            <Card
              key={record.id}
              className={cn(
                'transition-all hover:shadow-md',
                isLowConfidence && record.status === 'pending_review' && 'border-amber',
                isUrgent && record.status === 'pending_review' && 'border-crimson'
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{courtCase?.caseNumber || record.caseName}</CardTitle>
                    <CardDescription className="mt-1">
                      {courtCase?.courtName || 'Court'} | {courtCase?.department || 'Department'}
                    </CardDescription>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Confidence Score */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Extraction Confidence</span>
                    <span
                      className={cn(
                        'font-medium',
                        record.confidenceScore >= 85
                          ? 'text-jade'
                          : record.confidenceScore >= 70
                          ? 'text-amber'
                          : 'text-crimson'
                      )}
                    >
                      {record.confidenceScore}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        record.confidenceScore >= 85
                          ? 'bg-jade'
                          : record.confidenceScore >= 70
                          ? 'bg-amber'
                          : 'bg-crimson'
                      )}
                      style={{ width: `${record.confidenceScore}%` }}
                    />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Submitted</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(record.submittedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Assigned To</p>
                    <p className="font-medium truncate">{record.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Fields Extracted</p>
                    <p className="font-medium">{record.fieldsCount} fields</p>
                  </div>
                  {record.deadline && (
                    <div>
                      <p className="text-muted-foreground text-xs">Deadline</p>
                      <p className={cn('font-medium', isUrgent && 'text-crimson')}>{record.deadline}</p>
                    </div>
                  )}
                </div>

                {/* Warnings */}
                {(isLowConfidence || isUrgent) && record.status === 'pending_review' && (
                  <div className="flex flex-wrap gap-2">
                    {isLowConfidence && (
                      <div className="flex items-center gap-1 text-xs text-amber bg-saffron-light px-2 py-1 rounded">
                        <AlertTriangle className="h-3 w-3" />
                        Low Confidence
                      </div>
                    )}
                    {isUrgent && (
                      <div className="flex items-center gap-1 text-xs text-crimson bg-crimson-light px-2 py-1 rounded">
                        <Clock className="h-3 w-3" />
                        Urgent Deadline
                      </div>
                    )}
                  </div>
                )}

                {/* Reviewer Notes */}
                {record.reviewerNotes && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Reviewer Notes</p>
                    <p className="text-sm">{record.reviewerNotes}</p>
                  </div>
                )}

                {/* Action Button */}
                {record.status === 'pending_review' && (
                  <Link href={`/review/${record.caseId}`}>
                    <Button className="w-full bg-navy hover:bg-navy-light">
                      Start Review
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {record.status === 'needs_edit' && (
                  <Link href={`/review/${record.caseId}`}>
                    <Button className="w-full" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit & Resubmit
                    </Button>
                  </Link>
                )}
                {(record.status === 'approved' || record.status === 'rejected') && (
                  <Link href={`/cases/${record.caseId}`}>
                    <Button className="w-full" variant="outline">
                      View Case Details
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No reviews found for this filter.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const config = {
    pending_review: { icon: Clock, color: 'bg-saffron-light text-amber', label: 'Pending' },
    approved: { icon: CheckCircle, color: 'bg-jade-light text-jade', label: 'Approved' },
    rejected: { icon: XCircle, color: 'bg-crimson-light text-crimson', label: 'Rejected' },
    needs_edit: { icon: Edit, color: 'bg-blue-50 text-blue-700', label: 'Needs Edit' },
  };

  const { icon: Icon, color, label } = config[status];

  return (
    <div className={cn('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', color)}>
      <Icon className="h-3 w-3" />
      {label}
    </div>
  );
}
