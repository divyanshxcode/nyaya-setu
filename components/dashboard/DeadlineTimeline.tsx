'use client';

import { cn } from '@/lib/utils';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface DeadlineItem {
  caseNumber: string;
  department: string;
  description: string;
  daysRemaining: number;
  actionType: string;
}

interface DeadlineTimelineProps {
  deadlines: DeadlineItem[];
  className?: string;
}

export function DeadlineTimeline({ deadlines, className }: DeadlineTimelineProps) {
  return (
    <div className={cn('bg-card rounded-xl p-6 shadow-sm border border-border', className)}>
      <h3 className="font-semibold text-lg mb-4">Upcoming Deadlines</h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {deadlines.map((deadline, index) => {
          const isOverdue = deadline.daysRemaining < 0;
          const isUrgent = deadline.daysRemaining >= 0 && deadline.daysRemaining <= 7;
          
          return (
            <div
              key={`${deadline.caseNumber}-${index}`}
              className={cn(
                'relative pl-8 pb-4 border-l-2 last:border-l-0 last:pb-0 animate-fade-in',
                isOverdue ? 'border-crimson' : isUrgent ? 'border-amber' : 'border-jade'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  'absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center',
                  isOverdue ? 'bg-crimson' : isUrgent ? 'bg-amber' : 'bg-jade'
                )}
              >
                {isOverdue ? (
                  <AlertCircle className="h-2.5 w-2.5 text-white" />
                ) : isUrgent ? (
                  <Clock className="h-2.5 w-2.5 text-white" />
                ) : (
                  <CheckCircle className="h-2.5 w-2.5 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{deadline.caseNumber}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {deadline.department}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{deadline.description}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className={cn(
                    'font-medium',
                    isOverdue ? 'text-crimson' : isUrgent ? 'text-amber' : 'text-jade'
                  )}>
                    {isOverdue
                      ? `${Math.abs(deadline.daysRemaining)} days overdue`
                      : deadline.daysRemaining === 0
                      ? 'Due today'
                      : `${deadline.daysRemaining} days remaining`}
                  </span>
                  <span className="text-muted-foreground">{deadline.actionType}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
