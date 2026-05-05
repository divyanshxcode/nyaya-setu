"use client";

import { useState } from "react";
import { mockCases } from "@/lib/mockData";
import { ReviewCard } from "@/components/review/ReviewCard";
import { Search, Filter, SortDesc, CheckCircle2 } from "lucide-react";

export default function ReviewQueuePage() {
  const [filter, setFilter] = useState("All");
  
  const pendingCases = mockCases.filter(c => c.status === "PENDING_REVIEW" || c.status === "PROCESSING");
  const verifiedCount = mockCases.filter(c => c.status === "VERIFIED").length;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 h-full animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-playfair text-[28px] font-semibold text-[var(--text-primary)]">Verification Queue</h1>
            <span className="bg-[var(--critical)] text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
              {pendingCases.length} Pending
            </span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Human-in-the-loop verification for AI-extracted case data.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)] rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)] rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
            <SortDesc className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[var(--border)]">
        {["All", "High Priority", "Overdue", "Assigned to Me", "New Today"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              filter === f 
                ? "bg-[var(--accent-navy)] text-white" 
                : "bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:bg-[var(--border)]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-8">
        {pendingCases.length > 0 ? (
          pendingCases.map(c => <ReviewCard key={c.id} caseData={c} />)
        ) : (
          <div className="text-center py-20 bg-[var(--surface)] border border-[var(--border)] rounded-xl mt-4">
            <div className="w-16 h-16 bg-[var(--surface-raised)] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[var(--status-verified)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">All Caught Up!</h3>
            <p className="text-[var(--text-secondary)]">There are no pending cases requiring verification.</p>
          </div>
        )}
      </div>
    </div>
  );
}
