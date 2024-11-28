<script setup lang="ts">
import { inject } from 'vue';
import type { FullPost } from '../../types';

const post = inject<FullPost>('post');

</script>

<template>
  <footer class="text-sm md:flex md:items-center md:justify-between md:gap-2">
    <PostItemStats />

    <Divider class="md:hidden" />

    <div class="flex items-center justify-between md:justify-end">
      <LikeButton :post />
      <CommentButton />
      <ShareButton :post />
    </div>
    <!--
    <template #footer>
        <div class="text-sm">
          <PostStats :post="post" />
          <Divider />
          <div class="flex items-center gap-1 justify-between ss:justify-normal ss:gap-3">
            <LikeButton :post="post" @on-like-click="sendEmit" />
            <CommentButton @onCommentCreated="(comment) => $emit('onCommentCreated', comment)" :post />
            <ShareButton :post="post" class="ss:ml-auto" @on-post-shared="$emit('onPostShared')" />
          </div>
        </div>
      </template> -->
    </footer>
</template>
