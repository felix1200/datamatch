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
  arrayBuffer: ArrayBuffer; // Store original file data for export
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
          arrayBuffer: data as ArrayBuffer,
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
  data: (string | number | boolean | null)[][],
  fileName: string
): void {
  // Use aoa_to_sheet (array of arrays) — most reliable way to preserve every column and row
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'VLOOKUP Result');
  XLSX.writeFile(workbook, fileName);
}

/**
 * Export with all original sheets preserved, only appending result columns to the source sheet.
 */
export function exportWithOriginalSheets(
  originalArrayBuffer: ArrayBuffer,
  sourceSheetName: string,
  resultColumns: { header: string; values: (string | number | boolean | null)[] }[],
  fileName: string
): void {
  // Clone the original workbook
  const workbook = XLSX.read(originalArrayBuffer, { type: 'array' });

  // Find the source sheet
  const worksheet = workbook.Sheets[sourceSheetName];
  if (!worksheet) {
    throw new Error(`Source sheet "${sourceSheetName}" not found`);
  }

  // Get current range
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  const startCol = range.e.c + 1; // Column after the last existing column

  // Append each result column
  resultColumns.forEach((col, colOffset) => {
    const colIdx = startCol + colOffset;
    // Add header
    const headerCell = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    worksheet[headerCell] = { t: 's', v: col.header };

    // Add values
    col.values.forEach((value, rowIdx) => {
      const cellRef = XLSX.utils.encode_cell({ r: rowIdx + 1, c: colIdx });
      if (value === null || value === undefined) {
        worksheet[cellRef] = { t: 's', v: '#N/A' };
      } else if (typeof value === 'number') {
        worksheet[cellRef] = { t: 'n', v: value };
      } else if (typeof value === 'boolean') {
        worksheet[cellRef] = { t: 'b', v: value };
      } else {
        worksheet[cellRef] = { t: 's', v: String(value) };
      }
    });
  });

  // Update the sheet range to include new columns
  range.e.c = startCol + resultColumns.length - 1;
  worksheet['!ref'] = XLSX.utils.encode_range(range);

  // Write the modified workbook
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
