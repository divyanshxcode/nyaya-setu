import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  alert?: boolean;
  progress?: number;
  className?: string;
}

export function StatCard({ title, value, icon, trend, alert, progress, className }: StatCardProps) {
  return (
    <div className={cn(
      'bg-card rounded-xl p-6 shadow-sm border border-border animate-fade-in',
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {alert && (
              <span className="h-3 w-3 rounded-full bg-amber animate-pulse-badge" />
            )}
          </div>
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend.direction === 'up' ? 'text-jade' : 'text-crimson'
            )}>
              {trend.direction === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.value}% from last month</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-jade rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
