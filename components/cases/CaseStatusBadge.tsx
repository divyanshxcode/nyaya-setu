import { cn } from '@/lib/utils';
import type { CaseStatus, Priority } from '@/types';

interface CaseStatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

const statusConfig: Record<CaseStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  disposed: { label: 'Disposed', className: 'bg-gray-50 text-gray-700 border-gray-200' },
  appeal: { label: 'Appeal', className: 'bg-purple-50 text-purple-700 border-purple-200' },
  complied: { label: 'Complied', className: 'bg-jade-light text-jade border-jade/20' },
  overdue: { label: 'Overdue', className: 'bg-crimson-light text-crimson border-crimson/20' },
};

export function CaseStatusBadge({ status, className }: CaseStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; dotColor: string }> = {
  critical: { label: 'Critical', dotColor: 'bg-red-600' },
  high: { label: 'High', dotColor: 'bg-crimson' },
  medium: { label: 'Medium', dotColor: 'bg-amber' },
  low: { label: 'Low', dotColor: 'bg-jade' },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className={cn('w-2 h-2 rounded-full', config.dotColor)} />
      <span className="text-xs text-muted-foreground">{config.label}</span>
    </div>
  );
}
