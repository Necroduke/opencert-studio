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

  const addTextBox = (box: Partial<TextBox>) => {
    const newBox: TextBox = {
      id: box.id || crypto.randomUUID(),
      x: box.x || 50,
      y: box.y || 50,
      width: box.width || 200,
      height: box.height || 40,
      rawText: box.rawText || 'Nuevo {campo}',
      placeholders: box.placeholders || [],
      type: box.type || 'text',
      mode: box.mode || 'autofit',
      style: {
        fontFamily: box.style?.fontFamily || 'Helvetica',
        fontSize: box.style?.fontSize || 24,
        fontWeight: box.style?.fontWeight || 'normal',
        fontStyle: box.style?.fontStyle || 'normal',
        textDecoration: box.style?.textDecoration || 'none',
        textAlign: box.style?.textAlign || 'center',
        color: box.style?.color || '#000000'
      }
    };
    textBoxes.value.push(newBox);
    selectedTextBoxId.value = newBox.id;
  };

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
