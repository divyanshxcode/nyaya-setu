import { Upload, CheckCircle2, XCircle, Pencil, AlertOctagon } from "lucide-react";
import { mockActivities } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

export function RecentActivity() {
  const getIcon = (type: string) => {
    switch (type) {
      case "UPLOAD": return <Upload className="w-4 h-4 text-[var(--info)]" />;
      case "VERIFIED": return <CheckCircle2 className="w-4 h-4 text-[var(--status-verified)]" />;
      case "REJECTED": return <XCircle className="w-4 h-4 text-[var(--critical)]" />;
      case "EDITED": return <Pencil className="w-4 h-4 text-[var(--status-review)]" />;
      case "ESCALATED": return <AlertOctagon className="w-4 h-4 text-[var(--warning)]" />;
      default: return <Upload className="w-4 h-4 text-[var(--text-muted)]" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case "UPLOAD": return "bg-[var(--accent-blue-light)]";
      case "VERIFIED": return "bg-[var(--status-verified-bg)]";
      case "REJECTED": return "bg-[var(--status-rejected-bg)]";
      case "EDITED": return "bg-[var(--status-review-bg)]";
      case "ESCALATED": return "bg-[var(--status-pending-bg)]";
      default: return "bg-[var(--surface-raised)]";
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="font-semibold text-[var(--text-primary)]">Recent Activity</h2>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="relative border-l border-[var(--border-strong)] ml-3 space-y-6">
          {mockActivities.map((act) => (
            <div key={act.id} className="relative pl-6">
              <div className={`absolute -left-[14px] top-0.5 w-7 h-7 rounded-full flex items-center justify-center border-2 border-[var(--surface)] ${getBg(act.type)}`}>
                {getIcon(act.type)}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {act.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-xs text-[var(--text-muted)]">
                    by <span className="font-medium text-[var(--text-secondary)]">{act.user}</span>
                  </span>
                  <span className="text-[var(--text-muted)] text-[10px]">•</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {formatDate(act.timestamp)}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex text-[11px] font-mono font-medium bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--accent-navy)] px-2 py-0.5 rounded">
                    {act.caseId}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
