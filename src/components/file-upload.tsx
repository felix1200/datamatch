'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, FileSpreadsheet, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ExcelFile } from '@/lib/excel-utils';

interface FileUploadAreaProps {
  files: ExcelFile[];
  onFilesAdded: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  maxFiles: number;
  compact?: boolean;
  inline?: boolean;
}

export function FileUploadArea({ files, onFilesAdded, onRemoveFile, maxFiles, compact, inline }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const canAddMore = files.length < maxFiles;

  const handleClick = useCallback(() => {
    if (canAddMore) inputRef.current?.click();
  }, [canAddMore]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (!canAddMore) return;
      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => isValidFile(f));
      if (droppedFiles.length > 0) {
        onFilesAdded(droppedFiles.slice(0, maxFiles - files.length));
      }
    },
    [canAddMore, onFilesAdded, maxFiles, files.length]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = Array.from(e.target.files || []);
      if (selected.length > 0) {
        onFilesAdded(selected.slice(0, maxFiles - files.length));
      }
      e.target.value = '';
    },
    [onFilesAdded, maxFiles, files.length]
  );

  // Inline mode: compact horizontal layout
  if (inline) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-md px-2 py-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-xs text-gray-700 truncate max-w-[120px]">{f.name}</span>
            <button onClick={() => onRemoveFile(i)} className="text-gray-400 hover:text-red-500 transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {canAddMore && (
          <button
            onClick={handleClick}
            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 border border-dashed border-emerald-300 rounded-md px-2 py-1 hover:bg-emerald-50 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add file
          </button>
        )}
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" multiple onChange={handleFileInput} className="hidden" />
      </div>
    );
  }

  // Compact mode: smaller upload area
  if (compact) {
    return (
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer w-full',
          isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50',
          !canAddMore && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Upload className={cn('w-6 h-6', isDragging ? 'text-emerald-500' : 'text-gray-400')} />
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Drop files here or <span className="text-emerald-600 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">.xlsx, .xls, .csv — up to {maxFiles} file{maxFiles > 1 ? 's' : ''}</p>
          <p className="text-[10px] text-emerald-600 mt-1 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Files stay in your browser — never uploaded
          </p>
        </div>
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" multiple onChange={handleFileInput} className="hidden" />
      </div>
    );
  }

  // Default: full size
  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer',
        isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
      )}
    >
      <Upload className={cn('w-8 h-8', isDragging ? 'text-emerald-500' : 'text-gray-400')} />
      <div className="text-center">
        <p className="text-base text-gray-700">
          Drop Excel files here or <span className="text-emerald-600 font-medium">click to upload</span>
        </p>
        <p className="text-sm text-gray-400 mt-1">.xlsx, .xls, .csv — up to {maxFiles} files</p>
      </div>
      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" multiple onChange={handleFileInput} className="hidden" />
    </div>
  );
}

function isValidFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv');
}
