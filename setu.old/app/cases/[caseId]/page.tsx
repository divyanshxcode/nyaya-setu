"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PDFViewer } from "@/components/ui/PDFViewer";
import { formatDate } from "@/lib/utils";

export default function CaseDetailPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = use(params);

  const caseData = {
    id: caseId,
    caseNumber: "WP (Crl) 1234/2024",
    title: "State of Karnataka vs. Construction Enterprises Ltd",
    court: "High Court of Karnataka at Bengaluru",
    judges: ["Justice Ramesh Kumar"],
    dateOfOrder: "2025-03-15",
    petitioner: "State of Karnataka",
    respondent: "Construction Enterprises Ltd",
    summary: "Petition for non-compliance with contractual obligations relating to the National Highway project.",
    status: "VERIFIED",
    priority: "HIGH",
    department: "Public Works Department",
    caseLink: "https://karnatakajudiciary.org/case/WP-Crl-1234-2024",
    extractionScore: 94
  };

  const actionPlan = {
    actionType: "COMPLIANCE",
    priority: "HIGH",
    deadline: "2025-03-20",
    steps: [
      "File compliance report detailing current construction status",
      "Submit revised timeline for project completion",
      "Provide detailed breakdown of delays and mitigation measures"
    ],
    appealRecommendation: "NOT_RECOMMENDED",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in-up">
      <Link href="/cases" className="flex items-center gap-2 text-[var(--accent-blue)] hover:text-[var(--accent-navy)] transition-colors text-sm font-semibold w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to Cases
      </Link>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-sm font-bold text-[var(--accent-navy)] bg-[var(--accent-blue-light)] px-3 py-1 rounded">
                {caseData.caseNumber}
              </span>
              <Badge variant={caseData.priority.toLowerCase() as any}>{caseData.priority}</Badge>
              <Badge variant={caseData.status.toLowerCase() as any}>{caseData.status}</Badge>
            </div>
            <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-2">
              {caseData.title}
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">{caseData.court}</p>
          </div>
          <button className="px-4 py-2 bg-[var(--accent-blue)] text-white rounded-lg font-medium text-sm hover:bg-opacity-90">
            <FileText className="w-4 h-4 inline mr-2" /> View PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm border-t border-[var(--border)] pt-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Order Date</p>
            <p className="text-[var(--text-primary)] font-semibold">{formatDate(caseData.dateOfOrder)}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Judge</p>
            <p className="text-[var(--text-primary)] font-semibold">{caseData.judges[0]}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">AI Score</p>
            <div className="flex items-center gap-2">
              <span className="text-[var(--accent-blue)] font-bold">{caseData.extractionScore}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="font-bold text-[var(--text-primary)] mb-3 uppercase text-sm tracking-wider">Case Summary</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">{caseData.summary}</p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="font-bold text-[var(--text-primary)] mb-4 uppercase text-sm tracking-wider">Parties Involved</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Petitioner</p>
                <p className="text-[var(--text-primary)] font-semibold">{caseData.petitioner}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">Respondent</p>
                <p className="text-[var(--text-primary)] font-semibold">{caseData.respondent}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-[var(--accent-blue-light)] to-[var(--accent-blue-light)] border border-[var(--accent-blue)] rounded-lg p-6">
            <h2 className="font-bold text-[var(--accent-navy)] mb-4 uppercase text-sm tracking-wider">Action Plan</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-navy)] opacity-80 mb-1">Action Type</p>
                <p className="font-semibold text-[var(--accent-navy)]">{actionPlan.actionType}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-navy)] opacity-80 mb-1">Deadline</p>
                <p className="font-semibold text-[var(--accent-navy)]">{formatDate(actionPlan.deadline)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <a href={caseData.caseLink} target="_blank" rel="noopener noreferrer" className="w-full px-4 py-3 bg-[var(--accent-blue)] text-white rounded-lg font-medium text-sm hover:bg-opacity-90 flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> View on CIS Portal
            </a>
            <button className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] rounded-lg font-medium text-sm hover:bg-[var(--surface-raised)]  flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
