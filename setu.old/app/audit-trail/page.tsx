"use client";

import { useState } from "react";
import { FileText, Search, Download } from "lucide-react";

export default function AuditTrailPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const auditLogs = [
    { id: "AUD001", timestamp: "2025-03-15 14:32:05", user: "Rajesh Kumar", action: "VERIFIED", resource: "Case WP (Crl) 1234/2024", changes: "Approved extraction and action plan", status: "success" },
    { id: "AUD002", timestamp: "2025-03-15 13:15:22", user: "Priya Sharma", action: "EDITED", resource: "Case WP (Crl) 5678/2024", changes: "Modified deadline from 30 days to 45 days", status: "success" },
    { id: "AUD003", timestamp: "2025-03-15 12:45:10", user: "System", action: "UPLOADED", resource: "Judgment PDF - WP (Crl) 9012/2024", changes: "New judgment PDF processed via CCMS API", status: "success" },
    { id: "AUD004", timestamp: "2025-03-15 11:20:30", user: "Vikram Singh", action: "REJECTED", resource: "Case WP (Crl) 3456/2024", changes: "Rejected due to incomplete case information", status: "success" },
    { id: "AUD006", timestamp: "2025-03-15 09:32:15", user: "Rajesh Kumar", action: "EXPORTED", resource: "Action Plans Report (30 days)", changes: "Downloaded compliance report in CSV format", status: "success" },
  ];

  const actionTypes = ["All", "VERIFIED", "EDITED", "UPLOADED", "REJECTED", "EXPORTED"];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold text-[var(--text-primary)]">Audit Trail</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Complete system activity log</p>
        </div>
        <button className="px-4 py-2 bg-[var(--accent-navy)] text-white rounded-lg font-medium text-sm hover:bg-opacity-90 flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Logs
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input type="text" placeholder="Search by case, user, or resource..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[var(--accent-blue)]" />
        </div>
      </div>

      <div className="flex gap-2 pb-2 border-b border-[var(--border)] overflow-x-auto">
        {actionTypes.map((type) => (
          <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${filterType === type ? "bg-[var(--accent-navy)] text-white" : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:bg-[var(--border)]"}`}>
            {type}
          </button>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-raised)] border-b border-[var(--border)]">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">Timestamp</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">User</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">Action</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">Resource</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">Changes</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-raised)]">
                <td className="px-6 py-3 text-[var(--text-secondary)] font-mono text-xs">{log.timestamp}</td>
                <td className="px-6 py-3 text-[var(--text-primary)] font-medium">{log.user}</td>
                <td className="px-6 py-3"><span className="font-bold uppercase text-xs text-[var(--accent-blue)]">{log.action}</span></td>
                <td className="px-6 py-3 text-[var(--text-primary)]"><p className="font-medium">{log.resource}</p></td>
                <td className="px-6 py-3 text-[var(--text-secondary)] text-xs max-w-xs truncate">{log.changes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
