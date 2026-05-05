"use client";

import { FileText, Upload, X, Link2 } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
}

export function DropZone({ onFileSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemove = () => setFile(null);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {!file ? (
        <>
          <div 
            className={cn(
              "border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-16 px-6 transition-all cursor-pointer bg-[var(--surface)]",
              isDragging 
                ? "border-[var(--accent-blue)] bg-[var(--accent-blue-light)] scale-[1.02]" 
                : "border-[var(--border-strong)] hover:border-[var(--accent-blue)] hover:bg-[var(--accent-blue-light)]"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={inputRef}
              onChange={handleChange}
              accept="application/pdf"
              className="hidden"
            />
            <FileText className="w-16 h-16 text-[var(--text-muted)] mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">Drop your PDF judgment here</h3>
            <p className="text-[var(--text-secondary)] mb-4">or click to browse files</p>
            <p className="text-xs text-[var(--text-muted)]">Supports PDF files up to 50MB</p>
          </div>

          <div className="flex items-center gap-4 w-full max-w-md mx-auto">
            <div className="h-px bg-[var(--border)] flex-1"></div>
            <span className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">OR</span>
            <div className="h-px bg-[var(--border)] flex-1"></div>
          </div>

          <button className="flex items-center justify-center gap-2 w-full max-w-md mx-auto bg-white border border-[var(--border-strong)] text-[var(--text-primary)] py-3 rounded-lg font-medium hover:bg-[var(--surface-raised)] transition-colors">
            <Link2 className="w-5 h-5 text-[var(--accent-blue)]" />
            Connect from CCMS Integration
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-6 animate-fade-in-up">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-blue-light)] flex items-center justify-center">
                <FileText className="w-6 h-6 text-[var(--accent-blue)]" />
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)] truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            </div>
            <button onClick={handleRemove} className="p-2 text-[var(--text-muted)] hover:text-[var(--critical)] hover:bg-[var(--status-rejected-bg)] rounded-md transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex flex-col gap-4">
            <h4 className="font-semibold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">Document Metadata</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Case Number (Optional)</label>
                <input type="text" placeholder="e.g. WP No. 4521/2024" className="w-full bg-[var(--surface-raised)] border border-transparent rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all text-[var(--text-primary)]" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Court Name</label>
                <select className="w-full bg-[var(--surface-raised)] border border-transparent rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all text-[var(--text-primary)]">
                  <option>High Court of Karnataka</option>
                  <option>Supreme Court of India</option>
                  <option>District Court</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onFileSelected(file)}
            className="w-full bg-[var(--accent-navy)] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#152a45] transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Upload className="w-5 h-5" />
            Begin AI Extraction
          </button>
        </div>
      )}
    </div>
  );
}
