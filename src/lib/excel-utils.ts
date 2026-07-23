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
          const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number | boolean | null>>(worksheet, {
            defval: null,
          });
          const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
          return { name, headers, rows: jsonData };
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
  fileName: string
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
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
