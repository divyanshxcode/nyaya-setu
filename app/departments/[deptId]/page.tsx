"use client";

import { use } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function DepartmentDetailPage({ params }: { params: Promise<{ deptId: string }> }) {
  const { deptId } = use(params);

  const departmentData = {
    id: deptId,
    name: "Public Works Department",
    head: "Dr. Ramesh Kumar",
    email: "contact@pwd.gov.in",
    phone: "+91 080 2345 6789",
    location: "Bengaluru",
    totalCases: 45,
    activeCases: 12,
    complied: 28,
    completedTasks: 10,
    totalComplianceTasks: 15,
  };

  const performanceMetrics = [
    { label: "Case Verification Rate", value: 92, unit: "%" },
    { label: "Compliance Rate", value: 88, unit: "%" },
    { label: "On-time Completion", value: 85, unit: "%" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <Link href="/departments" className="flex items-center gap-2 text-[var(--accent-blue)] hover:text-[var(--accent-navy)] transition-colors text-sm font-semibold w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Departments
      </Link>

      <div className="bg-gradient-to-r from-[var(--accent-navy)] to-[var(--accent-blue)] rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-white bg-opacity-20 flex items-center justify-center border-2 border-white">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{departmentData.name}</h1>
              <p className="text-white text-opacity-80 mt-2">Head: {departmentData.head}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{departmentData.totalCases}</p>
            <p className="text-white text-opacity-80 text-sm">Total Cases</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Active Cases</p>
          <p className="text-2xl font-bold text-[var(--accent-blue)] mt-2">{departmentData.activeCases}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Complied</p>
          <p className="text-2xl font-bold text-[var(--status-verified)] mt-2">{departmentData.complied}</p>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Completion Rate</p>
          <p className="text-2xl font-bold text-[var(--accent-navy)] mt-2">{Math.round((departmentData.completedTasks / departmentData.totalComplianceTasks) * 100)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((metric) => (
          <div key={metric.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-4">{metric.label}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-[var(--accent-navy)]">{metric.value}</span>
              <span className="text-[var(--text-secondary)] font-medium">{metric.unit}</span>
            </div>
            <ProgressBar progress={metric.value} color="bg-[var(--accent-blue)]" />
          </div>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
        <h2 className="font-bold text-[var(--text-primary)] mb-4 uppercase text-sm tracking-wider">Contact Information</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Email</p>
            <p className="text-[var(--text-primary)]">{departmentData.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Phone</p>
            <p className="text-[var(--text-primary)]">{departmentData.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">Location</p>
            <p className="text-[var(--text-primary)]">{departmentData.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
