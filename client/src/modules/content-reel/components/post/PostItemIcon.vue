<script setup lang="ts">
import { defineAsyncComponent, inject } from 'vue';
import type { FullPost } from '../../types';

const PostItemOptions = defineAsyncComponent({
  loader: () => import('./PostItemOptions.vue')
});

const post = inject<FullPost>('post');
</script>

<template>
  <div v-if="post">
    <MyPopover>
      <button class="mr-5 p-1.5 hover:bg-slate-200 rounded-md">
        <span class="pi pi-ellipsis-v"></span>
      </button>
      <template #content>
        <div class="max-w-56">
          <PostItemOptions />
        </div>
      </template>
    </MyPopover>
  </div>
</template>
