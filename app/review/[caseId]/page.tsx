"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageSquare, XCircle, Info, FileText, AlertTriangle } from "lucide-react";
import { mockCases } from "@/lib/mockData";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { ExtractedField } from "@/components/review/ExtractedField";
import { ExtractedField as ExtractedFieldType } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function ReviewInterfacePage({ params }: { params: Promise<{ caseId: string }> }) {
  // Use React.use to unwrap params in Next.js 15
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
        {/* LEFT: PDF Viewer Simulation (60%) */}
        <div className="w-[55%] flex flex-col border-r border-[var(--border)] bg-gray-100 relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[var(--surface)] shadow-md rounded-full px-4 py-2 flex items-center gap-4 z-10 border border-[var(--border)]">
            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-lg">-</button>
            <span className="text-sm font-medium">100%</span>
            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-lg">+</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 flex justify-center custom-scrollbar">
            {/* Simulated PDF Page */}
            <div className="bg-white shadow-xl w-full max-w-[700px] h-max p-16 flex flex-col gap-6 text-sm leading-relaxed text-gray-800 font-serif relative">
              <h1 className="text-center font-bold text-xl mb-6 border-b border-gray-300 pb-4">IN THE HIGH COURT OF KARNATAKA AT BENGALURU</h1>
              
              <p>DATED THIS THE 15TH DAY OF MARCH 2025</p>
              
              <p>BEFORE</p>
              <p className={`cursor-pointer relative group transition-colors p-1 -m-1 rounded ${highlightedSource === 'page1-para5' ? 'bg-yellow-300 shadow-[0_0_0_4px_#fde047]' : 'bg-yellow-100 hover:bg-yellow-200'}`}>
                THE HON'BLE MR. JUSTICE A.K. SHARMA
              </p>
              
              <div className="flex justify-between my-4">
                <div>
                  <p>BETWEEN:</p>
                  <p className={`cursor-pointer relative mt-1 group transition-colors p-1 -m-1 rounded ${highlightedSource === 'page1-para3' ? 'bg-yellow-300 shadow-[0_0_0_4px_#fde047]' : 'bg-yellow-100 hover:bg-yellow-200'}`}>
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
                  <p className={`cursor-pointer relative mt-1 group transition-colors p-1 -m-1 rounded ${highlightedSource === 'page1-para4' ? 'bg-yellow-300 shadow-[0_0_0_4px_#fde047]' : 'bg-yellow-100 hover:bg-yellow-200'}`}>
                    M/s Apex Constructions Ltd,<br/>No 45, Industrial Area.
                  </p>
                </div>
                <div className="text-right">
                  <p>... RESPONDENT</p>
                </div>
              </div>

              <p className="text-center font-bold mt-8 mb-4 underline">ORDER</p>

              <p>1. The present writ petition is filed challenging the impugned order dated 12.01.2024 passed by the competent authority...</p>
              
              <p className={`cursor-pointer relative group p-2 -m-2 rounded mt-2 transition-colors ${highlightedSource === 'page3-para1' || highlightedSource === 'page3-para2' ? 'bg-yellow-300 shadow-[0_0_0_4px_#fde047]' : 'bg-yellow-100 hover:bg-yellow-200'}`}>
                2. Having heard the learned counsels for both parties, <span className="font-bold">the respondent shall submit the revised compliance report reflecting the recent ecological survey.</span> Furthermore, <span className="font-bold">the concerned department must disburse the withheld payments within 4 weeks.</span>
              </p>

              <p className={`cursor-pointer relative group p-2 -m-2 rounded mt-6 transition-colors ${highlightedSource === 'page4-para1' || highlightedSource === 'page4-para2' ? 'bg-yellow-300 shadow-[0_0_0_4px_#fde047]' : 'bg-yellow-100 hover:bg-yellow-200'}`}>
                3. The petitioner is directed to ensure <span className="font-bold">compliance by 12 April 2025</span>. Any appeal against this order must be filed within the statutory limitation period of 90 days, expiring on <span className="font-bold">13 June 2025</span>.
              </p>

              <div className="mt-16 text-right font-bold italic">
                <p>Sd/-</p>
                <p>JUDGE</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Data Editor (45%) */}
        <div className="w-[45%] flex flex-col bg-[var(--surface)] relative h-full">
          <Tabs 
            tabs={["Extraction", "Action Plan", "Audit Trail"]} 
            activeTab={activeTab} 
            onChange={setActiveTab}
            className="shrink-0 bg-[var(--surface-raised)]"
          />
          
          <div className="flex-1 overflow-y-auto pb-24 custom-scrollbar">
            {activeTab === "Extraction" && (
              <div className="flex flex-col">
                <div className="bg-[var(--surface-raised)] px-4 py-2 border-b border-[var(--border)] sticky top-0 z-10 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                    <FileText className="w-3 h-3" /> Case Information
                  </h3>
                </div>
                <div>
                  {caseData.extractedFields.caseInformation.map((field, idx) => (
                    <ExtractedField 
                      key={`case-${idx}`} 
                      field={field} 
                      onUpdate={(f) => handleUpdateField("caseInformation", idx, f)} 
                      onHighlightSource={setHighlightedSource}
                    />
                  ))}
                </div>

                <div className="bg-[var(--surface-raised)] px-4 py-2 border-y border-[var(--border)] sticky top-0 z-10 shadow-sm mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> Key Directions
                  </h3>
                </div>
                <div>
                  {caseData.extractedFields.keyDirections.map((field, idx) => (
                    <ExtractedField 
                      key={`dir-${idx}`} 
                      field={field} 
                      onUpdate={(f) => handleUpdateField("keyDirections", idx, f)} 
                      onHighlightSource={setHighlightedSource}
                    />
                  ))}
                  <button className="w-full py-3 text-sm text-[var(--accent-blue)] font-medium hover:bg-[var(--surface-raised)] transition-colors border-b border-[var(--border)]">+ Add Direction Manually</button>
                </div>

                <div className="bg-[var(--surface-raised)] px-4 py-2 border-y border-[var(--border)] sticky top-0 z-10 shadow-sm mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Timelines
                  </h3>
                </div>
                <div>
                  {caseData.extractedFields.timelines.map((field, idx) => (
                    <ExtractedField 
                      key={`time-${idx}`} 
                      field={field} 
                      onUpdate={(f) => handleUpdateField("timelines", idx, f)} 
                      onHighlightSource={setHighlightedSource}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Action Plan" && caseData.actionPlan && (
              <div className="p-6 flex flex-col gap-6">
                <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex gap-3 text-sm leading-relaxed">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>AI has generated a preliminary action plan based on the extracted directives. Review and assign responsible departments before saving.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Action Type</label>
                    <select 
                      className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                      defaultValue={caseData.actionPlan.actionType}
                    >
                      <option value="COMPLIANCE">Compliance</option>
                      <option value="APPEAL">Appeal</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Priority</label>
                    <select 
                      className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                      defaultValue={caseData.actionPlan.priority}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Responsible Department</label>
                  <select 
                    className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-lg p-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                    defaultValue={caseData.actionPlan.departmentId}
                  >
                    <option value="dept-pwd">Public Works Department</option>
                    <option value="dept-rev">Revenue Department</option>
                    <option value="dept-edu">Education Department</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Required Actions</label>
                  <div className="flex flex-col gap-2">
                    {caseData.actionPlan.steps.map((step, idx) => (
                      <div key={step.id} className="flex items-start gap-2 group">
                        <div className="w-6 h-6 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-1">
                          <span className="text-xs font-mono font-medium text-[var(--text-muted)]">{idx + 1}</span>
                        </div>
                        <input 
                          type="text" 
                          defaultValue={step.description}
                          className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-blue)] hover:border-[var(--border-strong)] transition-colors"
                        />
                        <button className="opacity-0 group-hover:opacity-100 p-2 text-[var(--text-muted)] hover:text-[var(--critical)] transition-all">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button className="text-sm text-[var(--accent-blue)] font-medium flex items-center gap-1 mt-2 w-max hover:underline">
                      + Add Step
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Reviewer Notes</label>
                  <textarea 
                    className="w-full min-h-[100px] bg-[var(--surface)] border border-[var(--border-strong)] rounded-lg p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
                    placeholder="Add internal notes for the department..."
                    defaultValue={caseData.actionPlan.reviewerNotes}
                  />
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM PROGRESS BAR */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border)] bg-[var(--surface)] z-20 flex flex-col gap-2 shadow-[0_-4px_6px_-1px_rgb(0_0_0_/_0.05)]">
            <div className="flex justify-between items-center text-xs font-bold text-[var(--text-secondary)]">
              <span>Verification Progress</span>
              <span className={progress === 100 ? "text-[var(--status-verified)]" : ""}>{verifiedCount} of {totalCount} fields verified</span>
            </div>
            <ProgressBar progress={progress} color={progress === 100 ? "bg-[var(--status-verified)]" : "bg-[var(--accent-blue)]"} height="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
