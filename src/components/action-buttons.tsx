'use client';

import { useState } from 'react';
import { type SheetData } from '@/lib/excel-utils';
import { type VlookupResult } from '@/lib/vlookup-engine';
import { downloadExcelWithResults } from '@/lib/excel-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Check, Eye, Code, Lock } from 'lucide-react';
import { needsToPayForDownload, markFileAsDownloaded, payForDownload, calculateFileHash, isUserLoggedIn } from '@/lib/subscription';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthModal } from '@/components/auth-modal';
import { type User } from '@/lib/auth';

interface ActionButtonsProps {
  formulas: string[];
  matchResults: VlookupResult[];
  sourceSheet: SheetData;
  returnColumns: string[];
  sourceFileName: string;
  sourceArrayBuffer: ArrayBuffer | undefined;
  activeTab: 'download' | 'preview' | 'formula';
  onTabChange: (tab: 'download' | 'preview' | 'formula') => void;
  onBeforeDownload?: () => { allowed: boolean; reason?: string };
  onAfterDownload?: () => void;
}

export function ActionButtons({
  formulas,
  matchResults,
  sourceSheet,
  returnColumns,
  sourceFileName,
  sourceArrayBuffer,
  activeTab,
  onTabChange,
  onBeforeDownload,
  onAfterDownload,
}: ActionButtonsProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [pendingFileHash, setPendingFileHash] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const matchedCount = matchResults.filter((r) => r.matched).length;
  const totalCount = matchResults.length;

  // Check if user is logged in on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('datamatch_user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          // Invalid user data, ignore
        }
      }
    }
  });

  const copyOne = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(formulas.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const doDownload = async () => {
    if (!sourceArrayBuffer) return;
    
    setDownloading(true);
    try {
      await downloadExcelWithResults(
        sourceArrayBuffer,
        sourceSheet.name,
        sourceSheet,
        returnColumns,
        matchResults,
        sourceFileName
      );
      // Mark file as downloaded after successful download
      if (pendingFileHash) {
        markFileAsDownloaded(pendingFileHash);
      }
      if (onAfterDownload) {
        onAfterDownload();
      }
    } finally {
      setDownloading(false);
      setPendingFileHash(null);
    }
  };

  const handleDownload = async () => {
    if (!sourceArrayBuffer) return;
    
    // Check limits before downloading
    if (onBeforeDownload) {
      const check = onBeforeDownload();
      if (!check.allowed) {
        alert(check.reason || 'Unable to process. Please upgrade your plan.');
        return;
      }
    }
    
    // Check if user is logged in (required for download)
    if (!isUserLoggedIn()) {
      setShowAuthModal(true);
      return;
    }
    
    // Calculate file hash to check if payment is needed
    const fileHash = await calculateFileHash(sourceArrayBuffer);
    
    // Check if payment is needed
    const { needsPayment, price } = needsToPayForDownload(fileHash);
    
    if (needsPayment) {
      // Show payment dialog
      setPendingFileHash(fileHash);
      setShowPayDialog(true);
      return;
    }
    
    // No payment needed, proceed with download
    setPendingFileHash(fileHash);
    await doDownload();
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    // After successful login, proceed with download
    if (sourceArrayBuffer) {
      calculateFileHash(sourceArrayBuffer).then((fileHash) => {
        const { needsPayment } = needsToPayForDownload(fileHash);
        if (needsPayment) {
          setPendingFileHash(fileHash);
          setShowPayDialog(true);
        } else {
          setPendingFileHash(fileHash);
          doDownload();
        }
      });
    }
  };

  const handlePayAndDownload = async () => {
    if (!pendingFileHash) return;
    
    setPaying(true);
    try {
      // TODO: Integrate with actual payment provider (Stripe)
      const result = await payForDownload(pendingFileHash, sourceFileName, sourceSheet.rows.length);
      
      if (result.success) {
        setShowPayDialog(false);
        await doDownload();
      } else {
        alert(result.message || 'Payment failed. Please try again.');
      }
    } finally {
      setPaying(false);
    }
  };

  const tabs = [
    { key: 'download' as const, label: 'Download', icon: Download },
    { key: 'preview' as const, label: 'Preview', icon: Eye },
    { key: 'formula' as const, label: 'Formulas', icon: Code },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <Badge variant={matchedCount === totalCount ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
            {matchedCount}/{totalCount} matched
          </Badge>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'download' && (
        <div className="flex items-center gap-3">
          <Button onClick={handleDownload} disabled={downloading} className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-5">
            <Download className="w-4 h-4 mr-1.5" />
            {downloading ? 'Preparing...' : 'Download Excel'}
          </Button>
          <p className="text-xs text-gray-500">
            Your original file with <span className="font-medium text-gray-700">{returnColumns.length} new column{returnColumns.length > 1 ? 's' : ''}</span> added
          </p>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="max-h-40 overflow-auto rounded border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-gray-50 border-b">
              <tr>
                <th className="px-2 py-1.5 text-left font-medium text-gray-500">#</th>
                <th className="px-2 py-1.5 text-left font-medium text-gray-500">Look up value</th>
                {returnColumns.map((col) => (
                  <th key={col} className="px-2 py-1.5 text-left font-medium text-emerald-600">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matchResults.slice(0, 20).map((r, i) => (
                <tr key={i} className={`border-b border-gray-50 ${!r.matched ? 'bg-red-50/40' : ''}`}>
                  <td className="px-2 py-1 text-gray-400">{i + 1}</td>
                  <td className="px-2 py-1 font-medium text-gray-700">{String(r.lookupValue)}</td>
                  {r.returnValues.map((v, j) => (
                    <td key={j} className={`px-2 py-1 ${r.matched ? 'text-gray-700' : 'text-red-400 italic'}`}>
                      {r.matched ? String(v ?? '') : 'Not found'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {matchResults.length > 20 && (
            <div className="py-1.5 text-center text-xs text-gray-400">+{matchResults.length - 20} more</div>
          )}
        </div>
      )}

      {activeTab === 'formula' && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={copyAll} className="h-7 text-xs">
            {copiedAll ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            {copiedAll ? 'Copied!' : 'Copy all'}
          </Button>
          <span className="text-xs text-gray-400">{formulas.length} formulas</span>
          <div className="ml-auto max-w-md truncate text-xs font-mono text-gray-400">
            {formulas[0]}
          </div>
        </div>
      )}

      {/* Payment Dialog for Free Users */}
      <Dialog open={showPayDialog} onOpenChange={setShowPayDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              Download this file
            </DialogTitle>
            <DialogDescription>
              You're on the Free plan. Download costs $2 per file.
              <br />
              <span className="text-xs text-gray-500 mt-1 block">
                Same file can be re-downloaded for free anytime.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">File</span>
                <span className="font-medium text-gray-900">{sourceFileName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rows</span>
                <span className="font-medium text-gray-900">{sourceSheet.rows.length.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-emerald-600">$2.00</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <p className="text-xs text-emerald-700">
                <strong>Upgrade to Pro</strong> for $9/month and get unlimited downloads included.
                <a href="/pricing" className="underline ml-1">See plans</a>
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPayDialog(false)} disabled={paying}>
              Cancel
            </Button>
            <Button onClick={handlePayAndDownload} disabled={paying} className="bg-emerald-600 hover:bg-emerald-700">
              {paying ? 'Processing...' : 'Pay $2 & Download'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auth Modal - Required for Download */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
