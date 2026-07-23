'use client';

import { useState, useMemo, useCallback } from 'react';
import { FileSpreadsheet, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import { DataPreview } from '@/components/data-preview';
import { VlookupConfigPanel, type VlookupConfig } from '@/components/vlookup-config';
import { OutputPanel } from '@/components/output-panel';
import { parseExcelFile, type ExcelFile } from '@/lib/excel-utils';
import { generateVlookupFormulas } from '@/lib/vlookup-engine';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type FileMode = 'single' | 'dual';

const DEFAULT_CONFIG: VlookupConfig = {
  sourceFileIndex: 0,
  sourceSheetName: '',
  lookupColumn: '',
  targetFileIndex: 0,
  targetSheetName: '',
  lookupRangeStartCol: '',
  lookupRangeEndCol: '',
  returnColumns: [],
  matchMode: 'exact',
};

export default function Home() {
  const [fileMode, setFileMode] = useState<FileMode>('single');
  const [files, setFiles] = useState<(ExcelFile | null)[]>([null, null]);
  const [rawFiles, setRawFiles] = useState<(File | null)[]>([null, null]);
  const [config, setConfig] = useState<VlookupConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileModeChange = useCallback((mode: FileMode) => {
    setFileMode(mode);
    // Reset file 2 when switching to single mode
    if (mode === 'single') {
      setRawFiles((prev) => [prev[0], null]);
      setFiles((prev) => [prev[0], null]);
      setConfig((prev) => ({
        ...prev,
        sourceFileIndex: 0,
        targetFileIndex: 0,
        targetSheetName: '',
        lookupRangeStartCol: '',
        lookupRangeEndCol: '',
        returnColumns: [],
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        sourceFileIndex: 0,
        targetFileIndex: 1,
      }));
    }
  }, []);

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

      setConfig((prev) => {
        const updated = { ...prev };
        if (index === 0) {
          updated.sourceFileIndex = 0;
          updated.sourceSheetName = parsed.activeSheet;
          // In single mode, also set target to same file
          if (fileMode === 'single') {
            updated.targetFileIndex = 0;
          }
        } else {
          updated.targetFileIndex = 1;
          updated.targetSheetName = parsed.activeSheet;
        }
        return updated;
      });
    } catch {
      setError(`文件解析失败: ${file.name}，请确认文件格式正确`);
    } finally {
      setLoading(false);
    }
  }, [files, rawFiles, fileMode]);

  const handleSheetChange = useCallback((index: number, sheetName: string) => {
    const newFiles = [...files];
    if (newFiles[index]) {
      newFiles[index] = { ...newFiles[index]!, activeSheet: sheetName };
      setFiles(newFiles);
    }
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

  const sourceFileName = useMemo(() => {
    const file = files[config.sourceFileIndex];
    return file?.fileName ?? 'vlookup_result';
  }, [files, config.sourceFileIndex]);

  const sourceArrayBuffer = useMemo(() => {
    const file = files[config.sourceFileIndex];
    return file?.arrayBuffer ?? null;
  }, [files, config.sourceFileIndex]);

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
            <h1 className="text-lg font-bold text-foreground tracking-tight">VLOOKUP 公式助手</h1>
            <p className="text-xs text-muted-foreground">不用写公式，可视化操作就能批量匹配数据</p>
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
            title="上传 Excel 文件"
            desc={'上传你要处理的数据文件。选择「单文件」表示数据都在同一个 Excel 的不同工作表中；选择「双文件」表示数据分别在两个不同的文件中。'}
          />

          {/* File mode toggle */}
          <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <span className="text-sm text-muted-foreground shrink-0">文件模式：</span>
            <div className="flex items-center gap-2">
              <Label htmlFor="single-mode" className="text-sm cursor-pointer">
                单文件
              </Label>
              <Switch
                id="file-mode"
                checked={fileMode === 'dual'}
                onCheckedChange={(checked) => handleFileModeChange(checked ? 'dual' : 'single')}
              />
              <Label htmlFor="dual-mode" className="text-sm cursor-pointer">
                双文件
              </Label>
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              {fileMode === 'single'
                ? '所有数据在同一个 Excel 文件的不同工作表中'
                : '数据分别在两个不同的 Excel 文件中'}
            </span>
          </div>

          {fileMode === 'single' ? (
            <FileUpload
              label="上传 Excel 文件"
              file={rawFiles[0]}
              onFileChange={(f) => handleFileChange(0, f)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  上传包含你要处理的数据的文件。比如你有一份名单，想补充一些缺失的信息，就上传这份名单。
                </p>
                <FileUpload
                  label="文件 1 — 你的数据"
                  file={rawFiles[0]}
                  onFileChange={(f) => handleFileChange(0, f)}
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  上传包含对照信息的文件。就像一本字典，你拿着关键词去这里查对应的答案。
                </p>
                <FileUpload
                  label="文件 2 — 对照表"
                  file={rawFiles[1]}
                  onFileChange={(f) => handleFileChange(1, f)}
                />
              </div>
            </div>
          )}
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
            <StepHeader
              step={2}
              title="确认数据内容"
              desc="检查上传的文件数据是否正确，可以切换工作表查看不同页的数据"
            />
            <div className="grid grid-cols-1 gap-6">
              {files.map((file, index) =>
                file ? (
                  <DataPreview
                    key={`${file.id}-${index}`}
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
              title="配置匹配规则"
              desc="告诉系统：你的数据中哪一列是关键词，对照表中哪一列用来匹配，以及你想把哪些信息带回来"
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
                fileMode={fileMode}
              />
            </div>
          </section>
        )}

        {/* Step 4: Output */}
        {isConfigComplete && (
          <section className="space-y-4">
            <StepHeader
              step={4}
              title="获取结果"
              desc="下载带匹配结果的 Excel 文件（推荐）、预览匹配效果、或复制公式文本"
            />
            <div className="rounded-xl border border-border bg-card p-6">
              <OutputPanel
                formulas={formulas}
                sourceSheet={sourceSheet}
                sourceFileName={sourceFileName}
                sourceArrayBuffer={sourceArrayBuffer}
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
            <h2 className="text-lg font-semibold text-foreground mb-2">开始使用</h2>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
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
