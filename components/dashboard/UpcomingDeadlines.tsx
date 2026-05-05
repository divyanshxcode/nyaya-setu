import { AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { mockCases } from "@/lib/mockData";
import { getDaysRemaining } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export function UpcomingDeadlines() {
  const deadlines = mockCases
    .filter(c => c.actionPlan?.deadline)
    .sort((a, b) => new Date(a.actionPlan!.deadline).getTime() - new Date(b.actionPlan!.deadline).getTime())
    .slice(0, 5);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
        <h2 className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[var(--critical)]" />
          Critical Deadlines
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-[var(--border)]">
          {deadlines.map((c) => {
            const days = getDaysRemaining(c.actionPlan!.deadline);
            let pillColor = "bg-[var(--status-verified-bg)] text-[var(--status-verified)]";
            if (days <= 3) pillColor = "bg-[var(--critical)] text-white";
            else if (days <= 7) pillColor = "bg-[var(--warning)] text-white";

            return (
              <li key={c.id} className="p-4 hover:bg-[var(--surface-raised)] transition-colors group">
                <Link href={`/cases/${c.id}`} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[13px] text-[var(--accent-navy)]">{c.caseNumber}</span>
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] bg-[var(--border)] px-1.5 py-0.5 rounded">
                        {c.departmentId.replace("dept-", "").toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-primary)] font-medium truncate" title={c.title}>
                      {c.title}
                    </p>
                  </div>
                  <div className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${pillColor}`}>
                    {days < 0 ? `${Math.abs(days)}d Overdue` : `${days}d left`}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-3 border-t border-[var(--border)] text-center">
        <Link href="/action-plans" className="text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-navy)] flex items-center justify-center gap-1 transition-colors">
          View All Deadlines
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
