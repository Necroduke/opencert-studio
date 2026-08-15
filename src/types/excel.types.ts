export type RowStatus = 'VALID' | 'WARNING' | 'ERROR';

export interface ExcelRow {
  _rowIndex: number;
  _status: RowStatus;
  _errors: string[];
  _selected: boolean;
  data: Record<string, string>;
}
