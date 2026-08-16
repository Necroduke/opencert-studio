import * as XLSX from "xlsx";
import type { ExcelRow } from "../types/excel.types";

export class ExcelParserService {
  //leemos y extraemos las cabeceras y las filas validas
  public async parseFile(
    file: File,
  ): Promise<{ headers: string[]; rows: ExcelRow[] }> {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    if (!workbook.SheetNames.length) {
      throw new Error("El archivo Excel está vacio.");
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const rawJson = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
      defval: "", //nos aseguramos que las celdas vacias no desplacen las columnas
    });

    if (!rawJson.length) {
      return { headers: [], rows: [] };
    }

    const headers = Object.keys(rawJson[0]);
    const processedRows: ExcelRow[] = [];
    let emptyRowCount = 0;

    for (let i = 0; i < rawJson.length; i++) {
      const row = rawJson[i];
      const isCompletelyEmpty = headers.every(
        (h) => !row[h] || String(row[h]).trim() === "",
      );

      if (isCompletelyEmpty) {
        emptyRowCount++;
        if (emptyRowCount >= 10) break; //si encontramos 10 filas vacias consecutivas, asumimos que el resto del archivo esta vacio y paramos el procesamiento
        continue;
      }

      emptyRowCount = 0; //reiniciamos el contador si encontramos una fila con datos

      const stringifiedData: Record<string, string> = {};
      headers.forEach((h) => {
        stringifiedData[h] = String(row[h]).trim();
      });

      processedRows.push({
        _rowIndex: i + 2, //indice inicia en 0, la cabecera ocupa la fila 1, primer dato = 2
        _status: "VALID", //el estado se evaluara posteriormente segun el mapeo
        _errors: [],
        _selected: true,
        data: stringifiedData,
      });
    }

    return { headers, rows: processedRows };
  }

  //evaluamos cada fila comparando con los campos obligatorios mapeados
  public evaluateRowStatus(row: ExcelRow, mappedColumns: string[]): ExcelRow {
    const errors: string[] = [];
    let hasEmptyMappedValue = false;

    for (const col of mappedColumns) {
      if (!row.data[col] || row.data[col] === "") {
        hasEmptyMappedValue = true;
        errors.push(`Columna faltante: ${col}`);
      }
    }

    if (hasEmptyMappedValue) {
      row._status = "WARNING"; //si le faltan campos la marcamos con wwarning
      row._errors = errors;
      row._selected = false; //se desmarca por defecto si hay warning
    } else {
      row._status = "VALID";
      row._errors = [];
      row._selected = true;
    }

    return row;
  }
}

export const excelParser = new ExcelParserService();
