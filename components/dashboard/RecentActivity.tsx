'use client';

import { cn } from '@/lib/utils';
import type { ActivityItem } from '@/types';
import { CheckCircle, XCircle, Upload, AlertTriangle, PlayCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  activities: ActivityItem[];
  className?: string;
}

const activityIcons = {
  approved: { icon: CheckCircle, color: 'text-jade bg-jade-light' },
  rejected: { icon: XCircle, color: 'text-crimson bg-crimson-light' },
  uploaded: { icon: Upload, color: 'text-blue-600 bg-blue-50' },
  deadline_alert: { icon: AlertTriangle, color: 'text-amber bg-saffron-light' },
  review_started: { icon: PlayCircle, color: 'text-purple-600 bg-purple-50' },
};

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <div className={cn('bg-card rounded-xl p-6 shadow-sm border border-border', className)}>
      <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {activities.map((activity, index) => {
          const { icon: Icon, color } = activityIcons[activity.type];
          
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* User avatar */}
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-xs font-semibold text-white shrink-0">
                {activity.user.initials}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className={cn('p-1 rounded', color)}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium truncate">{activity.user.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {activity.description}
                </p>
                {activity.caseNumber && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {activity.caseNumber}
                  </span>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
