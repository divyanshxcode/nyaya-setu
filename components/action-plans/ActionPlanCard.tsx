import Link from "next/link";
import { Case } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { getDaysRemaining, formatDate } from "@/lib/utils";
import { Building2, Calendar, CheckSquare, ArrowRight, ArrowUpRight } from "lucide-react";

interface ActionPlanCardProps {
  caseData: Case;
}

export function ActionPlanCard({ caseData }: ActionPlanCardProps) {
  if (!caseData.actionPlan) return null;
  const { actionPlan } = caseData;

  const days = getDaysRemaining(actionPlan.deadline);
  const isOverdue = days < 0;

  const getPriorityBorder = (priority: string) => {
    switch(priority) {
      case "CRITICAL": return "border-t-[4px] border-t-[var(--critical)]";
      case "HIGH": return "border-t-[4px] border-t-[var(--warning)]";
      case "MEDIUM": return "border-t-[4px] border-t-[var(--info)]";
      default: return "border-t-[4px] border-t-slate-400";
    }
  };

  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden card-hover transition-all flex flex-col h-full ${getPriorityBorder(actionPlan.priority)}`}>
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex justify-between items-start mb-2">
          <Badge variant={actionPlan.priority.toLowerCase() as any}>Priority: {actionPlan.priority}</Badge>
          <span className="font-mono text-xs font-semibold text-[var(--accent-navy)] bg-[var(--surface-raised)] px-2 py-0.5 rounded border border-[var(--border)]">
            {caseData.caseNumber}
          </span>
        </div>
        <h3 className="font-semibold text-[var(--text-primary)] text-base mb-1 line-clamp-1" title={caseData.title}>
          {caseData.title}
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          {caseData.court} · Order: {formatDate(caseData.dateOfOrder)}
        </p>
      </div>

      <div className="p-4 bg-[var(--surface-raised)] border-b border-[var(--border)] flex-1">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Action Required</span>
          <Badge variant={actionPlan.actionType === "COMPLIANCE" ? "medium" : "high"} className="ml-auto">
            {actionPlan.actionType}
          </Badge>
        </div>
        
        <ul className="space-y-2 mb-4">
          {actionPlan.steps.slice(0, 3).map((step, idx) => (
            <li key={step.id} className="text-sm text-[var(--text-primary)] flex items-start gap-2">
              <span className="text-[var(--text-muted)] font-mono text-xs mt-0.5">{idx + 1}.</span>
              <span className="line-clamp-2">{step.description}</span>
            </li>
          ))}
          {actionPlan.steps.length > 3 && (
            <li className="text-xs text-[var(--text-muted)] font-medium pl-5 italic">
              + {actionPlan.steps.length - 3} more steps
            </li>
          )}
        </ul>
      </div>

      <div className="p-4 bg-[var(--surface)] flex flex-col gap-3 mt-auto shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Building2 className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="truncate max-w-[120px]">{caseData.departmentId.replace("dept-", "").toUpperCase()} Dept</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
            <span className={isOverdue ? "text-[var(--critical)] font-bold" : "font-medium"}>
              {formatDate(actionPlan.deadline)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] mt-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-navy)] text-white flex items-center justify-center font-bold text-[10px]">
              {caseData.assignedTo?.name.charAt(0) || "U"}
            </div>
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {caseData.assignedTo?.name || "Unassigned"}
            </span>
          </div>
          <Link href={`/cases/${caseData.id}`} className="text-xs font-semibold text-[var(--accent-blue)] flex items-center gap-1 hover:text-[var(--accent-navy)] hover:underline transition-all">
            View Details
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
