import { Briefcase, Clock, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CaseStatusChart } from "@/components/dashboard/CaseStatusChart";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DepartmentSummary } from "@/components/dashboard/DepartmentSummary";

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[var(--text-primary)]">Dashboard Overview</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Court Case Monitoring System — Real-time judgment tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-blue)]">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-raised)] rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Cases" 
          value={248} 
          icon={Briefcase} 
          trend={12} 
          className="delay-[50ms]" 
        />
        <StatsCard 
          title="Pending Review" 
          value={34} 
          icon={Clock} 
          colorType="warning" 
          className="delay-[100ms]" 
        />
        <StatsCard 
          title="Verified Today" 
          value={18} 
          icon={CheckCircle2} 
          trend={5} 
          colorType="verified" 
          className="delay-[150ms]" 
        />
        <StatsCard 
          title="Upcoming Deadlines" 
          value={7} 
          icon={AlertTriangle} 
          trend={-2} 
          colorType="critical" 
          className="delay-[200ms]" 
        />
      </div>

      {/* Main Content Row 1 (2/3 + 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CaseStatusChart />
        </div>
        <div className="lg:col-span-1">
          <UpcomingDeadlines />
        </div>
      </div>

      {/* Main Content Row 2 (1/2 + 1/2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <RecentActivity />
        <DepartmentSummary />
      </div>

    </div>
  );
}
