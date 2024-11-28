<script setup lang="ts">
import { inject } from 'vue';
import { useEventBus } from '@vueuse/core';

const bus = inject<ReturnType<typeof useEventBus<{ name: string, data: boolean }>>>('bus');

const handleClick = () => {
  bus?.emit({ name: 'share', data: true });
}
</script>

<template>
  <div>
    <Button
      @click="handleClick" label="Comment" icon="pi pi-comment"
      severity="secondary" rounded text class="text-sm"/>
  </div>
</template>
