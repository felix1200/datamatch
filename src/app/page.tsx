'use client';

import { useState, useMemo, useCallback } from 'react';
import { FileSpreadsheet, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import { DataPreview } from '@/components/data-preview';
import { VlookupConfigPanel, type VlookupConfig } from '@/components/vlookup-config';
import { OutputPanel } from '@/components/output-panel';
import { parseExcelFile, type ExcelFile } from '@/lib/excel-utils';
import { generateVlookupFormula } from '@/lib/vlookup-engine';

const DEFAULT_CONFIG: VlookupConfig = {
  sourceFileIndex: 0,
  lookupColumn: '',
  targetFileIndex: 1,
  lookupRangeStartCol: '',
  lookupRangeEndCol: '',
  returnColumn: '',
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

      // Auto-set default target file index if first file
      if (index === 0 && newFiles[1]) {
        setConfig((prev) => ({ ...prev, sourceFileIndex: 0, targetFileIndex: 1 }));
      } else if (index === 1 && newFiles[0]) {
        setConfig((prev) => ({ ...prev, sourceFileIndex: 0, targetFileIndex: 1 }));
      }
    } catch {
      setError(`文件解析失败: ${file.name}，请确认文件格式正确`);
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
  }, [files]);

  const uploadedFiles = files.filter((f): f is ExcelFile => f !== null);

  const sourceSheet = useMemo(() => {
    const file = files[config.sourceFileIndex];
    return file?.sheets.find((s) => s.name === file.activeSheet) ?? null;
  }, [files, config.sourceFileIndex]);

  const targetSheet = useMemo(() => {
    const file = files[config.targetFileIndex];
    return file?.sheets.find((s) => s.name === file.activeSheet) ?? null;
  }, [files, config.targetFileIndex]);

  const formulas = useMemo(() => {
    if (!sourceSheet || !targetSheet || !config.lookupColumn || !config.returnColumn || !config.lookupRangeStartCol || !config.lookupRangeEndCol) {
      return [];
    }
    return sourceSheet.rows.map((_, i) =>
      generateVlookupFormula(
        {
          lookupColumn: config.lookupColumn,
          lookupSheet: targetSheet,
          lookupRangeStartCol: config.lookupRangeStartCol,
          lookupRangeEndCol: config.lookupRangeEndCol,
          returnColumn: config.returnColumn,
          matchMode: config.matchMode,
        },
        i
      )
    );
  }, [sourceSheet, targetSheet, config]);

  const isConfigComplete =
    config.lookupColumn &&
    config.returnColumn &&
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
            <h1 className="text-lg font-bold text-foreground tracking-tight">VLOOKUP 公式助手</h1>
            <p className="text-xs text-muted-foreground">可视化配置，批量生成 Excel VLOOKUP 公式</p>
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
          <StepHeader step={1} title="上传 Excel 文件" desc="上传最多 2 份文件，作为查找值来源和查找范围" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUpload
              label="文件 1（源文件 - 查找值所在）"
              file={rawFiles[0]}
              onFileChange={(f) => handleFileChange(0, f)}
            />
            <FileUpload
              label="文件 2（目标文件 - 查找范围所在）"
              file={rawFiles[1]}
              onFileChange={(f) => handleFileChange(1, f)}
            />
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              正在解析文件...
            </div>
          )}
        </section>

        {/* Step 2: Preview */}
        {uploadedFiles.length > 0 && (
          <section className="space-y-4">
            <StepHeader step={2} title="数据预览" desc="确认数据内容，可切换工作表" />
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
            <StepHeader step={3} title="配置 VLOOKUP 参数" desc="通过下拉框选择查找值列、查找范围、返回列和匹配方式" />
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
            <StepHeader step={4} title="输出结果" desc="复制公式、预览匹配结果或下载 Excel 文件" />
            <div className="rounded-xl border border-border bg-card p-6">
              <OutputPanel
                formulas={formulas}
                sourceSheet={sourceSheet}
                targetSheet={targetSheet}
                config={config}
                lookupColumn={config.lookupColumn}
                returnColumn={config.returnColumn}
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
            <h2 className="text-lg font-semibold text-foreground mb-2">开始使用</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              上传 Excel 文件后，通过可视化界面配置 VLOOKUP 参数，
              即可批量生成公式、预览匹配结果或导出 Excel 文件
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-muted-foreground">
          VLOOKUP 公式助手 — 纯前端处理，文件数据不会上传至服务器
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
