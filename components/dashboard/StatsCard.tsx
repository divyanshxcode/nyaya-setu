import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  colorType?: "default" | "warning" | "verified" | "critical";
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, colorType = "default", className }: StatsCardProps) {
  const colorMap = {
    default: "border-[var(--accent-navy)] text-[var(--accent-navy)]",
    warning: "border-[var(--warning)] text-[var(--warning)]",
    verified: "border-[var(--status-verified)] text-[var(--status-verified)]",
    critical: "border-[var(--critical)] text-[var(--critical)]",
  };

  const bgMap = {
    default: "bg-[var(--accent-blue-light)]",
    warning: "bg-[var(--status-pending-bg)]",
    verified: "bg-[var(--status-verified-bg)]",
    critical: "bg-[var(--status-rejected-bg)]",
  };

  return (
    <div className={cn("bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 card-hover relative overflow-hidden flex flex-col justify-between h-[140px]", className)}>
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", colorMap[colorType].split(' ')[0])} />
      
      <div className="flex justify-between items-start">
        <h3 className="text-[13px] font-medium text-[var(--text-secondary)]">{title}</h3>
        <div className={cn("p-2 rounded-lg", bgMap[colorType])}>
          <Icon className={cn("w-5 h-5", colorMap[colorType].split(' ')[1])} />
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-2">
        <div className="text-4xl font-bold font-dm text-[var(--text-primary)]">
          {value}
        </div>
        {trend !== undefined && (
          <div className={cn(
            "flex items-center text-xs font-bold px-1.5 py-0.5 rounded",
            trend >= 0 ? "text-[var(--status-verified)] bg-[var(--status-verified-bg)]" : "text-[var(--critical)] bg-[var(--status-rejected-bg)]"
          )}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
