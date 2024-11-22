<script setup lang="ts">
import { inject, onUnmounted, ref } from 'vue';
import type { FullPost } from '../../types';

const post = inject<FullPost>('post');

const copied = ref(false);

let timeout: null | number = null;

const copy = async () => {
  if (!post) return;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const link = `${baseUrl}/share/${post?._id}`;
  await navigator.clipboard.writeText(link);
  copied.value = true;
  timeout = setTimeout(() => {
    copied.value = false;
  }, 2000);
}
onUnmounted(() => {
  if (timeout) clearTimeout(timeout);
})
</script>

<template>
  <Button @click="copy" :label="copied ? 'Copied' : 'Copy link'" :icon="copied ? 'pi pi-check' : 'pi pi-link'"
  text severity="secondary" fluid  class="flex justify-normal" />
</template>
