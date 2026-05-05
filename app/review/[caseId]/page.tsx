"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageSquare, XCircle } from "lucide-react";
import { mockCases } from "@/lib/mockData";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { ExtractedField } from "@/components/review/ExtractedField";
import { ExtractedField as ExtractedFieldType } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PDFViewer } from "@/components/ui/PDFViewer";

export default function ReviewInterfacePage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = use(params);
  const initialCase = mockCases.find(c => c.id === caseId) || mockCases[0];
  const [caseData, setCaseData] = useState(initialCase);
  const [activeTab, setActiveTab] = useState("Extraction");
  const [highlightedSource, setHighlightedSource] = useState<string | null>(null);

  if (!caseData.extractedFields) {
    return <div className="p-8">No extracted data available for this case.</div>;
  }

  const handleUpdateField = (category: keyof typeof caseData.extractedFields, index: number, newField: ExtractedFieldType) => {
    const newFields = [...caseData.extractedFields![category]];
    newFields[index] = newField;
    setCaseData({
      ...caseData,
      extractedFields: {
        ...caseData.extractedFields!,
        [category]: newFields
      }
    });
  };

  const allFields = [
    ...caseData.extractedFields.caseInformation,
    ...caseData.extractedFields.keyDirections,
    ...caseData.extractedFields.timelines
  ];
  const verifiedCount = allFields.filter(f => f.verified).length;
  const totalCount = allFields.length;
  const progress = (verifiedCount / totalCount) * 100;

  return (
    <div className="flex flex-col h-full bg-[var(--background)] animate-fade-in-up">
      {/* TOP BAR */}
      <div className="h-16 shrink-0 bg-[var(--surface)] border-b border-[var(--border)] px-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/review" className="p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded-full hover:bg-[var(--surface-raised)]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-[var(--border)]"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-[var(--accent-navy)]">{caseData.caseNumber}</span>
              <Badge variant={caseData.priority.toLowerCase() as any}>{caseData.priority}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-semibold text-[var(--critical)] bg-white border border-[var(--critical)] rounded-lg hover:bg-[var(--status-rejected-bg)] transition-colors flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          <button className="px-4 py-2 text-sm font-semibold text-[var(--status-review)] bg-white border border-[var(--status-review)] rounded-lg hover:bg-[var(--status-review-bg)] transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Clarify
          </button>
          <button 
            className={`px-6 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-2 transition-all ${
              progress === 100 
                ? "bg-[var(--status-verified)] hover:bg-green-600 shadow-md" 
                : "bg-[var(--status-verified)] opacity-50 cursor-not-allowed"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve & Verify
          </button>
        </div>
      </div>

      {/* SPLIT VIEW */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: PDF Viewer (55%) */}
        <div className="w-[55%] flex flex-col border-r border-[var(--border)]">
          <PDFViewer 
            onTextSelect={(text, position) => {
              setHighlightedSource(text);
            }}
            highlightedText={highlightedSource ? [highlightedSource] : []}
          />
        </div>

        {/* RIGHT: Review Panel (45%) */}
        <div className="w-[45%] flex flex-col bg-[var(--surface)] overflow-hidden">
          <div className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
            {/* Tabs */}
            <div className="shrink-0 border-b border-[var(--border)] px-6 pt-6">
              <Tabs
                tabs={["Extraction", "Action Plan", "AI Reasoning"]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === "Extraction" && (
                <div className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Overall Progress</span>
                      <span className="text-sm font-bold text-[var(--accent-blue)]">{Math.round(progress)}%</span>
                    </div>
                    <ProgressBar progress={progress} />
                  </div>

                  {/* Extraction Fields */}
                  {caseData.extractedFields && (
                    <>
                      {/* Case Information */}
                      {caseData.extractedFields.caseInformation.length > 0 && (
                        <div>
                          <h3 className="font-bold text-[var(--text-primary)] mb-3 uppercase text-xs tracking-wider">Case Information</h3>
                          <div className="space-y-3">
                            {caseData.extractedFields.caseInformation.map((field, idx) => (
                              <ExtractedField
                                key={idx}
                                field={field}
                                onUpdate={(updated) => handleUpdateField("caseInformation", idx, updated)}
                                onHighlightSource={() => setHighlightedSource(field.sourceRef)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Key Directions */}
                      {caseData.extractedFields.keyDirections.length > 0 && (
                        <div className="pt-6 border-t border-[var(--border)]">
                          <h3 className="font-bold text-[var(--text-primary)] mb-3 uppercase text-xs tracking-wider">Key Directions</h3>
                          <div className="space-y-3">
                            {caseData.extractedFields.keyDirections.map((field, idx) => (
                              <ExtractedField
                                key={idx}
                                field={field}
                                onUpdate={(updated) => handleUpdateField("keyDirections", idx, updated)}
                                onHighlightSource={() => setHighlightedSource(field.sourceRef)}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timelines */}
                      {caseData.extractedFields.timelines.length > 0 && (
                        <div className="pt-6 border-t border-[var(--border)]">
                          <h3 className="font-bold text-[var(--text-primary)] mb-3 uppercase text-xs tracking-wider">Timelines & Deadlines</h3>
                          <div className="space-y-3">
                            {caseData.extractedFields.timelines.map((field, idx) => (
                              <ExtractedField
                                key={idx}
                                field={field}
                                onUpdate={(updated) => handleUpdateField("timelines", idx, updated)}
                                onHighlightSource={() => setHighlightedSource(field.sourceRef)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === "Action Plan" && caseData.actionPlan && (
                <div className="space-y-4">
                  <div className="bg-[var(--accent-blue-light)] rounded-lg p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-navy)] mb-2">Action Type</p>
                    <p className="font-semibold text-[var(--accent-navy)]">{caseData.actionPlan.actionType}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Priority</p>
                    <Badge variant={caseData.actionPlan.priority.toLowerCase() as any}>
                      {caseData.actionPlan.priority}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Deadline</p>
                    <p className="text-[var(--text-primary)] font-semibold">{caseData.actionPlan.deadline}</p>
                  </div>

                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Action Steps</p>
                    <ol className="space-y-2 list-decimal list-inside">
                      {caseData.actionPlan.steps.map((step) => (
                        <li key={step.id} className="text-sm text-[var(--text-primary)]">
                          {step.description}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {activeTab === "AI Reasoning" && caseData.actionPlan && (
                <div className="space-y-4">
                  <div className="bg-[var(--accent-blue-light)] rounded-lg p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-navy)] mb-2">AI Reasoning</p>
                    <p className="text-sm text-[var(--accent-navy)] leading-relaxed">{caseData.actionPlan.aiReasoning}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Appeal Recommendation</p>
                    <div className={`px-3 py-2 rounded text-sm font-bold text-center ${
                      caseData.actionPlan.appealRecommendation === "RECOMMENDED"
                        ? "bg-[var(--status-verified-bg)] text-[var(--status-verified)]"
                        : "bg-[var(--critical-light)] text-[var(--critical)]"
                    }`}>
                      {caseData.actionPlan.appealRecommendation.replace("_", " ")}
                    </div>
                  </div>

                  {caseData.actionPlan.reviewerNotes && (
                    <div className="border-t border-[var(--border)] pt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Reviewer Notes</p>
                      <p className="text-sm text-[var(--text-primary)]">{caseData.actionPlan.reviewerNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
