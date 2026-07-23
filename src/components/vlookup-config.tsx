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
import { Checkbox } from '@/components/ui/checkbox';
import { Settings2, AlertCircle } from 'lucide-react';

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
}

export function VlookupConfigPanel({ files, config, onConfigChange }: VlookupConfigPanelProps) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="size-5 text-emerald-600" />
        <h3 className="text-base font-semibold text-foreground">VLOOKUP Configuration</h3>
      </div>

      {/* Source section */}
      <div className="rounded-lg border border-border p-4 space-y-4 bg-slate-50/50">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <span className="size-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">S</span>
          Source Data — Where your lookup values are
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">File</Label>
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
                <SelectValue placeholder="Select file" />
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
            <Label className="text-xs text-muted-foreground">Sheet</Label>
            <Select
              value={config.sourceSheetName}
              onValueChange={(v) => update({ sourceSheetName: v, lookupColumn: '' })}
              disabled={!sourceFile}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={sourceFile ? 'Select sheet' : 'Select file first'} />
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
            <Label className="text-xs text-muted-foreground">Lookup Column — The column with values to search for</Label>
            <Select
              value={config.lookupColumn}
              onValueChange={(v) => update({ lookupColumn: v })}
              disabled={!sourceSheet}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={sourceSheet ? 'Select column' : 'Select sheet first'} />
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
      <div className="rounded-lg border border-border p-4 space-y-4 bg-blue-50/30">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <span className="size-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">T</span>
          Lookup Table — Where to find matches and return values from
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">File</Label>
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
                <SelectValue placeholder="Select file" />
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
            <Label className="text-xs text-muted-foreground">Sheet</Label>
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
                <SelectValue placeholder={targetFile ? 'Select sheet' : 'Select file first'} />
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
            <Label className="text-xs text-muted-foreground">Match Column — The column in the lookup table to match against</Label>
            <Select
              value={config.lookupRangeStartCol}
              onValueChange={(v) => update({ lookupRangeStartCol: v })}
              disabled={!targetSheet}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={targetSheet ? 'Select column' : 'Select sheet first'} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Table Range End Column — Last column of the lookup table range</Label>
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
                <SelectValue placeholder={targetSheet ? 'Select column' : 'Select sheet first'} />
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
          <div className="space-y-3">
            <Label className="text-xs text-muted-foreground">
              Return Columns — Select one or more columns to return after a match is found
            </Label>
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
                Select at least one column to return
              </p>
            )}
          </div>
        )}
      </div>

      {/* Same sheet warning */}
      {isSameSheet && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <strong>Note:</strong> Your source and lookup table are from the same sheet.
            For best results, use different sheets or files to keep your data organized.
          </div>
        </div>
      )}

      {/* Match mode */}
      <div className="space-y-3">
        <Label className="text-sm">Match Mode</Label>
        <RadioGroup
          value={config.matchMode}
          onValueChange={(v) => update({ matchMode: v as 'exact' | 'fuzzy' })}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="exact" id="exact" />
            <Label htmlFor="exact" className="font-normal cursor-pointer">
              Exact Match <span className="text-xs text-muted-foreground">(FALSE) — Values must be identical</span>
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="fuzzy" id="fuzzy" />
            <Label htmlFor="fuzzy" className="font-normal cursor-pointer">
              Approximate Match <span className="text-xs text-muted-foreground">(TRUE) — Closest match</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
