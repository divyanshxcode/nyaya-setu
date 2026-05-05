"use client";

import { useState } from "react";
import { AlertTriangle, Clock, FileText, ArrowRight, Filter, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function AppealDeadlinesPage() {
  const [filter, setFilter] = useState("All");

  const appealCases = [
    { id: "AP001", caseNumber: "WP (Crl) 1234/2024", title: "State vs. Construction Enterprises Ltd", daysRemaining: 3, deadline: "2025-03-18", priority: "CRITICAL", department: "Public Works", status: "urgent" },
    { id: "AP002", caseNumber: "WP (Crl) 5678/2024", title: "Municipal Corporation vs. Contractor", daysRemaining: 12, deadline: "2025-03-27", priority: "HIGH", department: "Urban Development", status: "approaching" },
    { id: "AP003", caseNumber: "WP (Crl) 9012/2024", title: "Revenue Dept vs. Landowner Association", daysRemaining: 25, deadline: "2025-04-09", priority: "MEDIUM", department: "Revenue", status: "normal" },
    { id: "AP005", caseNumber: "WP (Crl) 7890/2024", title: "Health Dept vs. Private Hospitals", daysRemaining: -2, deadline: "2025-03-03", priority: "CRITICAL", department: "Health", status: "overdue" }
  ];

  const totals = {
    urgent: appealCases.filter(c => c.status === "urgent" || c.status === "overdue").length,
    approaching: appealCases.filter(c => c.daysRemaining <= 15 && c.daysRemaining > 0).length,
    overdue: appealCases.filter(c => c.status === "overdue").length,
    total: appealCases.length
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="font-playfair text-[28px] font-semibold text-[var(--text-primary)]">Appeal Deadlines</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Track appeal filing deadlines and take timely action</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Cases</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-2">{totals.total}</p>
        </div>
        <div className="bg-[var(--critical-light)] border border-[var(--critical)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--critical)]">Urgent</p>
          <p className="text-2xl font-bold text-[var(--critical)] mt-2">{totals.urgent}</p>
        </div>
        <div className="bg-[var(--status-warning-bg)] border border-[var(--status-warning)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--status-warning)]">Approaching</p>
          <p className="text-2xl font-bold text-[var(--status-warning)] mt-2">{totals.approaching}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Overdue</p>
          <p className="text-2xl font-bold text-[var(--critical)] mt-2">{totals.overdue}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {appealCases.map((caseItem) => {
          const isOverdue = caseItem.daysRemaining < 0;
          const isUrgent = caseItem.daysRemaining <= 3 && caseItem.daysRemaining >= 0;

          return (
            <div key={caseItem.id} className={`p-4 rounded-lg border-l-4 ${isOverdue ? "bg-[var(--critical-light)] border-[var(--critical)]" : isUrgent ? "bg-[var(--status-warning-bg)] border-[var(--status-warning)]" : "bg-[var(--surface)] border-[var(--border)]"} border`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-bold text-[var(--accent-navy)]">{caseItem.caseNumber}</span>
                    <Badge variant={caseItem.priority.toLowerCase() as any}>{caseItem.priority}</Badge>
                  </div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">{caseItem.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                    <span>{caseItem.department}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Deadline: {formatDate(caseItem.deadline)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${isOverdue ? "text-[var(--critical)]" : isUrgent ? "text-[var(--status-warning)]" : "text-[var(--accent-blue)]"}`}>
                    {isOverdue ? `-${Math.abs(caseItem.daysRemaining)}` : caseItem.daysRemaining} days
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{isOverdue ? "Overdue" : "remaining"}</p>
                </div>
                <button className="p-2 text-[var(--accent-blue)] hover:bg-[var(--surface-raised)] rounded-lg transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
