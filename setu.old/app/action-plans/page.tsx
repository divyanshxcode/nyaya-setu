"use client";

import { useState } from "react";
import { mockCases } from "@/lib/mockData";
import { ActionPlanCard } from "@/components/action-plans/ActionPlanCard";
import { Search, Filter, LayoutGrid, LayoutList, Info } from "lucide-react";

export default function ActionPlansPage() {
  const verifiedCases = mockCases.filter(c => c.status === "VERIFIED" || c.status === "OVERDUE" || c.status === "COMPLIED" || c.status === "APPEALED");
  
  const complianceCount = verifiedCases.filter(c => c.actionPlan?.actionType === "COMPLIANCE").length;
  const appealsCount = verifiedCases.filter(c => c.actionPlan?.actionType === "APPEAL").length;
  const overdueCount = verifiedCases.filter(c => c.status === "OVERDUE").length;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 h-full animate-fade-in-up">
      <div className="bg-[var(--accent-blue-light)] border border-[var(--accent-blue)] rounded-lg p-4 flex gap-3 text-sm text-[var(--accent-navy)] shadow-sm">
        <Info className="w-5 h-5 shrink-0 mt-0.5 text-[var(--accent-blue)]" />
        <p className="font-medium">This view shows only human-verified action plans. All data and AI-generated steps have been reviewed and approved by the legal cell.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-playfair text-[28px] font-semibold text-[var(--text-primary)]">Action Plans</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Track and execute directives across departments.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center p-1">
            <button className="p-1.5 bg-[var(--surface-raised)] text-[var(--text-primary)] rounded shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
            <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"><LayoutList className="w-4 h-4" /></button>
          </div>
          <button className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)] rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors h-9">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Compliance Required</span>
          <span className="text-2xl font-bold font-dm text-[var(--text-primary)]">{complianceCount}</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Appeals Filed</span>
          <span className="text-2xl font-bold font-dm text-[var(--text-primary)]">{appealsCount}</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Complied</span>
          <span className="text-2xl font-bold font-dm text-[var(--status-verified)]">87</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Overdue</span>
          <span className="text-2xl font-bold font-dm text-[var(--critical)]">{overdueCount}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search by case number, department, or keyword..." 
            className="w-full bg-transparent border-none py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-0 text-[var(--text-primary)]"
          />
        </div>
        <div className="w-px h-6 bg-[var(--border)]"></div>
        <select className="bg-transparent border-none py-1.5 pl-2 pr-8 text-sm focus:outline-none focus:ring-0 text-[var(--text-secondary)] font-medium">
          <option>All Departments</option>
          <option>Public Works</option>
          <option>Revenue</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
        {verifiedCases.map(c => <ActionPlanCard key={c.id} caseData={c} />)}
      </div>
    </div>
  );
}
