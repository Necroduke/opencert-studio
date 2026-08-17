import { ref } from "vue";
import { excelParser } from "../services/excelParser.service";
import { useExcelStore } from "../stores/excelStore";

export function useExcelReader() {
  const isReading = ref(false);
  const error = ref<string | null>(null);
  const excelStore = useExcelStore();

  const readExcelFile = async (file: File) => {
    isReading.value = true;
    error.value = null;
    try {
      const { headers, rows } = await excelParser.parseFile(file);
      excelStore.setExcelData(headers, rows);
    } catch (err: any) {
      error.value = err.message || "error al procesar el archivo excel!!!";
      console.error("[useExcelReader] Error :", err);
    } finally {
      isReading.value = false;
    }
  };

  //evaulamos las filas en base al map actual y actualizamos su estado
  const validateRows = () => {
    const mappedColumns = Object.values(excelStore.fieldMapping);
    excelStore.rows.forEach((row) => {
      excelParser.evaluateRowStatus(row, mappedColumns);
    });
  };

  return {
    isReading,
    error,
    readExcelFile,
    validateRows,
  };
}
