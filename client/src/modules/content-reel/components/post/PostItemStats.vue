<script setup lang="ts">
import { defineAsyncComponent, inject, ref } from 'vue';
import type { FullPost } from '../../types';
import { useEventBus } from '@vueuse/core';
import useNumber from '@/composables/use-number';
import LikersListSkeleton from '../skeletons/LikersListSkeleton.vue';

const LikersList = defineAsyncComponent({
  loader: () => import('../shared/LikersList.vue'),
  loadingComponent: LikersListSkeleton
});

const bus = inject<ReturnType<typeof useEventBus<{ name: string, data: string }>>>('bus');

const post = inject<FullPost>('post');

const handleCommentsCountClick = () => {
  if (!bus || !post) return;
  bus.emit({ name: 'comments-count-click', data: post._id });
}

const visible = ref(false);
</script>

<template>
  <div v-if="post">
    <div class="flex items-center gap-2">
      <button @click="visible = true" type="button" class="hover:font-semibold">
        {{ useNumber(post.likesCount).shorten() }}
        {{ post.likesCount === 1 ? 'Like' : 'Likes' }}
      </button>

      <div class="w-1.5 h-1.5 rounded-full bg-[--p-text-color] fkex-shrink-0"></div>

      <button @click="handleCommentsCountClick" type="button" class="hover:font-semibold">
        {{ useNumber(post.commentsCount).shorten() }}
        {{ post.commentsCount === 1 ? 'Comment' : 'Comments' }}
      </button>

      <div class="w-1.5 h-1.5 rounded-full bg-[--p-text-color] fkex-shrink-0"></div>

      <p class="cursor-context-menu">
        {{ useNumber(post.repostsCount).shorten() }}
        {{ post.repostsCount === 1 ? 'Share' : 'Shares' }}
      </p>
    </div>

    <Drawer v-model:visible="visible" position="right" class="max-w-96">
      <template #header>
        <p class="font-bold text-lg">People who liked this.</p>
      </template>
      <LikersList v-if="visible" target="post" :target-id="post._id" />
    </Drawer>
  </div>
</template>