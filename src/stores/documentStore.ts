import { defineStore } from "pinia";
import { ref } from "vue";

export type ProcessStatus =
  | "IDLE"
  | "PROCESSING"
  | "COMPLETED"
  | "ERROR"
  | "CANCELLED";

export const useDocumentStore = defineStore("document", () => {
  const status = ref<ProcessStatus>("IDLE");
  const progress = ref(0); //0-100
  const processedCount = ref(0);
  const totalCount = ref(0);
  const errorMessage = ref<string | null>(null);

  function startProcessing(total: number) {
    status.value = "PROCESSING";
    totalCount.value = total;
    processedCount.value = 0;
    progress.value = 0;
    errorMessage.value = null;
  }

  function updateProgress(current: number) {
    processedCount.value = current;
    progress.value =
      totalCount.value > 0 ? Math.round((current / totalCount.value) * 100) : 0;
  }

  function finishProcessing(success: boolean, err?: string) {
    status.value = success ? "COMPLETED" : "ERROR";
    if (err) errorMessage.value = err;
    if (success) progress.value = 100;
  }

  function cancelProcessing() {
    status.value = "CANCELLED";
  }

  function reset() {
    status.value = "IDLE";
    progress.value = 0;
    processedCount.value = 0;
    totalCount.value = 0;
    errorMessage.value = null;
  }

  return {
    status,
    progress,
    processedCount,
    totalCount,
    errorMessage,
    startProcessing,
    updateProgress,
    finishProcessing,
    cancelProcessing,
    reset,
  };
});
