import * as XLSX from 'xlsx';

export interface SheetData {
  name: string;
  headers: string[];
  rows: Record<string, string | number | boolean | null>[];
}

export interface ExcelFile {
  id: string;
  fileName: string;
  sheets: SheetData[];
  activeSheet: string;
}

export function parseExcelFile(file: File): Promise<ExcelFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheets: SheetData[] = workbook.SheetNames.map((name) => {
          const worksheet = workbook.Sheets[name];
          // Use header:1 to get raw 2D array — preserves ALL columns including empty ones
          const rawRows = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(worksheet, {
            header: 1,
            defval: null,
            blankrows: false,
          });

          if (rawRows.length === 0) {
            return { name, headers: [], rows: [] };
          }

          // First row = headers; ensure all are strings and handle duplicates
          const rawHeaders = rawRows[0].map((h) => (h == null ? '' : String(h)));
          // Deduplicate header names (e.g. two columns both named "ID")
          const seen = new Map<string, number>();
          const headers = rawHeaders.map((h) => {
            const displayName = h || '(空列名)';
            const count = seen.get(displayName) ?? 0;
            seen.set(displayName, count + 1);
            return count > 0 ? `${displayName}_${count + 1}` : displayName;
          });

          // Build row objects using the full header list — guarantees every column is kept
          const dataRows = rawRows.slice(1).map((rawRow) => {
            const row: Record<string, string | number | boolean | null> = {};
            headers.forEach((header, colIdx) => {
              row[header] = colIdx < rawRow.length ? (rawRow[colIdx] ?? null) : null;
            });
            return row;
          });

          return { name, headers, rows: dataRows };
        });
        resolve({
          id: crypto.randomUUID(),
          fileName: file.name,
          sheets,
          activeSheet: workbook.SheetNames[0] || '',
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsArrayBuffer(file);
  });
}

export function generateExcelFile(
  data: Record<string, string | number | boolean | null>[],
  fileName: string,
  headers?: string[]
): void {
  // Explicitly pass headers to ensure ALL columns are included in order
  const worksheet = headers
    ? XLSX.utils.json_to_sheet(data, { header: headers })
    : XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'VLOOKUP Result');
  XLSX.writeFile(workbook, fileName);
}

export function getColumnLetter(index: number): string {
  let letter = '';
  let n = index;
  while (n >= 0) {
    letter = String.fromCharCode((n % 26) + 65) + letter;
    n = Math.floor(n / 26) - 1;
  }
  return letter;
}
