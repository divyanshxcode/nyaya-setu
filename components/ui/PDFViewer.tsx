"use client";

import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

interface PDFViewerProps {
  onTextSelect?: (text: string, position: { x: number; y: number }) => void;
  highlightedText?: string[];
}

export function PDFViewer({ onTextSelect, highlightedText = [] }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedText, setSelectedText] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const totalPages = 5;

  const pdfContent = {
    1: "HIGH COURT OF KARNATAKA AT BENGALURU\n\nJUDGMENT\n\nWrit Petition (Criminal) No. 1234 of 2024\n\nBetween:\nThe State of Karnataka\nAnd\nConstruction Enterprises Ltd\n\nJudgment Date: 15-03-2025\n\nJudge: Justice Ramesh Kumar\n\nThis court has heard the arguments of both parties regarding the non-compliance with contractual obligations relating to the National Highway Construction Project. The petitioner (State) has filed this writ seeking specific performance and damages for delay in project completion.",

    2: "FACTS OF THE CASE:\n\n1. The State of Karnataka entered into a contract with Construction Enterprises Ltd for the construction of 150 km National Highway Project in February 2022.\n\n2. The original contract stipulated completion within 24 months from the date of commencement, which was set as 15-03-2022.\n\n3. The contracted completion date was therefore 15-03-2024.\n\n4. As of the date of filing this petition (15-02-2025), the project completion is only 45% and significant delays have been reported.",

    3: "ISSUES TO BE CONSIDERED:\n\n1. Whether the respondent contractor has committed breach of contract by failing to complete the project within the stipulated time?\n\n2. Whether the State is entitled to claim damages for delay in project execution?\n\n3. Whether specific performance can be ordered by this court for project completion?\n\n4. Whether penalty clauses mentioned in the contract agreement are applicable?",

    4: "FINDINGS OF THE COURT:\n\n1. After perusal of the contract document and correspondence between the parties, it is evident that the respondent contractor has failed to adhere to the project timeline.\n\n2. The reasons cited by the respondent for delay, including inadequate labor availability and raw material shortage, do not absolve them of contractual obligations.\n\n3. The State has suffered significant financial impact due to this delay affecting the overall development agenda.",

    5: "ORDER:\n\n1. The respondent (Construction Enterprises Ltd) is hereby directed to file a detailed compliance report within 15 days indicating revised timelines for project completion.\n\n2. Monthly progress reports must be submitted to the court for monitoring.\n\n3. In case of further delays beyond the revised timeline, penalty as per the contract agreement shall be imposed.\n\n4. The matter is adjourned to 15-04-2025 for further hearing.\n\nThis order is issued in open court.\n\nJustice Ramesh Kumar\nHigh Court of Karnataka"
  };

  const content = pdfContent[currentPage as keyof typeof pdfContent] || "";

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));
  const handlePrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1));
  const handleNextPage = () => setCurrentPage(Math.min(currentPage + 1, totalPages));

  const handleMouseUp = () => {
    const text = window.getSelection()?.toString();
    if (text && contentRef.current) {
      const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
      if (rect) {
        setSelectedText(text);
        onTextSelect?.(text, { x: rect.x, y: rect.y });
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--surface-raised)]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-secondary)]">
            Page {currentPage} of {totalPages}
          </span>
          <input 
            type="number" 
            min="1" 
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
            className="w-12 px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded text-sm text-[var(--text-primary)]"
          />
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={handleZoomOut}
            className="p-2 text-[var(--text-secondary)] hover:bg-[var(--surface)] rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-[var(--text-secondary)] w-12 text-center">{zoom}%</span>
          <button 
            onClick={handleZoomIn}
            className="p-2 text-[var(--text-secondary)] hover:bg-[var(--surface)] rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 text-[var(--text-secondary)] hover:bg-[var(--surface)] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 text-[var(--text-secondary)] hover:bg-[var(--surface)] disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={contentRef}
        onMouseUp={handleMouseUp}
        className="flex-1 overflow-auto p-8 bg-white text-[var(--text-primary)]"
        style={{ fontSize: `${zoom * 0.75}%` }}
      >
        <div className="max-w-4xl mx-auto font-serif leading-relaxed whitespace-pre-wrap text-sm">
          {content}
          {highlightedText.length > 0 && (
            <div className="mt-8 p-4 bg-[var(--status-warning-bg)] border border-[var(--status-warning)] rounded-lg">
              <p className="text-xs font-bold text-[var(--status-warning)] mb-2">HIGHLIGHTED TEXT:</p>
              <p className="text-sm text-[var(--text-primary)]">{highlightedText[0]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
