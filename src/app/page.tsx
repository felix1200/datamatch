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
import { AlertTriangle, Sparkles, ArrowRight, Shield, Zap, Download, Table, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { canProcess, getUsage, isUserLoggedIn, type UsageData } from '@/lib/subscription';
import { logoutUser, type User } from '@/lib/auth';
import CookieConsent from '@/components/cookie-consent';
import { AuthModal } from '@/components/auth-modal';

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
  const [usage, setUsage] = useState<UsageData>({ currentPlan: 'free', downloadedFiles: [] });
  const [limitError, setLimitError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  useEffect(() => {
    setUsage(getUsage());
    // Check if user is logged in
    if (isUserLoggedIn()) {
      const savedUser = localStorage.getItem('datamatch_user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          // Invalid user data, ignore
        }
      }
    }
  }, []);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    setUploadProgress({ current: 0, total: newFiles.length });
    
    let processed = 0;
    const promises = newFiles.map((file) => 
      parseExcelFile(file).then((result) => {
        processed++;
        setUploadProgress({ current: processed, total: newFiles.length });
        return result;
      })
    );
    
    Promise.all(promises).then((parsed) => {
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
      setUploadProgress(null);
    }).catch((error) => {
      console.error('Error parsing files:', error);
      setUploadProgress(null);
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

  const handleLogout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
  }, []);

  const handleAuthSuccess = useCallback((user: User) => {
    setCurrentUser(user);
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
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Frosted Glass Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm shadow-emerald-500/20">
                <Table className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] sm:text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">DataMatch</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              <Link href="/pricing" className="px-3 py-1.5 text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] rounded-full hover:bg-black/[0.04] transition-all">
                Pricing
              </Link>
              <Link href="/privacy" className="px-3 py-1.5 text-[13px] text-[#6e6e73] hover:text-[#1d1d1f] rounded-full hover:bg-black/[0.04] transition-all">
                Privacy
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-medium text-emerald-700">100% Private</span>
            </div>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="hidden sm:flex items-center gap-1.5 text-[13px] text-gray-600 hover:text-[#1d1d1f] transition-colors">
                  <UserIcon className="w-4 h-4" />
                  <span className="truncate max-w-[120px]">{currentUser.email}</span>
                </Link>
                <Button size="sm" variant="outline" onClick={handleLogout} className="h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-[12px] rounded-full">
                  Sign out
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => setShowAuthModal(true)} className="h-7 sm:h-8 px-3 sm:px-4 text-[11px] sm:text-[13px] rounded-full bg-[#1d1d1f] hover:bg-[#1d1d1f]/90 text-white shadow-sm">
                Sign in
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Limit error alert */}
      {limitError && (
        <div className="bg-amber-50/80 backdrop-blur-sm border-b border-amber-100 px-6 py-3">
          <div className="max-w-[1200px] mx-auto flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-[13px] text-amber-800 flex-1">{limitError}</p>
            <Link href="/pricing">
              <Button size="sm" className="h-7 text-[12px] rounded-full bg-amber-600 hover:bg-amber-700">
                Upgrade Now
              </Button>
            </Link>
            <button onClick={() => setLimitError(null)} className="text-amber-600 hover:text-amber-800 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {!hasFiles ? (
          /* Hero Section - Empty State */
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-2xl mx-auto text-center">
              {/* Large Hero Title */}
              <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-[1.05] mb-4">
                Match data between
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  spreadsheets.
                </span>
              </h1>
              <p className="text-[16px] sm:text-[19px] text-[#6e6e73] leading-relaxed max-w-lg mx-auto mb-8 sm:mb-10">
                Upload your files, pick the columns to match, and get results instantly. No formulas needed.
              </p>

              {/* Upload Progress */}
              {uploadProgress && (
                <div className="mb-6 max-w-md mx-auto">
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-black/[0.04]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-medium text-[#1d1d1f]">Processing files...</span>
                      <span className="text-[13px] text-[#6e6e73]">{uploadProgress.current}/{uploadProgress.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* File Mode Toggle - Prominent */}
              <div className="mb-8">
                <div className="inline-flex items-center bg-white rounded-2xl p-1.5 shadow-lg shadow-black/[0.08] border border-black/[0.06]">
                  <button
                    onClick={() => handleFileModeChange(true)}
                    className={`flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold rounded-xl transition-all ${
                      isSingleFile
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    One file
                  </button>
                  <button
                    onClick={() => handleFileModeChange(false)}
                    className={`flex items-center gap-2 px-5 py-2.5 text-[14px] font-semibold rounded-xl transition-all ${
                      !isSingleFile
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <svg className="w-4 h-4 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Two files
                  </button>
                </div>
                <p className="text-[13px] text-[#6e6e73] mt-3 ml-2">
                  {isSingleFile ? 'Match data within the same file' : 'Match data between two different files'}
                </p>
              </div>

              {/* Upload Card */}
              <div className="max-w-md mx-auto mb-12">
                <FileUploadArea
                  files={files}
                  onFilesAdded={handleFilesAdded}
                  onRemoveFile={removeFile}
                  maxFiles={isSingleFile ? 1 : 2}
                  compact
                />
              </div>

              {/* How it works - Clean Steps */}
              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm shadow-black/[0.04] border border-black/[0.04] flex items-center justify-center mx-auto mb-3">
                    <Download className="w-5 h-5 text-[#1d1d1f]" />
                  </div>
                  <p className="text-[13px] font-medium text-[#1d1d1f]">Upload</p>
                  <p className="text-[12px] text-[#6e6e73] mt-0.5">Drop your Excel files</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm shadow-black/[0.04] border border-black/[0.04] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[#1d1d1f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                  </div>
                  <p className="text-[13px] font-medium text-[#1d1d1f]">Configure</p>
                  <p className="text-[12px] text-[#6e6e73] mt-0.5">Select columns to match</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm shadow-black/[0.04] border border-black/[0.04] flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-[#1d1d1f]" />
                  </div>
                  <p className="text-[13px] font-medium text-[#1d1d1f]">Download</p>
                  <p className="text-[12px] text-[#6e6e73] mt-0.5">Get matched results</p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center justify-center gap-6">
                <div className="flex items-center gap-1.5 text-[12px] text-[#6e6e73]">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Files stay in your browser</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#6e6e73]/30" />
                <div className="flex items-center gap-1.5 text-[12px] text-[#6e6e73]">
                  <Zap className="w-3.5 h-3.5 text-emerald-500" />
                  <span>No sign-up required</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Workspace - Active State */
          <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
            {/* Left: Upload + Preview */}
            <div className="w-full lg:w-[45%] flex flex-col max-h-[50vh] lg:max-h-none">
              <div className="px-5 pt-4 pb-2">
                <FileUploadArea
                  files={files}
                  onFilesAdded={handleFilesAdded}
                  onRemoveFile={removeFile}
                  maxFiles={isSingleFile ? 1 : 2}
                  compact
                  inline
                />
              </div>
              {/* Preview Section */}
              <div className="flex-1 overflow-hidden px-5 pb-5 flex flex-col gap-3">
                {sourceSheet && (
                  <div className={`${!isSingleFile && targetSheet ? 'h-1/2' : 'h-full'} rounded-2xl bg-white shadow-sm shadow-black/[0.04] border border-black/[0.04] overflow-hidden`}>
                    <CompactPreview
                      sheet={sourceSheet}
                      title={isSingleFile ? config.sourceSheetName || 'Preview' : `${sourceFile?.name} — ${config.sourceSheetName}`}
                      highlightCol={config.lookupValueCol}
                      highlightLabel="Match column"
                    />
                  </div>
                )}
                {!isSingleFile && targetSheet && (
                  <div className="h-1/2 rounded-2xl bg-white shadow-sm shadow-black/[0.04] border border-black/[0.04] overflow-hidden">
                    <CompactPreview
                      sheet={targetSheet}
                      title={`${targetFile?.name} — ${config.targetSheetName}`}
                      highlightCol={config.lookupRangeStartCol}
                      highlightLabel="Lookup range"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Config + Actions */}
            <div className="flex-1 flex flex-col overflow-hidden px-5 py-4">
              <div className="flex-1 overflow-auto rounded-2xl bg-white shadow-sm shadow-black/[0.04] border border-black/[0.04]">
                <div className="p-4 lg:p-6">
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
              </div>
              {isConfigValid && (
                <div className="mt-4 rounded-2xl bg-white shadow-sm shadow-black/[0.04] border border-black/[0.04] p-4">
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
                      setUsage(getUsage());
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-black/[0.04] bg-white/60 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-[#6e6e73]">&copy; 2024 DataMatch</span>
            <div className="flex items-center gap-1 text-[12px] text-[#6e6e73]">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>All processing happens in your browser</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">Terms</Link>
            <Link href="/cookies" className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">Cookies</Link>
            <Link href="/refund-policy" className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">Refunds</Link>
            <Link href="/contact" className="text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors">Contact</Link>
            <div className="h-3 w-px bg-black/[0.08]" />
            <Link href="/admin" className="text-[12px] text-[#6e6e73]/60 hover:text-[#1d1d1f] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
