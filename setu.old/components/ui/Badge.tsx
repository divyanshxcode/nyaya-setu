import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "critical" | "high" | "medium" | "low" | "success" | "warning";
  children: React.ReactNode;
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-[var(--surface-raised)] text-[var(--text-secondary)] border-[var(--border)]",
    critical: "bg-red-600 text-white border-transparent",
    high: "bg-orange-500 text-white border-transparent",
    medium: "bg-blue-500 text-white border-transparent",
    low: "bg-slate-400 text-white border-transparent",
    success: "bg-[var(--status-verified-bg)] text-[var(--status-verified)] border-[var(--status-verified)]",
    warning: "bg-[var(--status-pending-bg)] text-[var(--status-pending)] border-[var(--status-pending)]",
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
