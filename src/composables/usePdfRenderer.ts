import { ref } from "vue";
import { pdfGenerator } from "../services/pdfGenerator.service";
import { useTemplateStore } from "../stores/templateStore";
import { useExcelStore } from "../stores/excelStore";
import { useDocumentStore } from "../stores/documentStore";

export function usePdfRenderer() {
  const isGenerating = ref(false);
  const templateStore = useTemplateStore();
  const excelStore = useExcelStore();
  const documentStore = useDocumentStore();
  const error = ref<string | null>(null);

  const generatePreview = async (rowIndex: number): Promise<string | null> => {
    if (!templateStore.baseImage) return null;

    const row =
      excelStore.rows.find((r) => r._rowIndex === rowIndex) ||
      excelStore.rows[0];
    if (!row) return null;

    try {
      const pdfBytes = await pdfGenerator.generateSinglePdf(
        templateStore.baseImage,
        templateStore.originalWidth,
        templateStore.originalHeight,
        templateStore.textBoxes,
        row,
        excelStore.fieldMapping,
      );

      //usamos blob para vistra previa en un iframe
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (err: any) {
      error.value = err.message || "error generando vista previa!!!";
      console.error("[generatePreview] Error :", error);
      return null;
    }
  };

  const generateBatch = async (): Promise<Blob | null> => {
    if (!templateStore.baseImage) {
      documentStore.finishProcessing(false, "No hay plantilla!");
      return null;
    }

    const rowsToProcess = excelStore.rows.filter((r) => r._selected);
    if (rowsToProcess.length === 0) {
      documentStore.finishProcessing(
        false,
        "No hay filas seleccionadas para procesar.",
      );
      return null;
    }

    isGenerating.value = true;
    documentStore.startProcessing(rowsToProcess.length);

    try {
      const zipBlob = await pdfGenerator.generateBatchZip(
        templateStore.baseImage,
        templateStore.originalWidth,
        templateStore.originalHeight,
        templateStore.textBoxes,
        rowsToProcess,
        excelStore.fieldMapping,
        (current) => {
          documentStore.updateProgress(current);
        },
      );

      documentStore.finishProcessing(true);
      return zipBlob;
    } catch (error: any) {
      console.error("Error :", error);
      documentStore.finishProcessing(
        false,
        error.message || "Error al generar PDFs.",
      );
      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  return {
    isGenerating,
    generatePreview,
    generateBatch,
  };
}
