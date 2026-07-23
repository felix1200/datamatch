'use client';

import { useState } from 'react';
import { type SheetData } from '@/lib/excel-utils';
import { type VlookupResult } from '@/lib/vlookup-engine';
import { downloadExcelWithResults } from '@/lib/excel-utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Copy, Check, Eye, Code } from 'lucide-react';

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

  const matchedCount = matchResults.filter((r) => r.matched).length;
  const totalCount = matchResults.length;

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
      // Increment usage after successful download
      if (onAfterDownload) {
        onAfterDownload();
      }
    } finally {
      setDownloading(false);
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
    </div>
  );
}
