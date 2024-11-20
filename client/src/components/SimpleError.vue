<script setup lang="ts">
interface Props {
  icon?: string;
  severity?: string;
  closable?: boolean;
  message?: null | string | number;
}

const { severity = 'error', closable = true } = defineProps<Props>();
</script>
<template>
  <Message :icon :severity :closable>
    <p class="text-sm">{{ message }}</p>
  </Message>
</template>
