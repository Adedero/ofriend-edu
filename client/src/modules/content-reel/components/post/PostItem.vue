<script setup lang="ts">
import { inject, onMounted, provide, readonly } from 'vue';
import type { FullPost } from '../../types';

interface Props {
  post: FullPost
}
const { post } = defineProps<Props>();

provide('post', readonly(post));

</script>

<template>
  <div class="min-w-0 w-full">
    <Panel>
      <template #header>
        <PostItemHeader />
      </template>

      <template #icons>
        <PostItemIcon />
      </template>
    </Panel>
  </div>
</template>
