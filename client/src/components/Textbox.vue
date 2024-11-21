<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CSSProperties } from 'vue';

interface Props {
  autoresize?: boolean;
  cols?: string | number;
  fluid?: boolean;
  inputClass?: string;
  inputId?: string;
  inputStyle?: string | CSSProperties;
  maxLength?: number;
  maxRows?: number;
  resize?: boolean;
  rows?: string | number;
  placeholder?: string;
}

const {
  autoresize = false,
  fluid = false,
  maxRows = 0,
  resize = false,
  rows = 3,
  maxLength = 0
} = defineProps<Props>();

const emit = defineEmits(['focus', 'blur']);

const model = defineModel<string>();

const textarea = ref<null | HTMLTextAreaElement>(null);

const resetTextareaRows = () => {
  if (textarea.value) {
    textarea.value.rows = typeof rows === 'number' ? rows : parseInt(rows);
  }
};

const handleInput = (event: Event) => {
  const el = event.target as HTMLTextAreaElement;

  if (autoresize && maxRows) {
    el.rows = typeof rows === 'number' ? rows : parseInt(rows);
    //const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '24');
    //const newRows = Math.min(Math.ceil(el.scrollHeight / lineHeight), maxRows);
    const newRows = Math.min(Math.ceil(el.scrollHeight / 40), maxRows);
    el.rows = newRows;
  }

  if (maxLength && el.value.length > maxLength) {
    el.value = el.value.slice(0, maxLength);
  }

  model.value = el.value;
}


watch(model, (value) => {
  if (value === '') {
    resetTextareaRows();
  }
});
</script>

<template>
  <textarea ref="textarea" :value="model" @input="handleInput" @focus="$emit('focus', $event)" @blur="$emit('blur', $event)"
    :id="inputId" :rows="rows" :cols="cols" :placeholder="placeholder" class="v-textbox"
    :class="[fluid ? 'w-full' : '', !resize ? 'resize-none' : '', inputClass]" :style="inputStyle">
  </textarea>
</template>

<style scoped>
.v-textbox {
  @apply outline-none border rounded-md border-slate-400 bg-slate-200 py-2 px-3 focus:bg-white transition-colors shadow-sm;
}
</style>
