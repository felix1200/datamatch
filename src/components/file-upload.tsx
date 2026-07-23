'use client';

import { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
}

export function FileUpload({ label, file, onFileChange, accept = '.xlsx,.xls,.csv' }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && isValidFile(droppedFile, accept)) {
        onFileChange(droppedFile);
      }
    },
    [onFileChange, accept]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileChange(selectedFile);
      }
      e.target.value = '';
    },
    [onFileChange]
  );

  const handleRemove = useCallback(() => {
    onFileChange(null);
  }, [onFileChange]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer',
            isDragging
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-border hover:border-emerald-400 hover:bg-muted/50'
          )}
        >
          <Upload className={cn('size-8', isDragging ? 'text-emerald-500' : 'text-muted-foreground')} />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Drag & drop your file here, or <span className="text-emerald-600 font-medium">click to browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Supports .xlsx, .xls, and .csv files</p>
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 opacity-0 cursor-pointer"
            style={{ position: 'relative' }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-emerald-50/50 p-4">
          <FileSpreadsheet className="size-8 text-emerald-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <button
            onClick={handleRemove}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Remove file"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function isValidFile(file: File, accept: string): boolean {
  const extensions = accept.split(',').map((ext) => ext.trim().toLowerCase());
  const fileName = file.name.toLowerCase();
  return extensions.some((ext) => fileName.endsWith(ext));
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
