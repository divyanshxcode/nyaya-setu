"use client";

import { FileText, CheckCircle2, ChevronDown, ChevronRight, Edit2, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { mockCases } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface ConfidenceBadgeProps {
  score: number;
}

function ConfidenceBadge({ score }: ConfidenceBadgeProps) {
  if (score >= 90) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200"><TrendingUp className="w-3 h-3" /> {score}%</span>;
  }
  if (score >= 70) {
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200"><TrendingUp className="w-3 h-3" /> {score}%</span>;
  }
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200"><AlertTriangle className="w-3 h-3" /> {score}%</span>;
}

export function ExtractionPreview() {
  const [expandedSection, setExpandedSection] = useState<string | null>("CASE_DETAILS");
  const caseData = mockCases[0]; // Use the first mock case for preview

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)] animate-fade-in-up">
      {/* LEFT: PDF Viewer Simulation */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col overflow-hidden shadow-sm">
        <div className="bg-[var(--surface-raised)] border-b border-[var(--border)] p-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">judgment_4521_2024.pdf</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <span>Page 3 of 47</span>
            <div className="flex gap-2">
              <button className="hover:text-[var(--text-primary)]">-</button>
              <span>100%</span>
              <button className="hover:text-[var(--text-primary)]">+</button>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-200 p-8 overflow-y-auto flex justify-center custom-scrollbar">
          {/* Simulated PDF Page */}
          <div className="bg-white shadow-md w-full max-w-[600px] h-max p-12 flex flex-col gap-6 text-sm leading-relaxed text-gray-800 font-serif">
            <h1 className="text-center font-bold text-lg mb-4">IN THE HIGH COURT OF KARNATAKA AT BENGALURU</h1>
            
            <p>DATED THIS THE 15TH DAY OF MARCH 2025</p>
            
            <p>BEFORE</p>
            <p className="bg-yellow-200 cursor-pointer relative group">
              <span className="absolute -left-6 top-0 text-[10px] bg-yellow-400 text-yellow-900 px-1 rounded font-sans font-bold">1</span>
              THE HON'BLE MR. JUSTICE A.K. SHARMA
            </p>
            
            <div className="flex justify-between my-4">
              <div>
                <p>BETWEEN:</p>
                <p className="bg-yellow-200 cursor-pointer relative mt-1 group">
                  <span className="absolute -left-6 top-0 text-[10px] bg-yellow-400 text-yellow-900 px-1 rounded font-sans font-bold">2</span>
                  State of Karnataka,<br/>Rep by its Secretary,<br/>Public Works Department.
                </p>
              </div>
              <div className="text-right">
                <p>... PETITIONER</p>
              </div>
            </div>

            <div className="flex justify-between my-4">
              <div>
                <p>AND:</p>
                <p className="bg-yellow-200 cursor-pointer relative mt-1 group">
                  <span className="absolute -left-6 top-0 text-[10px] bg-yellow-400 text-yellow-900 px-1 rounded font-sans font-bold">3</span>
                  M/s Apex Constructions Ltd,<br/>No 45, Industrial Area.
                </p>
              </div>
              <div className="text-right">
                <p>... RESPONDENT</p>
              </div>
            </div>

            <p className="text-center font-bold mt-8">ORDER</p>

            <p>1. The present writ petition is filed challenging the impugned order...</p>
            
            <p className="bg-yellow-200 cursor-pointer relative group p-1">
              <span className="absolute -left-6 top-1 text-[10px] bg-yellow-400 text-yellow-900 px-1 rounded font-sans font-bold">4</span>
              2. <span className="font-bold">The respondent shall submit the revised compliance report reflecting the recent ecological survey.</span> Furthermore, <span className="font-bold">the concerned department must disburse the withheld payments within 4 weeks.</span>
            </p>

            <p className="bg-yellow-200 cursor-pointer relative group p-1 mt-4">
              <span className="absolute -left-6 top-1 text-[10px] bg-yellow-400 text-yellow-900 px-1 rounded font-sans font-bold">5</span>
              3. The petitioner is directed to ensure <span className="font-bold">compliance by 12 April 2025</span>. Any appeal against this order must be filed within the statutory limitation period of 90 days, expiring on <span className="font-bold">13 June 2025</span>.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Extracted Data */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col shadow-sm">
        <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface-raised)] rounded-t-xl">
          <h2 className="font-semibold text-[var(--text-primary)]">Extracted Data</h2>
          <Badge variant="success">Extraction Complete</Badge>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          
          {/* SECTION: CASE DETAILS */}
          <div className="mb-4 border border-[var(--border)] rounded-lg overflow-hidden">
            <button 
              className="w-full p-3 bg-[var(--surface-raised)] flex justify-between items-center hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection("CASE_DETAILS")}
            >
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Case Details</span>
              {expandedSection === "CASE_DETAILS" ? <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />}
            </button>
            
            {expandedSection === "CASE_DETAILS" && (
              <div className="p-3 bg-white divide-y divide-[var(--border)]">
                {caseData.extractedFields?.caseInformation.map((field, idx) => (
                  <div key={idx} className="py-3 group first:pt-0 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{field.label}</span>
                      <div className="flex items-center gap-2">
                        <ConfidenceBadge score={field.confidence} />
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)]">
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION: KEY DIRECTIONS */}
          <div className="mb-4 border border-[var(--border)] rounded-lg overflow-hidden">
            <button 
              className="w-full p-3 bg-[var(--surface-raised)] flex justify-between items-center hover:bg-gray-100 transition-colors"
              onClick={() => toggleSection("KEY_DIRECTIONS")}
            >
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Key Directions / Orders</span>
              {expandedSection === "KEY_DIRECTIONS" ? <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />}
            </button>
            
            {expandedSection === "KEY_DIRECTIONS" && (
              <div className="p-3 bg-white divide-y divide-[var(--border)]">
                {caseData.extractedFields?.keyDirections.map((field, idx) => (
                  <div key={idx} className="py-3 group first:pt-0 last:pb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{field.label}</span>
                      <div className="flex items-center gap-2">
                        <ConfidenceBadge score={field.confidence} />
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-primary)]">{field.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION: AI ACTION PLAN */}
          <div className="border border-[var(--accent-navy)] rounded-lg overflow-hidden">
            <button 
              className="w-full p-3 bg-[var(--accent-blue-light)] flex justify-between items-center hover:bg-[#e0efff] transition-colors"
              onClick={() => toggleSection("ACTION_PLAN")}
            >
              <span className="text-xs font-bold text-[var(--accent-navy)] uppercase tracking-wider">AI Action Plan (Draft)</span>
              {expandedSection === "ACTION_PLAN" ? <ChevronDown className="w-4 h-4 text-[var(--accent-navy)]" /> : <ChevronRight className="w-4 h-4 text-[var(--accent-navy)]" />}
            </button>
            
            {expandedSection === "ACTION_PLAN" && (
              <div className="p-4 bg-white">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Required Action</span>
                    <Badge variant="medium">{caseData.actionPlan?.actionType}</Badge>
                  </div>
                  <div>
                    <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Priority</span>
                    <Badge variant="high">{caseData.actionPlan?.priority}</Badge>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="block text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Suggested Steps</span>
                  <ul className="space-y-2">
                    {caseData.actionPlan?.steps.map((step, idx) => (
                      <li key={step.id} className="text-sm text-[var(--text-primary)] flex gap-2">
                        <span className="font-mono text-[var(--text-muted)]">{idx + 1}.</span>
                        {step.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

        </div>
        
        <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-raised)]">
          <Link href="/review">
            <button className="w-full bg-[var(--accent-navy)] text-white py-3 rounded-lg font-semibold hover:bg-[#152a45] transition-colors shadow-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Submit to Verification Queue
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
