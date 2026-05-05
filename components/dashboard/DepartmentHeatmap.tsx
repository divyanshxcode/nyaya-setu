'use client';

import { cn } from '@/lib/utils';
import type { Department } from '@/types';

interface DepartmentHeatmapProps {
  departments: Department[];
  className?: string;
}

export function DepartmentHeatmap({ departments, className }: DepartmentHeatmapProps) {
  return (
    <div className={cn('bg-card rounded-xl p-6 shadow-sm border border-border', className)}>
      <h3 className="font-semibold text-lg mb-4">Department Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {departments.map((dept, index) => (
          <div
            key={dept.id}
            className="p-4 rounded-lg border border-border hover:border-saffron/50 transition-colors animate-fade-in cursor-pointer"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{dept.shortCode}</span>
              <span
                className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  dept.complianceRate >= 80
                    ? 'bg-jade-light text-jade'
                    : dept.complianceRate >= 60
                    ? 'bg-saffron-light text-amber'
                    : 'bg-crimson-light text-crimson'
                )}
              >
                {dept.complianceRate}%
              </span>
            </div>
            
            {/* Compliance bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  dept.complianceRate >= 80
                    ? 'bg-jade'
                    : dept.complianceRate >= 60
                    ? 'bg-amber'
                    : 'bg-crimson'
                )}
                style={{ width: `${dept.complianceRate}%` }}
              />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span>
                  <span className="text-amber font-medium">{dept.pendingActions}</span> pending
                </span>
                <span>
                  <span className="text-crimson font-medium">{dept.overdueActions}</span> overdue
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
