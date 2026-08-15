import { defineStore } from "pinia";
import { ref } from "vue";
import type { TextBox } from "../types/document.types";

export const useTemplateStore = defineStore("template", () => {
  const baseImage = ref<string | null>(null);
  const originalWidth = ref<number>(0);
  const originalHeight = ref<number>(0);
  const textBoxes = ref<TextBox[]>([]);
  const selectedTextBoxId = ref<string | null>(null);

  function setBaseImage(dataUrl: string, width: number, height: number) {
    baseImage.value = dataUrl;
    originalWidth.value = width;
    originalHeight.value = height;
  }

  function addTextBox(box: TextBox) {
    textBoxes.value.push(box);
  }

  function updateTextBox(id: string, updates: Partial<TextBox>) {
    const index = textBoxes.value.findIndex((b) => b.id === id);
    if (index !== -1) {
      textBoxes.value[index] = { ...textBoxes.value[index], ...updates };
    }
  }

  function removeTextBox(id: string) {
    textBoxes.value = textBoxes.value.filter((b) => b.id !== id);
    if (selectedTextBoxId.value === id) {
      selectedTextBoxId.value = null;
    }
  }

  return {
    baseImage,
    originalWidth,
    originalHeight,
    textBoxes,
    selectedTextBoxId,
    setBaseImage,
    addTextBox,
    updateTextBox,
    removeTextBox,
  };
});
