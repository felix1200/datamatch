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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Settings2 } from 'lucide-react';

export interface VlookupConfig {
  sourceFileIndex: number;
  lookupColumn: string;
  targetFileIndex: number;
  lookupRangeStartCol: string;
  lookupRangeEndCol: string;
  returnColumn: string;
  matchMode: 'exact' | 'fuzzy';
}

interface VlookupConfigPanelProps {
  files: { fileName: string; sheets: SheetData[]; activeSheet: string }[];
  config: VlookupConfig;
  onConfigChange: (config: VlookupConfig) => void;
}

export function VlookupConfigPanel({ files, config, onConfigChange }: VlookupConfigPanelProps) {
  const sourceFile = files[config.sourceFileIndex];
  const targetFile = files[config.targetFileIndex];
  const sourceSheet = sourceFile?.sheets.find((s) => s.name === sourceFile.activeSheet);
  const targetSheet = targetFile?.sheets.find((s) => s.name === targetFile.activeSheet);

  const update = (partial: Partial<VlookupConfig>) => {
    onConfigChange({ ...config, ...partial });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="size-5 text-emerald-600" />
        <h3 className="text-base font-semibold text-foreground">VLOOKUP 参数配置</h3>
      </div>

      {/* Source file selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">查找值所在文件（源文件）</Label>
          <Select value={String(config.sourceFileIndex)} onValueChange={(v) => update({ sourceFileIndex: Number(v), lookupColumn: '' })}>
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

        <div className="space-y-2">
          <Label className="text-sm">查找值列（源文件中要查找的列）</Label>
          <Select value={config.lookupColumn} onValueChange={(v) => update({ lookupColumn: v })} disabled={!sourceSheet}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={sourceSheet ? '选择列' : '请先选择源文件'} />
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

      {/* Target file selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">查找范围所在文件（目标文件）</Label>
          <Select value={String(config.targetFileIndex)} onValueChange={(v) => update({ targetFileIndex: Number(v), lookupRangeStartCol: '', lookupRangeEndCol: '', returnColumn: '' })}>
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

        <div className="space-y-2">
          <Label className="text-sm">返回列（匹配后返回的列）</Label>
          <Select value={config.returnColumn} onValueChange={(v) => update({ returnColumn: v })} disabled={!targetSheet}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={targetSheet ? '选择列' : '请先选择目标文件'} />
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

      {/* Lookup range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm">查找范围起始列</Label>
          <Select value={config.lookupRangeStartCol} onValueChange={(v) => update({ lookupRangeStartCol: v })} disabled={!targetSheet}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={targetSheet ? '选择起始列' : '请先选择目标文件'} />
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

        <div className="space-y-2">
          <Label className="text-sm">查找范围结束列</Label>
          <Select value={config.lookupRangeEndCol} onValueChange={(v) => update({ lookupRangeEndCol: v })} disabled={!targetSheet}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={targetSheet ? '选择结束列' : '请先选择目标文件'} />
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

      {/* Match mode */}
      <div className="space-y-3">
        <Label className="text-sm">匹配方式</Label>
        <RadioGroup
          value={config.matchMode}
          onValueChange={(v) => update({ matchMode: v as 'exact' | 'fuzzy' })}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="exact" id="exact" />
            <Label htmlFor="exact" className="font-normal cursor-pointer">
              精确匹配 <span className="text-xs text-muted-foreground">(FALSE)</span>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="fuzzy" id="fuzzy" />
            <Label htmlFor="fuzzy" className="font-normal cursor-pointer">
              模糊匹配 <span className="text-xs text-muted-foreground">(TRUE)</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
