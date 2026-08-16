<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  preventClose?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const close = () => {
  if (props.preventClose) return;
  emit('update:modelValue', false);
  emit('close');
};

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
    close();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});

watch(() => props.modelValue, (isOpen) => {
  if (typeof document !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          class="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
          @click="close"
        ></div>
        <div 
          class="relative z-50 w-full max-w-lg rounded-lg border bg-card p-6 text-card-foreground shadow-lg sm:max-w-[425px]"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            <h2 v-if="title" class="text-lg font-semibold leading-none tracking-tight">
              {{ title }}
            </h2>
            <p v-if="$slots.description" class="text-sm text-muted-foreground">
              <slot name="description" />
            </p>
          </div>
          
          <div class="py-4">
            <slot />
          </div>

          <div v-if="$slots.footer" class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
            <slot name="footer" />
          </div>

          <button 
            v-if="!preventClose"
            @click="close"
            class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <span class="sr-only">Cerrar</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-out;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
