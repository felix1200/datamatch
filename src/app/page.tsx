'use client';

import { useState, useMemo, useCallback } from 'react';
import { FileSpreadsheet, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import { DataPreview } from '@/components/data-preview';
import { VlookupConfigPanel, type VlookupConfig } from '@/components/vlookup-config';
import { OutputPanel } from '@/components/output-panel';
import { parseExcelFile, type ExcelFile } from '@/lib/excel-utils';
import { generateVlookupFormulas } from '@/lib/vlookup-engine';

const DEFAULT_CONFIG: VlookupConfig = {
  sourceFileIndex: 0,
  sourceSheetName: '',
  lookupColumn: '',
  targetFileIndex: 1,
  targetSheetName: '',
  lookupRangeStartCol: '',
  lookupRangeEndCol: '',
  returnColumns: [],
  matchMode: 'exact',
};

export default function Home() {
  const [files, setFiles] = useState<(ExcelFile | null)[]>([null, null]);
  const [rawFiles, setRawFiles] = useState<(File | null)[]>([null, null]);
  const [config, setConfig] = useState<VlookupConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (index: number, file: File | null) => {
    setError(null);
    const newRawFiles = [...rawFiles];
    newRawFiles[index] = file;
    setRawFiles(newRawFiles);

    if (!file) {
      const newFiles = [...files];
      newFiles[index] = null;
      setFiles(newFiles);
      return;
    }

    setLoading(true);
    try {
      const parsed = await parseExcelFile(file);
      const newFiles = [...files];
      newFiles[index] = parsed;
      setFiles(newFiles);

      // Auto-set sheet names
      setConfig((prev) => {
        const updated = { ...prev };
        if (index === 0) {
          updated.sourceFileIndex = 0;
          updated.sourceSheetName = parsed.activeSheet;
        } else {
          updated.targetFileIndex = 1;
          updated.targetSheetName = parsed.activeSheet;
        }
        return updated;
      });
    } catch {
      setError(`Failed to parse file: ${file.name}. Please check the file format and try again.`);
    } finally {
      setLoading(false);
    }
  }, [files, rawFiles]);

  const handleSheetChange = useCallback((index: number, sheetName: string) => {
    const newFiles = [...files];
    if (newFiles[index]) {
      newFiles[index] = { ...newFiles[index]!, activeSheet: sheetName };
      setFiles(newFiles);
    }
    // Also update config sheet name
    setConfig((prev) => {
      if (index === 0) {
        return { ...prev, sourceSheetName: sheetName, lookupColumn: '' };
      } else {
        return { ...prev, targetSheetName: sheetName, lookupRangeStartCol: '', lookupRangeEndCol: '', returnColumns: [] };
      }
    });
  }, [files]);

  const uploadedFiles = files.filter((f): f is ExcelFile => f !== null);

  const sourceSheet = useMemo(() => {
    const file = files[config.sourceFileIndex];
    return file?.sheets.find((s) => s.name === config.sourceSheetName) ?? null;
  }, [files, config.sourceFileIndex, config.sourceSheetName]);

  const targetSheet = useMemo(() => {
    const file = files[config.targetFileIndex];
    return file?.sheets.find((s) => s.name === config.targetSheetName) ?? null;
  }, [files, config.targetFileIndex, config.targetSheetName]);

  const formulas = useMemo(() => {
    if (
      !sourceSheet ||
      !targetSheet ||
      !config.lookupColumn ||
      config.returnColumns.length === 0 ||
      !config.lookupRangeStartCol ||
      !config.lookupRangeEndCol
    ) {
      return [];
    }
    return sourceSheet.rows.map((_, i) =>
      generateVlookupFormulas(
        {
          lookupColumn: config.lookupColumn,
          lookupSheet: targetSheet,
          lookupRangeStartCol: config.lookupRangeStartCol,
          lookupRangeEndCol: config.lookupRangeEndCol,
          returnColumns: config.returnColumns,
          matchMode: config.matchMode,
        },
        i
      )
    );
  }, [sourceSheet, targetSheet, config]);

  const isConfigComplete =
    config.lookupColumn &&
    config.returnColumns.length > 0 &&
    config.lookupRangeStartCol &&
    config.lookupRangeEndCol;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-emerald-600 text-white">
            <FileSpreadsheet className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">VLOOKUP Formula Builder</h1>
            <p className="text-xs text-muted-foreground">Build VLOOKUP formulas visually — no Excel expertise needed</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Step 1: Upload */}
        <section className="space-y-4">
          <StepHeader
            step={1}
            title="Upload Your Excel Files"
            desc="Upload up to 2 files — one with the data you want to look up, and one with the reference table to match against."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUpload
              label="File 1 — Source data (contains lookup values)"
              file={rawFiles[0]}
              onFileChange={(f) => handleFileChange(0, f)}
            />
            <FileUpload
              label="File 2 — Reference table (contains data to match)"
              file={rawFiles[1]}
              onFileChange={(f) => handleFileChange(1, f)}
            />
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              Parsing file...
            </div>
          )}
        </section>

        {/* Step 2: Preview */}
        {uploadedFiles.length > 0 && (
          <section className="space-y-4">
            <StepHeader
              step={2}
              title="Preview Your Data"
              desc="Review the contents of your uploaded files. Switch between sheets if needed."
            />
            <div className="grid grid-cols-1 gap-6">
              {files.map((file, index) =>
                file ? (
                  <DataPreview
                    key={file.id}
                    data={file.sheets.find((s) => s.name === file.activeSheet) ?? null}
                    sheetName={file.activeSheet}
                    sheets={file.sheets}
                    onSheetChange={(name) => handleSheetChange(index, name)}
                    label={file.fileName}
                    colorClass={index === 0 ? 'text-emerald-600' : 'text-blue-600'}
                  />
                ) : null
              )}
            </div>
          </section>
        )}

        {/* Step 3: Config */}
        {uploadedFiles.length >= 1 && (
          <section className="space-y-4">
            <StepHeader
              step={3}
              title="Configure Your VLOOKUP"
              desc="Select which columns to use for matching and what data to return. You can return multiple columns at once."
            />
            <div className="rounded-xl border border-border bg-card p-6">
              <VlookupConfigPanel
                files={uploadedFiles.map((f) => ({ fileName: f.fileName, sheets: f.sheets, activeSheet: f.activeSheet }))}
                config={{
                  ...config,
                  sourceFileIndex: Math.min(config.sourceFileIndex, uploadedFiles.length - 1),
                  targetFileIndex: Math.min(config.targetFileIndex, uploadedFiles.length - 1),
                }}
                onConfigChange={setConfig}
              />
            </div>
          </section>
        )}

        {/* Step 4: Output */}
        {isConfigComplete && (
          <section className="space-y-4">
            <StepHeader
              step={4}
              title="Your Results"
              desc="Copy formulas, preview matched data, or download everything as an Excel file."
            />
            <div className="rounded-xl border border-border bg-card p-6">
              <OutputPanel
                formulas={formulas}
                sourceSheet={sourceSheet}
                targetSheet={targetSheet}
                config={config}
                lookupColumn={config.lookupColumn}
                returnColumns={config.returnColumns}
              />
            </div>
          </section>
        )}

        {/* Empty state */}
        {uploadedFiles.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <Sparkles className="size-8 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Get Started</h2>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Upload your Excel files above, then use the visual controls to configure your VLOOKUP.
              We&apos;ll generate the formulas for you — no need to memorize syntax or cell references.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground">
          VLOOKUP Formula Builder — All processing happens in your browser. Your files never leave your device.
        </div>
      </footer>
    </div>
  );
}

function StepHeader({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center size-7 rounded-full bg-emerald-600 text-white text-xs font-bold">
        {step}
      </div>
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
