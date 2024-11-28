<script setup lang="ts">
import { provide, readonly } from 'vue';

import type { FullPost } from '../../types';

interface Props {
  post: FullPost
}
const { post } = defineProps<Props>();

provide('post', readonly(post));

</script>

<template>
  <div
    @click="$router.push({
      name: 'post',
      params: { post_id: post._id }
    })"
    v-if="post" class="cursor-pointer min-w-0 w-full relative">
    <div class="w-full h-full aboslute top-0 left-0 z-50"></div>
    <Panel>
      <template #header>
        <PostItemHeader />
      </template>

      <div class="grid gap-2">
        <TextContent v-if="post.hasText" :text="post.textContent" />
        <MediaContent v-if="post.hasMedia" :media="post.media" />
      </div>
    </Panel>
  </div>
</template>
