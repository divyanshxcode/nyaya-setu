import { cn } from "@/lib/utils";
import { CaseStatus } from "@/lib/types";

interface StatusDotProps {
  status: CaseStatus;
  className?: string;
}

export function StatusDot({ status, className }: StatusDotProps) {
  const isPending = status === "PENDING_REVIEW";
  
  return (
    <div className={cn("relative flex items-center justify-center w-3 h-3 shrink-0", className)}>
      {isPending && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--status-pending)] opacity-40 animate-pulse"></span>
      )}
      <span className={cn(
        "relative inline-flex rounded-full h-2 w-2",
        status === "PENDING_REVIEW" ? "bg-[var(--status-pending)]" : "",
        status === "VERIFIED" || status === "COMPLIED" ? "bg-[var(--status-verified)]" : "",
        status === "REJECTED" || status === "OVERDUE" ? "bg-[var(--critical)]" : "",
        status === "PROCESSING" || status === "APPEALED" ? "bg-[var(--info)]" : "",
      )}></span>
    </div>
  );
}
