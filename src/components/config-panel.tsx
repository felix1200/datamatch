'use client';

import { type ExcelFile, type SheetData } from '@/lib/excel-utils';
import { type VlookupConfig } from '@/lib/vlookup-engine';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ConfigPanelProps {
  files: ExcelFile[];
  isSingleFile: boolean;
  config: VlookupConfig;
  sourceSheet: SheetData | undefined;
  targetSheet: SheetData | undefined;
  onChange: (partial: Partial<VlookupConfig>) => void;
  onSheetChange: (type: 'source' | 'target', sheetName: string) => void;
}

export function ConfigPanel({
  files,
  isSingleFile,
  config,
  sourceSheet,
  targetSheet,
  onChange,
  onSheetChange,
}: ConfigPanelProps) {
  const sourceFile = files[config.sourceFileIndex];
  const targetFile = files[isSingleFile ? config.sourceFileIndex : config.targetFileIndex];
  const sameSheet = isSingleFile && config.sourceSheetName === config.targetSheetName;

  const getAvailableCols = (sheet: SheetData | undefined, excludeCols: string[] = []) =>
    sheet?.headers.filter((h) => !excludeCols.includes(h)) || [];

  const returnableCols = getAvailableCols(targetSheet, [config.lookupRangeStartCol]);

  const toggleReturnCol = (col: string) => {
    const current = config.returnColumns;
    if (current.includes(col)) {
      onChange({ returnColumns: current.filter((c) => c !== col) });
    } else {
      onChange({ returnColumns: [...current, col] });
    }
  };

  return (
    <div className="space-y-4">
      {/* Source section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
          Your data sheet
        </h3>
        <p className="text-xs text-gray-500 ml-6">The sheet where you want the results to appear</p>
        <div className="ml-6 flex gap-2">
          {!isSingleFile && files.length > 1 && (
            <Select value={String(config.sourceFileIndex)} onValueChange={(v) => onChange({ sourceFileIndex: Number(v) })}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="File" />
              </SelectTrigger>
              <SelectContent>
                {files.map((f, i) => (
                  <SelectItem key={i} value={String(i)}>{f.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {sourceFile && (
            <Select value={config.sourceSheetName || '_'} onValueChange={(v) => onSheetChange('source', v === '_' ? '' : v)}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="Sheet" />
              </SelectTrigger>
              <SelectContent>
                {sourceFile.sheets.map((s) => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {sourceSheet && (
          <div className="ml-6">
            <Label className="text-xs text-gray-600 mb-1 block">Column to look up</Label>
            <Select value={config.lookupValueCol || '_'} onValueChange={(v) => onChange({ lookupValueCol: v === '_' ? '' : v })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Pick a column..." />
              </SelectTrigger>
              <SelectContent>
                {sourceSheet.headers.map((h) => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Target section */}
      <div className="space-y-2 pt-2 border-t">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">2</span>
          Reference sheet
        </h3>
        <p className="text-xs text-gray-500 ml-6">The sheet that has the information you want to bring back</p>

        {isSingleFile && files.length > 0 && files[0].sheets.length > 1 && (
          <div className="ml-6">
            <Label className="text-xs text-gray-600 mb-1 block">Sheet</Label>
            <Select value={config.targetSheetName || '_'} onValueChange={(v) => onSheetChange('target', v === '_' ? '' : v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Pick a sheet..." />
              </SelectTrigger>
              <SelectContent>
                {files[0].sheets.map((s) => (
                  <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!isSingleFile && files.length > 1 && (
          <div className="ml-6 flex gap-2">
            <Select value={String(config.targetFileIndex)} onValueChange={(v) => onChange({ targetFileIndex: Number(v) })}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="File" />
              </SelectTrigger>
              <SelectContent>
                {files.filter((_, i) => i !== config.sourceFileIndex).map((f, i) => {
                  const realIdx = files.indexOf(f);
                  return <SelectItem key={realIdx} value={String(realIdx)}>{f.name}</SelectItem>;
                })}
              </SelectContent>
            </Select>
            {targetFile && (
              <Select value={config.targetSheetName || '_'} onValueChange={(v) => onSheetChange('target', v === '_' ? '' : v)}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue placeholder="Sheet" />
                </SelectTrigger>
                <SelectContent>
                  {targetFile.sheets.map((s) => (
                    <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {sameSheet && (
          <Alert variant="warning" className="ml-6 py-1.5 px-3">
            <AlertTriangle className="h-3 w-3" />
            <AlertDescription className="text-xs ml-1">Source and reference are the same sheet. Pick different sheets for accurate results.</AlertDescription>
          </Alert>
        )}

        {targetSheet && (
          <div className="ml-6 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="text-xs text-gray-600 mb-1 block">Match column</Label>
                <Select value={config.lookupRangeStartCol || '_'} onValueChange={(v) => onChange({ lookupRangeStartCol: v === '_' ? '' : v, lookupRangeEndCol: '', returnColumns: [] })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Column to match against" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetSheet.headers.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-xs text-gray-600 mb-1 block">Through column</Label>
                <Select value={config.lookupRangeEndCol || '_'} onValueChange={(v) => onChange({ lookupRangeEndCol: v === '_' ? '' : v, returnColumns: [] })}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="End of range" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetSheet.headers.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-1.5 block">Columns to bring back</Label>
              <div className="flex flex-wrap gap-1.5">
                {returnableCols.map((col) => {
                  const checked = config.returnColumns.includes(col);
                  return (
                    <label
                      key={col}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer transition-colors border ${
                        checked ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggleReturnCol(col)} className="h-3 w-3" />
                      {col}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Match mode */}
      <div className="pt-2 border-t">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-2">
          <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs flex items-center justify-center font-bold">3</span>
          Match type
        </h3>
        <RadioGroup
          value={config.matchMode}
          onValueChange={(v) => onChange({ matchMode: v as 'exact' | 'fuzzy' })}
          className="ml-6 flex gap-4"
        >
          <label className="flex items-center gap-1.5 cursor-pointer">
            <RadioGroupItem value="exact" className="h-3.5 w-3.5" />
            <span className="text-xs text-gray-700">Exact match</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <RadioGroupItem value="fuzzy" className="h-3.5 w-3.5" />
            <span className="text-xs text-gray-700">Approximate match</span>
          </label>
        </RadioGroup>
      </div>
    </div>
  );
}
