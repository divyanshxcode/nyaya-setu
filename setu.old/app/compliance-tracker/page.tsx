"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";

export default function ComplianceTrackerPage() {
  const [selectedDept, setSelectedDept] = useState("All");

  const complianceTasks = [
    { id: "CMP001", caseNumber: "WP (Crl) 1234/2024", title: "File compliance report for Highway Construction", department: "Public Works", deadline: "2025-03-20", status: "PENDING", progress: 0, priority: "HIGH" },
    { id: "CMP002", caseNumber: "WP (Crl) 5678/2024", title: "Submit payment of penalty amount", department: "Public Works", deadline: "2025-03-25", status: "IN_PROGRESS", progress: 60, priority: "CRITICAL" },
    { id: "CMP003", caseNumber: "WP (Crl) 9012/2024", title: "Coordinate with Revenue Department", department: "Revenue", deadline: "2025-04-10", status: "PENDING", progress: 0, priority: "MEDIUM" },
    { id: "CMP004", caseNumber: "WP (Crl) 3456/2024", title: "Update compliance documentation", department: "Public Works", deadline: "2025-03-28", status: "COMPLETED", progress: 100, priority: "MEDIUM" },
    { id: "CMP005", caseNumber: "WP (Crl) 7890/2024", title: "Health Department compliance review", department: "Health", deadline: "2025-03-15", status: "OVERDUE", progress: 30, priority: "CRITICAL" },
  ];

  const stats = {
    total: complianceTasks.length,
    completed: complianceTasks.filter(t => t.status === "COMPLETED").length,
    inProgress: complianceTasks.filter(t => t.status === "IN_PROGRESS").length,
    overdue: complianceTasks.filter(t => t.status === "OVERDUE").length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="text-[28px] font-semibold text-[var(--text-primary)]">Compliance Tracker</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Monitor compliance tasks and their progress</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Tasks</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] mt-2">{stats.total}</p>
        </div>
        <div className="bg-[var(--status-verified-bg)] border border-[var(--status-verified)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--status-verified)]">Completed</p>
          <p className="text-2xl font-bold text-[var(--status-verified)] mt-2">{stats.completed}</p>
        </div>
        <div className="bg-[var(--accent-blue-light)] border border-[var(--accent-blue)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-blue)]">In Progress</p>
          <p className="text-2xl font-bold text-[var(--accent-blue)] mt-2">{stats.inProgress}</p>
        </div>
        <div className="bg-[var(--critical-light)] border border-[var(--critical)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--critical)]">Overdue</p>
          <p className="text-2xl font-bold text-[var(--critical)] mt-2">{stats.overdue}</p>
        </div>
      </div>

      <div className="space-y-4">
        {complianceTasks.map((task) => (
          <div key={task.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 hover:border-[var(--accent-blue)] transition-all">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${task.status === "COMPLETED" ? "bg-[var(--status-verified-bg)]" : task.status === "OVERDUE" ? "bg-[var(--critical-light)]" : "bg-[var(--surface-raised)]"}`}>
                {task.status === "COMPLETED" && <CheckCircle2 className="w-5 h-5 text-[var(--status-verified)]" />}
                {task.status === "OVERDUE" && <AlertCircle className="w-5 h-5 text-[var(--critical)]" />}
                {(task.status === "PENDING" || task.status === "IN_PROGRESS") && <Clock className="w-5 h-5 text-[var(--accent-blue)]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[var(--accent-navy)]">{task.caseNumber}</span>
                  <Badge variant={task.priority.toLowerCase() as any}>{task.priority}</Badge>
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-3">{task.title}</h3>
                <ProgressBar progress={task.progress} color="bg-[var(--accent-blue)]" />
              </div>
              <button className="px-3 py-2 bg-[var(--accent-blue-light)] text-[var(--accent-navy)] rounded text-xs font-semibold hover:bg-[var(--accent-blue)] hover:text-white transition-all">
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
