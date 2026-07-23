import type { SheetData } from './excel-utils';

export interface VlookupParams {
  lookupColumn: string;
  lookupSheet: SheetData;
  lookupRangeStartCol: string;
  lookupRangeEndCol: string;
  returnColumns: string[];
  matchMode: 'exact' | 'fuzzy';
}

export function generateVlookupFormulas(
  params: VlookupParams,
  rowIndex: number
): string[] {
  const { lookupColumn, lookupSheet, lookupRangeStartCol, lookupRangeEndCol, returnColumns, matchMode } = params;

  const lookupHeaders = lookupSheet.headers;
  const lookupColIndex = lookupHeaders.indexOf(lookupColumn);
  const rangeStartIndex = lookupHeaders.indexOf(lookupRangeStartCol);
  const rangeEndIndex = lookupHeaders.indexOf(lookupRangeEndCol);

  if (lookupColIndex === -1 || rangeStartIndex === -1 || rangeEndIndex === -1) {
    return returnColumns.map(() => '#ERROR: Invalid column selection');
  }

  const rangeLookup = matchMode === 'fuzzy' ? 'TRUE' : 'FALSE';
  const startRow = 2;
  const endRow = lookupSheet.rows.length + 1;
  const startColLetter = getColLetter(rangeStartIndex);
  const endColLetter = getColLetter(rangeEndIndex);
  const tableArray = `${startColLetter}${startRow}:${endColLetter}${endRow}`;
  const lookupCellRef = `${getColLetter(lookupColIndex)}${rowIndex + 1}`;

  return returnColumns.map((returnCol) => {
    const returnColIndex = lookupHeaders.indexOf(returnCol);
    if (returnColIndex === -1) return '#ERROR: Invalid return column';
    const colIndexNum = returnColIndex - rangeStartIndex + 1;
    return `=VLOOKUP(${lookupCellRef},${tableArray},${colIndexNum},${rangeLookup})`;
  });
}

export interface MatchResultRow {
  lookupValue: string | number | boolean | null;
  returnValues: (string | number | boolean | null)[];
  matched: boolean;
}

export function executeVlookup(
  sourceData: Record<string, string | number | boolean | null>[],
  lookupSheet: SheetData,
  lookupColumn: string,
  returnColumns: string[],
  matchMode: 'exact' | 'fuzzy'
): MatchResultRow[] {
  const lookupRows = lookupSheet.rows;
  const results: MatchResultRow[] = [];

  for (const sourceRow of sourceData) {
    const lookupValue = sourceRow[lookupColumn];

    if (lookupValue === null || lookupValue === undefined) {
      results.push({
        lookupValue,
        returnValues: returnColumns.map(() => '#N/A'),
        matched: false,
      });
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
      results.push({
        lookupValue,
        returnValues: returnColumns.map((col) => matchRow[col] ?? '#N/A'),
        matched: true,
      });
    } else {
      results.push({
        lookupValue,
        returnValues: returnColumns.map(() => '#N/A'),
        matched: false,
      });
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
