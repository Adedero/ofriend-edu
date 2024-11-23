<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  loadingText: { type: String },
  closable: { type: Boolean, default: false },
  visible: { type: Boolean, default: false }
});

const emits = defineEmits(['update:visible']);

const localVisible = ref(props.visible);

watch(() => props.visible, (newVal) => {
  localVisible.value = newVal;
});

const closeComponent = () => {
  localVisible.value = false;
  emits('update:visible', false);
};
</script>

<template>
  <Teleport to="body">
    <div v-if="localVisible" class="fixed z-[999] w-dvw left-0 top-16 bg-turquoise-200 text-primary">
      <div class="w-full p-2 flex justify-between gap-2 items-start">
        <p v-if="loadingText">{{ loadingText }}</p>
        <p>
          <slot></slot>
        </p>
        <Button v-if="closable" @click="closeComponent" icon="pi pi-times" text size="small" rounded
          class="flex-shrink-0"></Button>
      </div>
      <ProgressBar mode="indeterminate" style="height: 3px; width: full; border-radius: 0;"></ProgressBar>
    </div>
  </Teleport>
</template>
