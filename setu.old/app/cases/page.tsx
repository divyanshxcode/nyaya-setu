"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Download, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { mockCases } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";
import { StatusDot } from "@/components/ui/StatusDot";
import { formatDate } from "@/lib/utils";

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCases = mockCases.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 h-full animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-playfair text-[28px] font-semibold text-[var(--text-primary)]">All Cases</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Comprehensive directory of all court cases and their current status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)] rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col shadow-sm overflow-hidden flex-1">
        {/* Toolbar */}
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--surface-raised)]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Search cases by title or number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[var(--border)] rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[var(--accent-blue)] focus:ring-1 focus:ring-[var(--accent-blue)] transition-all text-[var(--text-primary)] shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select className="bg-white border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] shadow-sm flex-1 sm:flex-none">
              <option>All Statuses</option>
              <option>Pending Review</option>
              <option>Verified</option>
              <option>Overdue</option>
            </select>
            <button className="bg-white border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)] rounded-lg p-2 transition-colors shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-[var(--surface)] sticky top-0 z-10 shadow-[0_1px_0_0_var(--border)]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] w-2/5">Case Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] w-1/5">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] w-1/5">Department</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] w-1/5">Priority</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] bg-[var(--surface)]">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-[var(--surface-raised)] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-[var(--accent-navy)] bg-[var(--surface-raised)] px-2 py-0.5 rounded border border-[var(--border)]">
                          {c.caseNumber}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--accent-blue)] transition-colors" title={c.title}>
                        {c.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Order Date: {formatDate(c.dateOfOrder)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-center gap-2">
                        <StatusDot status={c.status} />
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {c.status.replace("_", " ")}
                        </span>
                      </div>
                      {c.status === "PENDING_REVIEW" && (
                        <span className="text-[10px] uppercase font-bold text-[var(--status-pending)] tracking-wider">Requires Verification</span>
                      )}
                      {c.status === "OVERDUE" && (
                        <span className="text-[10px] uppercase font-bold text-[var(--critical)] tracking-wider">Action Needed</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--text-secondary)] font-medium">
                      {c.departmentId.replace("dept-", "").toUpperCase()} Dept
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={c.priority.toLowerCase() as any}>{c.priority}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={c.status === "PENDING_REVIEW" ? `/review/${c.id}` : `/cases/${c.id}`}
                      className="p-2 inline-flex rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)] transition-all"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCases.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-[var(--surface-raised)] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-[var(--text-muted)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">No cases found</h3>
              <p className="text-[var(--text-secondary)] mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
