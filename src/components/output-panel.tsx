'use client';

import { useState, useMemo, useCallback } from 'react';
import { Copy, Download, Check, Table2, Code, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateExcelFile } from '@/lib/excel-utils';
import { executeVlookup } from '@/lib/vlookup-engine';
import type { SheetData } from '@/lib/excel-utils';
import type { VlookupConfig } from './vlookup-config';

interface OutputPanelProps {
  formulas: string[][];
  sourceSheet: SheetData | null;
  targetSheet: SheetData | null;
  config: VlookupConfig;
  lookupColumn: string;
  returnColumns: string[];
}

export function OutputPanel({ formulas, sourceSheet, targetSheet, config, lookupColumn, returnColumns }: OutputPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('formula');

  const matchResults = useMemo(() => {
    if (!sourceSheet || !targetSheet || !lookupColumn || returnColumns.length === 0) return null;
    return executeVlookup(sourceSheet.rows, targetSheet, lookupColumn, returnColumns, config.matchMode);
  }, [sourceSheet, targetSheet, lookupColumn, returnColumns, config.matchMode]);

  const handleCopy = useCallback(async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleCopyAll = useCallback(async () => {
    const allFormulas = formulas.map((row) => row.join('\t')).join('\n');
    await navigator.clipboard.writeText(allFormulas);
    setCopiedIndex('all');
    setTimeout(() => setCopiedIndex(null), 2000);
  }, [formulas]);

  const handleDownload = useCallback(() => {
    if (!sourceSheet || !matchResults) return;

    const exportData = sourceSheet.rows.map((row, i) => {
      const result = matchResults[i];
      const resultCols: Record<string, string | number | boolean | null> = {};
      returnColumns.forEach((col, j) => {
        resultCols[`${col} (VLOOKUP)`] = result?.returnValues[j] ?? '#N/A';
      });
      return { ...row, ...resultCols };
    });

    generateExcelFile(exportData, 'vlookup_result.xlsx');
  }, [sourceSheet, matchResults, returnColumns]);

  if (formulas.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">完成上方配置后将自动生成 VLOOKUP 公式</p>
      </div>
    );
  }

  const totalFormulas = formulas.reduce((sum, row) => sum + row.length, 0);
  const matchedCount = matchResults?.filter((r) => r.matched).length ?? 0;
  const totalCount = matchResults?.length ?? 0;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            共生成 <span className="font-semibold text-foreground">{totalFormulas}</span> 条公式
          </span>
          {matchResults && (
            <span className="text-muted-foreground">
              匹配成功 <span className="font-semibold text-emerald-600">{matchedCount}</span> / {totalCount}
            </span>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="formula" className="gap-1.5">
            <Code className="size-3.5" />
            公式文本
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-1.5">
            <Table2 className="size-3.5" />
            匹配预览
          </TabsTrigger>
          <TabsTrigger value="download" className="gap-1.5">
            <FileDown className="size-3.5" />
            下载文件
          </TabsTrigger>
        </TabsList>

        {/* Formula Tab */}
        <TabsContent value="formula" className="space-y-3">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyAll}
              className="gap-1.5"
            >
              {copiedIndex === 'all' ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  已复制全部
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  复制全部
                </>
              )}
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-slate-950 overflow-hidden max-h-96 overflow-y-auto">
            <div className="p-4 space-y-2 font-mono text-xs">
              {formulas.map((rowFormulas, i) => (
                <div key={i} className="space-y-0.5">
                  <span className="text-slate-500 text-[10px]">第 {i + 1} 行</span>
                  {rowFormulas.map((formula, j) => {
                    const copyKey = `${i}-${j}`;
                    return (
                      <div
                        key={j}
                        className="flex items-start gap-3 group hover:bg-white/5 rounded px-2 py-1 -mx-2 transition-colors"
                      >
                        {returnColumns.length > 1 && (
                          <span className="text-slate-600 w-16 text-right shrink-0 select-none text-[10px] pt-0.5">
                            {returnColumns[j]}:
                          </span>
                        )}
                        <code className="text-emerald-400 flex-1 break-all">{formula}</code>
                        <button
                          onClick={() => handleCopy(formula, copyKey)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-all shrink-0"
                          aria-label="复制公式"
                        >
                          {copiedIndex === copyKey ? (
                            <Check className="size-3 text-emerald-400" />
                          ) : (
                            <Copy className="size-3 text-slate-400" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-3">
          {matchResults && sourceSheet && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-xs">
                  <thead className="bg-muted/80 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground border-b border-r border-border w-10">
                        #
                      </th>
                      <th className="px-3 py-2 text-left font-medium text-foreground border-b border-r border-border whitespace-nowrap">
                        {lookupColumn}
                        <span className="text-xs text-muted-foreground ml-1">(查找值)</span>
                      </th>
                      {returnColumns.map((col) => (
                        <th
                          key={col}
                          className="px-3 py-2 text-left font-medium text-emerald-700 border-b border-r border-border whitespace-nowrap last:border-r-0"
                        >
                          {col}
                          <span className="text-xs text-emerald-600 ml-1">(匹配结果)</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matchResults.slice(0, 200).map((result, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                        <td className="px-3 py-1.5 text-muted-foreground border-r border-border font-mono">
                          {i + 1}
                        </td>
                        <td className="px-3 py-1.5 text-foreground border-r border-border whitespace-nowrap max-w-48 truncate">
                          {result.lookupValue !== null && result.lookupValue !== undefined
                            ? String(result.lookupValue)
                            : ''}
                        </td>
                        {result.returnValues.map((val, j) => (
                          <td
                            key={j}
                            className={`px-3 py-1.5 border-r border-border whitespace-nowrap max-w-48 truncate font-mono last:border-r-0 ${
                              result.matched
                                ? 'text-emerald-700 bg-emerald-50/50'
                                : 'text-red-600 bg-red-50/50'
                            }`}
                          >
                            {result.matched ? String(val) : '#N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {matchResults && matchResults.length > 200 && (
            <p className="text-xs text-muted-foreground text-center">
              仅展示前 200 条匹配结果，共 {matchResults.length} 条
            </p>
          )}
        </TabsContent>

        {/* Download Tab */}
        <TabsContent value="download" className="flex flex-col items-center justify-center py-8 gap-4">
          <Download className="size-12 text-muted-foreground" />
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">导出匹配结果到 Excel</p>
            <p className="text-xs text-muted-foreground">
              将在源文件数据基础上新增 {returnColumns.length} 列匹配结果
            </p>
          </div>
          <Button onClick={handleDownload} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Download className="size-4" />
            下载 Excel 文件
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
