"use client";

import { useState } from "react";
import { Edit2, Check, X, TrendingUp, AlertTriangle } from "lucide-react";
import { ExtractedField as ExtractedFieldType } from "@/lib/types";

interface ExtractedFieldProps {
  field: ExtractedFieldType;
  onUpdate: (updatedField: ExtractedFieldType) => void;
  onHighlightSource: (sourceRef: string) => void;
}

export function ExtractedField({ field, onUpdate, onHighlightSource }: ExtractedFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(field.value);

  const handleSave = () => {
    onUpdate({ ...field, value, verified: true, needsEdit: false });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(field.value);
    setIsEditing(false);
  };

  const toggleVerify = () => {
    onUpdate({ ...field, verified: !field.verified, needsEdit: field.verified });
  };

  return (
    <div className={`p-4 border-b border-[var(--border)] group transition-colors ${field.verified ? "bg-white" : "bg-[var(--status-pending-bg)]"}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">{field.label}</span>
          <button 
            onClick={() => onHighlightSource(field.sourceRef)}
            className="text-[10px] text-[var(--accent-blue)] hover:underline flex items-center gap-1"
          >
            Source: {field.sourceRef.replace("-", ", ")}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
            field.confidence >= 90 ? "bg-green-100 text-green-700 border border-green-200" :
            field.confidence >= 70 ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : 
            "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {field.confidence >= 70 ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
            {field.confidence}%
          </span>
          
          <button 
            onClick={toggleVerify}
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
              field.verified 
                ? "bg-[var(--status-verified)] text-white hover:bg-green-600" 
                : "bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]"
            }`}
            title={field.verified ? "Mark as unverified" : "Mark as verified"}
          >
            {field.verified ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-2 flex flex-col gap-2">
          {field.value.length > 50 ? (
            <textarea 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full min-h-[80px] text-sm bg-[var(--surface)] border border-[var(--accent-blue)] rounded-lg p-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue-light)]"
            />
          ) : (
            <input 
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full text-sm bg-[var(--surface)] border border-[var(--accent-blue)] rounded-lg p-2 px-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue-light)]"
            />
          )}
          <div className="flex justify-end gap-2">
            <button onClick={handleCancel} className="text-xs px-3 py-1.5 rounded-md border border-[var(--border)] hover:bg-[var(--surface-raised)] transition-colors">Cancel</button>
            <button onClick={handleSave} className="text-xs px-3 py-1.5 rounded-md bg-[var(--accent-navy)] text-white hover:bg-[#152a45] transition-colors">Save</button>
          </div>
        </div>
      ) : (
        <div className="mt-1 flex justify-between items-start group-hover:bg-[var(--surface-raised)] p-2 -mx-2 rounded-md transition-colors">
          <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">{field.value}</p>
          <button 
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-opacity"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
