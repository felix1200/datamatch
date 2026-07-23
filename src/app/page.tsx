'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { parseExcelFile, type ExcelFile, type SheetData } from '@/lib/excel-utils';
import { generateFormulas, executeLookup, type VlookupConfig, type VlookupResult } from '@/lib/vlookup-engine';
import { FileUploadArea } from '@/components/file-upload';
import { CompactPreview } from '@/components/compact-preview';
import { ConfigPanel } from '@/components/config-panel';
import { ActionButtons } from '@/components/action-buttons';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { canProcess, incrementUsage, getUsage, type UsageData } from '@/lib/subscription';

const DEFAULT_CONFIG: VlookupConfig = {
  sourceFileIndex: 0,
  sourceSheetName: '',
  lookupValueCol: '',
  targetFileIndex: 0,
  targetSheetName: '',
  lookupRangeStartCol: '',
  lookupRangeEndCol: '',
  returnColumns: [],
  matchMode: 'exact',
};

export default function Home() {
  const [files, setFiles] = useState<ExcelFile[]>([]);
  const [isSingleFile, setIsSingleFile] = useState(true);
  const [config, setConfig] = useState<VlookupConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'download' | 'preview' | 'formula'>('download');
  const [usage, setUsage] = useState<UsageData>({ processesThisMonth: 0, lastResetDate: new Date().toISOString(), currentPlan: 'free' });
  const [limitError, setLimitError] = useState<string | null>(null);

  useEffect(() => {
    setUsage(getUsage());
  }, []);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    Promise.all(newFiles.map(parseExcelFile)).then((parsed) => {
      setFiles((prev) => {
        const combined = [...prev, ...parsed].slice(0, 2);
        const first = combined[0];
        if (first && first.sheets.length > 0) {
          const sheetName = first.sheets[0].name;
          setConfig((prev2) => ({
            ...prev2,
            sourceFileIndex: 0,
            sourceSheetName: sheetName,
            targetFileIndex: combined.length > 1 ? 1 : 0,
            targetSheetName: combined.length > 1 && combined[1]?.sheets[0] ? combined[1].sheets[0].name : sheetName,
            lookupValueCol: '',
            lookupRangeStartCol: '',
            lookupRangeEndCol: '',
            returnColumns: [],
          }));
        }
        return combined;
      });
    });
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const sourceFile = files[config.sourceFileIndex];
  const targetFile = files[isSingleFile ? config.sourceFileIndex : config.targetFileIndex];
  const sourceSheet = sourceFile?.sheets.find((s) => s.name === config.sourceSheetName);
  const targetSheet = targetFile?.sheets.find((s) => s.name === config.targetSheetName);

  const isConfigValid = !!(
    sourceSheet &&
    targetSheet &&
    config.lookupValueCol &&
    config.lookupRangeStartCol &&
    config.lookupRangeEndCol &&
    config.returnColumns.length > 0
  );

  const formulas = useMemo(() => {
    if (!isConfigValid || !sourceSheet || !targetSheet) return [];
    return generateFormulas(sourceSheet, targetSheet, config);
  }, [isConfigValid, sourceSheet, targetSheet, config]);

  const matchResults = useMemo(() => {
    if (!isConfigValid || !sourceSheet || !targetSheet) return [];
    return executeLookup(sourceSheet, targetSheet, config);
  }, [isConfigValid, sourceSheet, targetSheet, config]);

  const updateConfig = useCallback((partial: Partial<VlookupConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleSheetChange = useCallback((type: 'source' | 'target', sheetName: string) => {
    setConfig((prev) => {
      if (type === 'source') {
        return { ...prev, sourceSheetName: sheetName, lookupValueCol: '', lookupRangeStartCol: '', lookupRangeEndCol: '', returnColumns: [] };
      }
      return { ...prev, targetSheetName: sheetName, lookupRangeStartCol: '', lookupRangeEndCol: '', returnColumns: [] };
    });
  }, []);

  const handleFileModeChange = useCallback((single: boolean) => {
    setIsSingleFile(single);
    setConfig((prev) => ({
      ...prev,
      targetFileIndex: single ? prev.sourceFileIndex : (prev.sourceFileIndex === 0 ? 1 : 0),
      targetSheetName: '',
      lookupRangeStartCol: '',
      lookupRangeEndCol: '',
      returnColumns: [],
    }));
  }, []);

  const sourceArrayBuffer = sourceFile?.arrayBuffer;
  const sourceFileName = sourceFile?.name || 'data';

  const hasFiles = files.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="border-b bg-white px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">DataMatch</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-medium">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              100% Private
            </span>
          </div>
          <p className="text-xs text-gray-500">Match & look up data between spreadsheets — no formulas needed</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={isSingleFile} onCheckedChange={handleFileModeChange} />
            <Label className="text-sm text-gray-600 cursor-pointer" onClick={() => handleFileModeChange(!isSingleFile)}>
              {isSingleFile ? 'One file' : 'Two files'}
            </Label>
          </div>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {usage.currentPlan === 'free' 
                ? `${usage.processesThisMonth}/3 free uses`
                : `${usage.currentPlan.charAt(0).toUpperCase() + usage.currentPlan.slice(1)} plan`
              }
            </span>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                <Sparkles className="w-3 h-3" />
                Upgrade
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Limit error alert */}
      {limitError && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 flex-1">{limitError}</p>
          <Link href="/pricing">
            <Button size="sm" className="h-7 text-xs bg-amber-600 hover:bg-amber-700">
              Upgrade Now
            </Button>
          </Link>
          <button onClick={() => setLimitError(null)} className="text-amber-600 hover:text-amber-800">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main content - two column layout */}
      <main className="flex-1 flex gap-0 overflow-hidden">
        {/* Left: Upload + Preview */}
        <div className="w-[45%] flex flex-col border-r bg-white">
          {!hasFiles ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
              <div className="text-center max-w-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-2">What does this tool do?</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  If you have data in one spreadsheet and need to find matching information from another, this tool does it for you automatically. 
                  Just upload your files, tell us which columns to match, and we'll fill in the results — no formulas required.
                </p>
                <div className="text-left bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-medium text-gray-700 mb-2">How it works:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-medium">1.</span>
                      <span>Upload your Excel files (or use one file with multiple sheets)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-medium">2.</span>
                      <span>Select which column has the values you want to look up</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-medium">3.</span>
                      <span>Choose the reference sheet and the column to match against</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-medium">4.</span>
                      <span>Download the result with matched data added as new columns</span>
                    </li>
                  </ul>
                </div>
              </div>
              <FileUploadArea
                files={files}
                onFilesAdded={handleFilesAdded}
                onRemoveFile={removeFile}
                maxFiles={isSingleFile ? 1 : 2}
                compact
              />
            </div>
          ) : (
            <>
              <div className="px-4 pt-3 pb-2 border-b shrink-0">
                <FileUploadArea
                  files={files}
                  onFilesAdded={handleFilesAdded}
                  onRemoveFile={removeFile}
                  maxFiles={isSingleFile ? 1 : 2}
                  compact
                  inline
                />
              </div>
              <div className="flex-1 overflow-hidden">
                {sourceSheet && (
                  <CompactPreview
                    sheet={sourceSheet}
                    title={isSingleFile ? config.sourceSheetName || 'Preview' : `${sourceFile?.name} — ${config.sourceSheetName}`}
                    highlightCol={config.lookupValueCol}
                    highlightLabel="Match column"
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Config + Actions */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {hasFiles ? (
            <>
              <div className="flex-1 overflow-auto px-5 py-4">
                <ConfigPanel
                  files={files}
                  isSingleFile={isSingleFile}
                  config={config}
                  sourceSheet={sourceSheet}
                  targetSheet={targetSheet}
                  onChange={updateConfig}
                  onSheetChange={handleSheetChange}
                />
              </div>
              {isConfigValid && (
                <div className="border-t bg-white px-5 py-3 shrink-0">
                  <ActionButtons
                    formulas={formulas}
                    matchResults={matchResults}
                    sourceSheet={sourceSheet!}
                    returnColumns={config.returnColumns}
                    sourceFileName={sourceFileName}
                    sourceArrayBuffer={sourceArrayBuffer}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onBeforeDownload={() => {
                      const rowCount = sourceSheet?.rows.length || 0;
                      const check = canProcess(rowCount, !isSingleFile);
                      if (!check.allowed) {
                        setLimitError(check.reason || null);
                      } else {
                        setLimitError(null);
                      }
                      return check;
                    }}
                    onAfterDownload={() => {
                      const newUsage = incrementUsage();
                      setUsage(newUsage);
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900 mb-2">Ready to match data</h2>
                <p className="text-sm text-gray-500">
                  Upload your Excel files in the left panel to start matching and looking up data between spreadsheets.
                </p>
                <p className="text-xs text-gray-400 mt-3">Supports .xlsx, .xls, and .csv files</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Trust Footer */}
      <footer className="border-t bg-white px-6 py-3 flex items-center justify-center gap-6 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Your files never leave your browser</span>
        </div>
        <div className="h-3 w-px bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>No data uploaded to any server</span>
        </div>
        <div className="h-3 w-px bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>100% client-side processing</span>
        </div>
      </footer>
    </div>
  );
}
