import { defineStore } from "pinia";
import { ref } from "vue";
import type { ExcelRow } from "../types/excel.types";

export const useExcelStore = defineStore("excel", () => {
  const rows = ref<ExcelRow[]>([]);
  const headers = ref<string[]>([]);
  const fieldMapping = ref<Record<string, string>>({}); // elMapeo;: key = placeholder ('nombre'), value = columna del excel ('NOMBRE_STUDIANTE');

  function setExcelData(newHeaders: string[], newRows: ExcelRow[]) {
    headers.value = newHeaders;
    rows.value = newRows;
  }

  function updateMapping(placeholder: string, excelColumn: string) {
    fieldMapping.value[placeholder] = excelColumn;
  }

  function toggleRowSelection(rowIndex: number, selected: boolean) {
    const row = rows.value.find((r) => r._rowIndex === rowIndex);
    if (row) {
      row._selected = selected;
    }
  }

  function selectAll(selected: boolean) {
    rows.value.forEach((r) => {
      r._selected = selected;
    });
  }

  return {
    rows,
    headers,
    fieldMapping,
    setExcelData,
    updateMapping,
    toggleRowSelection,
    selectAll,
  };
});
