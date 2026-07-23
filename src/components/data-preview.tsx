'use client';

import { useMemo } from 'react';
import type { SheetData } from '@/lib/excel-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataPreviewProps {
  data: SheetData | null;
  sheetName: string;
  sheets: { name: string }[];
  onSheetChange: (sheetName: string) => void;
  label: string;
  colorClass?: string;
}

const MAX_PREVIEW_ROWS = 50;

export function DataPreview({ data, sheetName, sheets, onSheetChange, label, colorClass = 'text-emerald-600' }: DataPreviewProps) {
  const displayRows = useMemo(() => {
    if (!data) return [];
    return data.rows.slice(0, MAX_PREVIEW_ROWS);
  }, [data]);

  if (!data) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">请先上传文件以预览数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${colorClass}`}>{label}</span>
          <span className="text-xs text-muted-foreground">
            {data.rows.length} 行 x {data.headers.length} 列
          </span>
        </div>
        {sheets.length > 1 && (
          <Select value={sheetName} onValueChange={onSheetChange}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="选择工作表" />
            </SelectTrigger>
            <SelectContent>
              {sheets.map((s) => (
                <SelectItem key={s.name} value={s.name}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-xs">
            <thead className="bg-muted/80 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground border-b border-r border-border w-10">
                  #
                </th>
                {data.headers.map((header) => (
                  <th
                    key={header}
                    className="px-3 py-2 text-left font-medium text-foreground border-b border-r border-border whitespace-nowrap last:border-r-0"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/20'}>
                  <td className="px-3 py-1.5 text-muted-foreground border-r border-border font-mono">
                    {i + 1}
                  </td>
                  {data.headers.map((header) => (
                    <td
                      key={header}
                      className="px-3 py-1.5 text-foreground border-r border-border whitespace-nowrap max-w-48 truncate last:border-r-0"
                    >
                      {row[header] !== null && row[header] !== undefined ? String(row[header]) : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {data.rows.length > MAX_PREVIEW_ROWS && (
        <p className="text-xs text-muted-foreground text-center">
          仅展示前 {MAX_PREVIEW_ROWS} 行，共 {data.rows.length} 行
        </p>
      )}
    </div>
  );
}
