import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { mockDepartments } from "@/lib/mockData";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function DepartmentSummary() {
  const topDepts = mockDepartments
    .sort((a, b) => b.activeCases - a.activeCases)
    .slice(0, 5);

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="font-semibold text-[var(--text-primary)]">Department Summary</h2>
      </div>
      <div className="p-0 flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr className="bg-[var(--surface-raised)] border-b border-[var(--border)]">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Department</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-right">Active</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-right">Pending</th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-right">Overdue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {topDepts.map((dept) => (
              <tr key={dept.id} className="hover:bg-[var(--surface-raised)] transition-colors group">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{dept.name}</p>
                  <div className="mt-2 w-full flex items-center gap-1">
                    <ProgressBar progress={(dept.complied / dept.activeCases) * 100} color="bg-[var(--status-verified)]" className="flex-1" height="h-1" />
                    <ProgressBar progress={(dept.pendingReview / dept.activeCases) * 100} color="bg-[var(--warning)]" className="flex-1" height="h-1" />
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-[var(--text-secondary)]">{dept.activeCases}</td>
                <td className="px-4 py-3 text-right text-sm text-[var(--text-secondary)]">{dept.pendingReview}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-[var(--critical)]">{dept.overdue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-[var(--border)] text-center shrink-0">
        <Link href="/departments" className="text-sm font-medium text-[var(--accent-blue)] hover:text-[var(--accent-navy)] flex items-center justify-center gap-1 transition-colors">
          View Full Report
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
