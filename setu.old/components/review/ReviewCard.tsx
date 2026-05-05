import Link from "next/link";
import { Building2, ArrowRight, Eye, AlertTriangle, TrendingUp } from "lucide-react";
import { Case } from "@/lib/types";
import { getDaysRemaining, formatDate } from "@/lib/utils";
import { StatusDot } from "@/components/ui/StatusDot";
import { Badge } from "@/components/ui/Badge";

interface ReviewCardProps {
  caseData: Case;
}

export function ReviewCard({ caseData }: ReviewCardProps) {
  const days = caseData.actionPlan?.deadline ? getDaysRemaining(caseData.actionPlan.deadline) : null;
  const isOverdue = days !== null && days < 0;

  const getPriorityBorder = (priority: string) => {
    switch(priority) {
      case "CRITICAL": return "border-l-[4px] border-l-[var(--critical)]";
      case "HIGH": return "border-l-[4px] border-l-[var(--warning)]";
      case "MEDIUM": return "border-l-[4px] border-l-[var(--info)]";
      default: return "border-l-[4px] border-l-slate-400";
    }
  };

  const getOverallConfidence = () => {
    if (!caseData.extractedFields) return null;
    const allFields = [
      ...caseData.extractedFields.caseInformation,
      ...caseData.extractedFields.keyDirections,
      ...caseData.extractedFields.timelines
    ];
    if (allFields.length === 0) return null;
    const sum = allFields.reduce((acc, f) => acc + f.confidence, 0);
    return Math.round(sum / allFields.length);
  };

  const avgConfidence = getOverallConfidence();

  return (
    <div className={`bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 card-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${getPriorityBorder(caseData.priority)}`}>
      
      {/* LEFT: Core Details */}
      <div className="flex-1 min-w-0 pr-4 border-r border-transparent md:border-[var(--border)] h-full flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-sm font-semibold text-[var(--accent-navy)] bg-[var(--surface-raised)] px-2 py-0.5 rounded border border-[var(--border)]">
            {caseData.caseNumber}
          </span>
          <StatusDot status={caseData.status} />
          {caseData.status === "PENDING_REVIEW" && (
            <span className="text-[10px] uppercase font-bold text-[var(--status-pending)] tracking-wider">Awaiting Review</span>
          )}
        </div>
        <h3 className="font-semibold text-[var(--text-primary)] truncate text-base mb-1" title={caseData.title}>
          {caseData.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] truncate">
          {caseData.court} · Order: {formatDate(caseData.dateOfOrder)}
        </p>
      </div>

      {/* MIDDLE: Dept & Actions */}
      <div className="flex-1 md:px-4 border-r border-transparent md:border-[var(--border)] h-full flex flex-col justify-center gap-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)]">
          <Building2 className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <span className="truncate">{caseData.departmentId.replace("dept-", "").toUpperCase()} Department</span>
        </div>
        <div className="flex items-center gap-2">
          {caseData.actionPlan?.actionType && (
            <Badge variant={caseData.actionPlan.actionType === "COMPLIANCE" ? "medium" : "high"}>
              {caseData.actionPlan.actionType}
            </Badge>
          )}
          {avgConfidence && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
              avgConfidence >= 90 ? "bg-green-100 text-green-700" :
              avgConfidence >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
            }`}>
              {avgConfidence >= 90 ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {avgConfidence}% AI Confidence
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: Status & CTA */}
      <div className="md:w-56 shrink-0 md:pl-4 h-full flex flex-col justify-center gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[var(--accent-navy)] text-white flex items-center justify-center font-bold text-[10px]">
              {caseData.assignedTo?.name.charAt(0) || "U"}
            </div>
            <span className="text-xs text-[var(--text-secondary)] truncate w-20">
              {caseData.assignedTo?.name || "Unassigned"}
            </span>
          </div>
          {days !== null && (
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              isOverdue ? "bg-[var(--critical)] text-white" :
              days <= 3 ? "bg-red-100 text-red-700 border border-red-200" :
              days <= 7 ? "bg-orange-100 text-orange-700 border border-orange-200" :
              "bg-green-100 text-green-700 border border-green-200"
            }`}>
              {isOverdue ? `${Math.abs(days)}d Overdue` : `${days}d left`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <button className="p-2 border border-[var(--border)] rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <Link href={`/review/${caseData.id}`} className="flex-1 bg-[var(--accent-blue-light)] text-[var(--accent-blue)] border border-[var(--accent-blue)] rounded-md py-1.5 flex items-center justify-center gap-1.5 text-sm font-semibold hover:bg-[var(--accent-blue)] hover:text-white transition-colors group">
            Review Case
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
    </div>
  );
}
