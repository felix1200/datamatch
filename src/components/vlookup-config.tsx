'use client';

import type { SheetData } from '@/lib/excel-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings2, AlertCircle, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface VlookupConfig {
  sourceFileIndex: number;
  sourceSheetName: string;
  lookupColumn: string;
  targetFileIndex: number;
  targetSheetName: string;
  lookupRangeStartCol: string;
  lookupRangeEndCol: string;
  returnColumns: string[];
  matchMode: 'exact' | 'fuzzy';
}

interface VlookupConfigPanelProps {
  files: { fileName: string; sheets: SheetData[]; activeSheet: string }[];
  config: VlookupConfig;
  onConfigChange: (config: VlookupConfig) => void;
  fileMode: 'single' | 'dual';
}

export function VlookupConfigPanel({ files, config, onConfigChange, fileMode }: VlookupConfigPanelProps) {
  const sourceFile = files[config.sourceFileIndex];
  const targetFile = files[config.targetFileIndex];
  const sourceSheet = sourceFile?.sheets.find((s) => s.name === config.sourceSheetName);
  const targetSheet = targetFile?.sheets.find((s) => s.name === config.targetSheetName);

  const update = (partial: Partial<VlookupConfig>) => {
    onConfigChange({ ...config, ...partial });
  };

  const isSameSheet =
    config.sourceFileIndex === config.targetFileIndex &&
    config.sourceSheetName === config.targetSheetName;

  const toggleReturnColumn = (col: string) => {
    if (config.returnColumns.includes(col)) {
      update({ returnColumns: config.returnColumns.filter((c) => c !== col) });
    } else {
      update({ returnColumns: [...config.returnColumns, col] });
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings2 className="size-5 text-emerald-600" />
          <h3 className="text-base font-semibold text-foreground">配置匹配规则</h3>
        </div>

        {/* Source section */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="size-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">你的数据表</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                选择包含你要处理的数据的文件和工作表。比如你有一份员工名单，想补充每个人的部门信息，这里就选员工名单。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-9">
            {fileMode === 'dual' && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">选择文件</Label>
                <Select
                  value={String(config.sourceFileIndex)}
                  onValueChange={(v) => {
                    const idx = Number(v);
                    const file = files[idx];
                    update({
                      sourceFileIndex: idx,
                      sourceSheetName: file?.activeSheet ?? '',
                      lookupColumn: '',
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择文件" />
                  </SelectTrigger>
                  <SelectContent>
                    {files.map((f, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {f.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">选择工作表</Label>
              <Select
                value={config.sourceSheetName}
                onValueChange={(v) => update({ sourceSheetName: v, lookupColumn: '' })}
                disabled={!sourceFile}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={sourceFile ? '选择工作表' : '请先选择文件'} />
                </SelectTrigger>
                <SelectContent>
                  {sourceFile?.sheets.map((s) => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">查找值列</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                    <p>选择你要根据哪一列去查找信息。例如要根据"员工ID"查找部门，就选"员工ID"列。</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={config.lookupColumn}
                onValueChange={(v) => update({ lookupColumn: v })}
                disabled={!sourceSheet}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={sourceSheet ? '选择列' : '请先选择工作表'} />
                </SelectTrigger>
                <SelectContent>
                  {sourceSheet?.headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Target section */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/30 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="size-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
            <div>
              <h4 className="text-sm font-semibold text-foreground">对照表（信息字典）</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                选择包含你要查找的信息的文件和工作表。就像一本字典——你拿着上面的关键词去这里查对应的答案。比如你想查每个人的部门，这里就选包含"员工ID → 部门"对照关系的表。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-9">
            {fileMode === 'dual' && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">选择文件</Label>
                <Select
                  value={String(config.targetFileIndex)}
                  onValueChange={(v) => {
                    const idx = Number(v);
                    const file = files[idx];
                    update({
                      targetFileIndex: idx,
                      targetSheetName: file?.activeSheet ?? '',
                      lookupRangeStartCol: '',
                      lookupRangeEndCol: '',
                      returnColumns: [],
                    });
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择文件" />
                  </SelectTrigger>
                  <SelectContent>
                    {files.map((f, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {f.fileName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">选择工作表</Label>
              <Select
                value={config.targetSheetName}
                onValueChange={(v) =>
                  update({
                    targetSheetName: v,
                    lookupRangeStartCol: '',
                    lookupRangeEndCol: '',
                    returnColumns: [],
                  })
                }
                disabled={!targetFile}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={targetFile ? '选择工作表' : '请先选择文件'} />
                </SelectTrigger>
                <SelectContent>
                  {targetFile?.sheets.map((s) => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">匹配列</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                    <p>选择对照表中与"查找值列"对应的那一列。例如上面选了"员工ID"，这里也要选"员工ID"——系统会用这一列去匹配。</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={config.lookupRangeStartCol}
                onValueChange={(v) => update({ lookupRangeStartCol: v })}
                disabled={!targetSheet}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={targetSheet ? '选择列' : '请先选择工作表'} />
                </SelectTrigger>
                <SelectContent>
                  {targetSheet?.headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Range end column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-9">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">查找范围结束列</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                    <p>选择对照表中查找范围的最后一列。匹配列到结束列之间的所有列都会被纳入查找范围。通常保持默认即可。</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={config.lookupRangeEndCol}
                onValueChange={(v) => {
                  const endIdx = targetSheet?.headers.indexOf(v) ?? -1;
                  const filtered = config.returnColumns.filter((c) => {
                    const colIdx = targetSheet?.headers.indexOf(c) ?? -1;
                    return colIdx >= 0 && colIdx <= endIdx;
                  });
                  update({ lookupRangeEndCol: v, returnColumns: filtered });
                }}
                disabled={!targetSheet}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={targetSheet ? '选择列' : '请先选择工作表'} />
                </SelectTrigger>
                <SelectContent>
                  {targetSheet?.headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Return columns - multi-select with checkboxes */}
          {targetSheet && config.lookupRangeEndCol && (
            <div className="space-y-3 pl-9">
              <div className="flex items-center gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  选择要返回的列（匹配成功后，把哪些列的数据带回来）
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                    <p>勾选你需要的列。例如你想查"部门"和"薪资"，就同时勾选这两列。结果会作为新列添加到你的数据表中。</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                {targetSheet.headers
                  .filter((h) => {
                    const startIdx = targetSheet.headers.indexOf(config.lookupRangeStartCol);
                    const endIdx = targetSheet.headers.indexOf(config.lookupRangeEndCol);
                    const colIdx = targetSheet.headers.indexOf(h);
                    return colIdx >= startIdx && colIdx <= endIdx;
                  })
                  .map((h) => (
                    <label
                      key={h}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition-colors ${
                        config.returnColumns.includes(h)
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-border hover:border-emerald-300 hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        checked={config.returnColumns.includes(h)}
                        onCheckedChange={() => toggleReturnColumn(h)}
                        className="pointer-events-none"
                      />
                      {h}
                    </label>
                  ))}
              </div>
              {config.returnColumns.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  请至少勾选一列，匹配后这些数据会被添加到你的表格中
                </p>
              )}
            </div>
          )}
        </div>

        {/* Same sheet warning */}
        {isSameSheet && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p>
              你的数据表和对照表选择了同一个工作表。VLOOKUP 通常需要在不同的工作表或文件之间进行匹配。
              如果确实需要在同一工作表内操作，请确保查找值列和匹配列不在同一列。
            </p>
          </div>
        )}

        {/* Match mode */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium text-foreground">匹配方式</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="size-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                <p><strong>精确匹配：</strong>查找值必须完全一致才能匹配成功（最常用）。</p>
                <p className="mt-1"><strong>模糊匹配：</strong>查找最接近的值（适用于区间匹配，如成绩等级）。</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex gap-3">
            <label
              className={`flex-1 flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                config.matchMode === 'exact'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-border hover:border-emerald-300'
              }`}
            >
              <input
                type="radio"
                name="matchMode"
                value="exact"
                checked={config.matchMode === 'exact'}
                onChange={() => update({ matchMode: 'exact' })}
                className="sr-only"
              />
              <div
                className={`size-4 rounded-full border-2 flex items-center justify-center ${
                  config.matchMode === 'exact' ? 'border-emerald-600' : 'border-muted-foreground/40'
                }`}
              >
                {config.matchMode === 'exact' && (
                  <div className="size-2 rounded-full bg-emerald-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">精确匹配</p>
                <p className="text-xs text-muted-foreground">查找值必须完全一致（推荐）</p>
              </div>
            </label>
            <label
              className={`flex-1 flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                config.matchMode === 'fuzzy'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-border hover:border-emerald-300'
              }`}
            >
              <input
                type="radio"
                name="matchMode"
                value="fuzzy"
                checked={config.matchMode === 'fuzzy'}
                onChange={() => update({ matchMode: 'fuzzy' })}
                className="sr-only"
              />
              <div
                className={`size-4 rounded-full border-2 flex items-center justify-center ${
                  config.matchMode === 'fuzzy' ? 'border-emerald-600' : 'border-muted-foreground/40'
                }`}
              >
                {config.matchMode === 'fuzzy' && (
                  <div className="size-2 rounded-full bg-emerald-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">模糊匹配</p>
                <p className="text-xs text-muted-foreground">查找最接近的值</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
