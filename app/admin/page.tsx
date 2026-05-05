"use client";

import { BarChart3, Users, FileText, AlertCircle, TrendingUp, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";

export default function AdminDashboard() {
  const systemStats = [
    { label: "Total Users", value: 284, icon: Users, trend: 12 },
    { label: "Cases Processed", value: 1248, icon: FileText, trend: 8 },
    { label: "System Uptime", value: "99.8%", icon: TrendingUp, trend: 0 },
    { label: "Active Sessions", value: 42, icon: Clock, trend: 5 }
  ];

  const recentUsers = [
    { id: 1, name: "Rajesh Kumar", email: "rajesh@gov.in", role: "Reviewer", joinDate: "2025-03-10", status: "Active" },
    { id: 2, name: "Priya Sharma", email: "priya@gov.in", role: "Officer", joinDate: "2025-02-15", status: "Active" },
    { id: 3, name: "Vikram Singh", email: "vikram@gov.in", role: "Admin", joinDate: "2024-12-20", status: "Active" },
  ];

  const systemHealth = [
    { metric: "Database Response Time", value: "45ms", status: "healthy" },
    { metric: "API Uptime", value: "99.9%", status: "healthy" },
    { metric: "Storage Used", value: "2.3 TB / 5 TB", status: "healthy" },
    { metric: "CPU Average", value: "34%", status: "healthy" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h1 className="font-playfair text-[28px] font-semibold text-[var(--text-primary)]">Admin Dashboard</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">System overview and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
          <StatsCard key={stat.label} title={stat.label} value={stat.value} icon={stat.icon} trend={stat.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--accent-blue)]" />
            System Health
          </h2>
          <div className="space-y-3">
            {systemHealth.map((item) => (
              <div key={item.metric} className="flex items-center justify-between p-3 bg-[var(--surface-raised)] rounded-lg">
                <span className="text-sm text-[var(--text-secondary)]">{item.metric}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</span>
                  <div className="w-2 h-2 rounded-full bg-[var(--status-verified)]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-bold text-[var(--text-primary)]">Recent Users</h2>
          <button className="px-3 py-1.5 bg-[var(--accent-navy)] text-white rounded text-xs font-semibold">View All</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-raised)] border-b border-[var(--border)]">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">Role</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-secondary)]">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user) => (
              <tr key={user.id} className="border-b border-[var(--border)] hover:bg-[var(--surface-raised)]">
                <td className="px-6 py-3 text-[var(--text-primary)] font-medium">{user.name}</td>
                <td className="px-6 py-3 text-[var(--text-secondary)]">{user.email}</td>
                <td className="px-6 py-3"><span className="px-2 py-1 bg-[var(--accent-blue-light)] text-[var(--accent-navy)] rounded text-xs font-semibold">{user.role}</span></td>
                <td className="px-6 py-3"><span className="text-xs font-semibold text-[var(--status-verified)]">{user.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
