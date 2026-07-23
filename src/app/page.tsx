'use client';

import { useState, useMemo, useCallback } from 'react';
import { parseExcelFile, type ExcelFile, type SheetData } from '@/lib/excel-utils';
import { generateFormulas, executeLookup, type VlookupConfig, type VlookupResult } from '@/lib/vlookup-engine';
import { FileUploadArea } from '@/components/file-upload';
import { CompactPreview } from '@/components/compact-preview';
import { ConfigPanel } from '@/components/config-panel';
import { ActionButtons } from '@/components/action-buttons';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">DataMatch</h1>
            <p className="text-xs text-gray-500">Match & look up data between spreadsheets — no formulas needed</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={isSingleFile} onCheckedChange={handleFileModeChange} />
            <Label className="text-sm text-gray-600 cursor-pointer" onClick={() => handleFileModeChange(!isSingleFile)}>
              {isSingleFile ? 'One file' : 'Two files'}
            </Label>
          </div>
        </div>
      </header>

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
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">How it works</h2>
                <div className="text-sm text-gray-500 space-y-2 text-left">
                  <p><span className="font-medium text-gray-700">1.</span> Upload your Excel file(s)</p>
                  <p><span className="font-medium text-gray-700">2.</span> Pick which column has the values you want to look up</p>
                  <p><span className="font-medium text-gray-700">3.</span> Choose the reference sheet and the column to match against</p>
                  <p><span className="font-medium text-gray-700">4.</span> Select the columns to bring back</p>
                  <p><span className="font-medium text-gray-700">5.</span> Download the result — your original data plus the new columns</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">Works with .xlsx, .xls, and .csv files. All processing happens in your browser.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
