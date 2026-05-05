import { mockDepartments } from "@/lib/mockData";
import { Building2, ChevronRight } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import Link from "next/link";

export default function DepartmentsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 h-full animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-playfair text-[28px] font-semibold text-[var(--text-primary)]">Departments</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Department-wise performance and compliance overview.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)] font-medium">
            <option>All Divisions</option>
            <option>Division A</option>
            <option>Division B</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        {mockDepartments.map((dept) => (
          <Link 
            key={dept.id}
            href={`/cases?dept=${dept.id}`}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 card-hover transition-all flex flex-col group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue-light)] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[var(--accent-navy)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] text-base group-hover:text-[var(--accent-blue)] transition-colors line-clamp-2">
                  {dept.name}
                </h3>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] transition-colors shrink-0" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">Active Cases</span>
                  <span className="font-bold text-[var(--text-primary)] font-mono">{dept.activeCases}</span>
                </div>
                <ProgressBar progress={100} color="bg-[var(--accent-blue)]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">Pending Review</span>
                  <span className="font-bold text-[var(--text-primary)] font-mono">{dept.pendingReview}</span>
                </div>
                <ProgressBar progress={(dept.pendingReview / dept.activeCases) * 100} color="bg-[var(--warning)]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">Overdue</span>
                  <span className="font-bold text-[var(--critical)] font-mono">{dept.overdue}</span>
                </div>
                <ProgressBar progress={(dept.overdue / dept.activeCases) * 100} color="bg-[var(--critical)]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[var(--text-secondary)] font-medium">Complied</span>
                  <span className="font-bold text-[var(--status-verified)] font-mono">{dept.complied}</span>
                </div>
                <ProgressBar progress={(dept.complied / dept.activeCases) * 100} color="bg-[var(--status-verified)]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
