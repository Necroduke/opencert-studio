<script setup lang="ts">
import { computed } from 'vue';
import type { RowStatus } from '../../types/excel.types';

const props = defineProps<{
  status: RowStatus;
  message?: string;
}>();

const statusConfig = computed(() => {
  switch (props.status) {
    case 'VALID':
      return { class: 'bg-green-100 text-green-800 border-green-200', label: 'Válido' };
    case 'WARNING':
      return { class: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Advertencia' };
    case 'ERROR':
      return { class: 'bg-red-100 text-red-800 border-red-200', label: 'Error' };
    default:
      return { class: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Desconocido' };
  }
});
</script>

<template>
  <span 
    :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', statusConfig.class]"
    :title="message"
  >
    {{ statusConfig.label }}
  </span>
</template>
