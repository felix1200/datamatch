import type { SheetData } from './excel-utils';
import { getColumnLetter } from './excel-utils';

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
  const startColLetter = getColumnLetter(rangeStartIndex);
  const endColLetter = getColumnLetter(rangeEndIndex);
  const tableArray = `${startColLetter}${startRow}:${endColLetter}${endRow}`;
  const lookupCellRef = `${getColumnLetter(lookupColIndex)}${rowIndex + 1}`;

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

// Aliases for convenience
export type VlookupResult = MatchResultRow;

// Extended config used by the UI (includes file/sheet selection info)
export interface VlookupConfig {
  sourceFileIndex: number;
  sourceSheetName: string;
  lookupValueCol: string;
  targetFileIndex: number;
  targetSheetName: string;
  lookupRangeStartCol: string;
  lookupRangeEndCol: string;
  returnColumns: string[];
  matchMode: 'exact' | 'fuzzy';
}

export function generateFormulas(
  sourceSheet: SheetData,
  targetSheet: SheetData,
  config: VlookupConfig
): string[] {
  const params: VlookupParams = {
    lookupColumn: config.lookupValueCol,
    lookupSheet: targetSheet,
    lookupRangeStartCol: config.lookupRangeStartCol,
    lookupRangeEndCol: config.lookupRangeEndCol,
    returnColumns: config.returnColumns,
    matchMode: config.matchMode,
  };
  const formulas: string[] = [];
  sourceSheet.rows.forEach((_, i) => {
    formulas.push(...generateVlookupFormulas(params, i));
  });
  return formulas;
}

export function executeLookup(
  sourceSheet: SheetData,
  targetSheet: SheetData,
  config: VlookupConfig
): MatchResultRow[] {
  return executeVlookup(
    sourceSheet.rows,
    targetSheet,
    config.lookupValueCol,
    config.returnColumns,
    config.matchMode
  );
}
