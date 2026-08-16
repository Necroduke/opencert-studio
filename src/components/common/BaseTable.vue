<script setup lang="ts">
defineProps<{
  headers: string[];
  isLoading?: boolean;
}>();
</script>

<template>
  <div class="relative w-full overflow-auto rounded-md border">
    <table class="w-full caption-bottom text-sm">
      <thead class="[&_tr]:border-b">
        <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
          <th 
            v-for="(header, index) in headers" 
            :key="index"
            class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
          >
            <slot :name="`header-${index}`" :header="header">
              {{ header }}
            </slot>
          </th>
        </tr>
      </thead>
      <tbody class="[&_tr:last-child]:border-0">
        <slot v-if="!isLoading" />
        <tr v-else>
          <td :colspan="headers.length" class="p-4 text-center text-muted-foreground">
            Cargando datos...
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
