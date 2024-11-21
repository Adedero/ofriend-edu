<script setup lang="ts">
interface Props {
  icon?: string;
  severity?: string;
  closable?: boolean;
  message?: null | string | number;
  class?: string;
  life?: number;
}
const { severity = 'error', closable = true } = defineProps<Props>();
</script>

<template>
  <Message :class :icon :severity :closable :life>
    <slot>
      <p class="text-sm">{{ message }}</p>
    </slot>
  </Message>
</template>
