import type { SheetData } from './excel-utils';

export interface VlookupParams {
  lookupColumn: string;
  lookupSheet: SheetData;
  lookupRangeStartCol: string;
  lookupRangeEndCol: string;
  returnColumn: string;
  matchMode: 'exact' | 'fuzzy';
}

export function generateVlookupFormula(params: VlookupParams, rowIndex: number): string {
  const { lookupColumn, lookupSheet, lookupRangeStartCol, lookupRangeEndCol, returnColumn, matchMode } = params;

  const lookupHeaders = lookupSheet.headers;
  const lookupColIndex = lookupHeaders.indexOf(lookupColumn);
  const returnColIndex = lookupHeaders.indexOf(returnColumn);
  const rangeStartIndex = lookupHeaders.indexOf(lookupRangeStartCol);

  if (lookupColIndex === -1 || returnColIndex === -1 || rangeStartIndex === -1) {
    return '#ERROR: Invalid column selection';
  }

  const colIndexNum = returnColIndex - rangeStartIndex + 1;
  const rangeLookup = matchMode === 'fuzzy' ? 'TRUE' : 'FALSE';

  const startRow = 2;
  const endRow = lookupSheet.rows.length + 1;

  const startColLetter = getColLetter(rangeStartIndex);
  const endColLetter = getColLetter(lookupHeaders.indexOf(lookupRangeEndCol));

  const tableArray = `${startColLetter}${startRow}:${endColLetter}${endRow}`;
  const lookupCellRef = `${getColLetter(lookupColIndex)}${rowIndex + 1}`;

  return `=VLOOKUP(${lookupCellRef},${tableArray},${colIndexNum},${rangeLookup})`;
}

export function executeVlookup(
  sourceData: Record<string, string | number | boolean | null>[],
  lookupSheet: SheetData,
  lookupColumn: string,
  returnColumn: string,
  matchMode: 'exact' | 'fuzzy'
): { value: string | number | boolean | null; matched: boolean }[] {
  const lookupRows = lookupSheet.rows;
  const results: { value: string | number | boolean | null; matched: boolean }[] = [];

  for (const sourceRow of sourceData) {
    const lookupValue = sourceRow[lookupColumn];

    if (lookupValue === null || lookupValue === undefined) {
      results.push({ value: '#N/A', matched: false });
      continue;
    }

    const matchRow = lookupRows.find((row) => {
      const targetValue = row[lookupColumn];
      if (targetValue === null || targetValue === undefined) return false;

      if (matchMode === 'exact') {
        return String(targetValue).trim() === String(lookupValue).trim();
      } else {
        return String(targetValue).toLowerCase().includes(String(lookupValue).toLowerCase());
      }
    });

    if (matchRow) {
      results.push({ value: matchRow[returnColumn] ?? '#N/A', matched: true });
    } else {
      results.push({ value: '#N/A', matched: false });
    }
  }

  return results;
}

function getColLetter(index: number): string {
  let letter = '';
  let n = index;
  while (n >= 0) {
    letter = String.fromCharCode((n % 26) + 65) + letter;
    n = Math.floor(n / 26) - 1;
  }
  return letter;
}
