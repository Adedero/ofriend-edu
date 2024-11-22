<script setup lang="ts">
import { defineAsyncComponent, inject, ref } from 'vue';
import type { FullPost } from '../../types';

const PostItemOptions = defineAsyncComponent({
  loader: () => import('./PostItemOptions.vue')
});

const post = inject<FullPost>('post');

const popover = ref();
const toggle = (event: Event) => {
  popover.value.toggle(event);
};
</script>

<template>
  <div v-if="post">
    <button class="p-1.5 hover:bg-slate-200 rounded-md" @click="toggle">
      <span class="pi pi-ellipsis-v"></span>
    </button>

    <Popover ref="popover">
      <PostItemOptions />
    </Popover>
  </div>
</template>
