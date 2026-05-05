'use client';

import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

export function DropZone({ onFileSelect, file, onClear }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const droppedFile = files[0];
        if (droppedFile.type === 'application/pdf') {
          onFileSelect(droppedFile);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  if (file) {
    return (
      <div className="border-2 border-jade border-dashed rounded-xl p-8 bg-jade-light/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-jade/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-jade" />
            </div>
            <div>
              <p className="font-medium text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-2 hover:bg-jade/10 rounded-lg transition-colors"
            aria-label="Remove file"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer',
        isDragging
          ? 'border-saffron bg-saffron-light/50'
          : 'border-border hover:border-saffron/50 hover:bg-muted/30'
      )}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'w-16 h-16 rounded-xl flex items-center justify-center transition-colors',
              isDragging ? 'bg-saffron text-white' : 'bg-navy text-white'
            )}
          >
            <Upload className="h-8 w-8" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Drop judgment PDF here or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Accepts PDF files only (max 50MB)
            </p>
          </div>
        </div>
      </label>
    </div>
  );
}
