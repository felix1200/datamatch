'use client';

import { type SheetData } from '@/lib/excel-utils';

interface CompactPreviewProps {
  sheet: SheetData;
  title: string;
  highlightCol?: string;
  highlightLabel?: string;
  maxRows?: number;
}

export function CompactPreview({ sheet, title, highlightCol, highlightLabel, maxRows = 8 }: CompactPreviewProps) {
  const displayRows = sheet.rows.slice(0, maxRows);
  const hasMore = sheet.rows.length > maxRows;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2 border-b flex items-center justify-between shrink-0 bg-gray-50/50">
        <span className="text-sm font-medium text-gray-700 truncate">{title}</span>
        <span className="text-xs text-gray-400 shrink-0 ml-2">{sheet.rows.length} rows</span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-100 border-b">
              <th className="px-2 py-1.5 text-left font-medium text-gray-500 w-8">#</th>
              {sheet.headers.map((h) => (
                <th
                  key={h}
                  className={`px-2 py-1.5 text-left font-medium whitespace-nowrap ${
                    h === highlightCol ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600'
                  }`}
                >
                  <span>{h}</span>
                  {h === highlightCol && highlightLabel && (
                    <span className="ml-1 text-[10px] text-emerald-500 font-normal">{highlightLabel}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="px-2 py-1 text-gray-400">{i + 1}</td>
                {sheet.headers.map((h) => (
                  <td
                    key={h}
                    className={`px-2 py-1 whitespace-nowrap max-w-[150px] truncate ${
                      h === highlightCol ? 'bg-emerald-50/40 font-medium text-emerald-800' : 'text-gray-700'
                    }`}
                  >
                    {row[h] != null ? String(row[h]) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && (
          <div className="py-2 text-center text-xs text-gray-400">
            +{sheet.rows.length - maxRows} more rows
          </div>
        )}
      </div>
    </div>
  );
}
