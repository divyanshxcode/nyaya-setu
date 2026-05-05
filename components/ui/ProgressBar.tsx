import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  color?: string;
  height?: string;
}

export function ProgressBar({ 
  progress, 
  className, 
  color = "bg-[var(--accent-blue)]",
  height = "h-1.5" 
}: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn("w-full bg-[var(--surface-raised)] rounded-full overflow-hidden", height, className)}>
      <div 
        className={cn("h-full rounded-full transition-all duration-500 ease-out", color)}
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
}
