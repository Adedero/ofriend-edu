<script setup lang="ts">
import { inject } from 'vue';
import type { FullPost } from '../../types';
import useDate from '@/composables/use-date';

const post = inject<FullPost>('post');

const statuses = [
  { value: 'PUBLIC', icon: 'world'},
  { value: 'PRIVATE', icon: 'lock'},
  { value: 'FOLLOWERS', icon: 'friends'}
];
</script>

<template>
  <div v-if="post">
    <div class="cursor-pointer flex items-center gap-2">
      <MyAvatar :user="post.author" shape="circle" size="large" avatar-class="w-12 h-12" />

      <div>
        <div class="flex items-center gap-2">
          <p>
            <span class="font-bold">{{ post.author.name }}</span>
            <span v-if="post.reposting" class="italic font-medium"> shared a post</span>
          </p>

          <SwitchCase :case="post.status">
            <SwitchCaseItem v-for="status in statuses" :key="status.value" :value="status.value">
              <MyIcon :icon="status.icon" height="12" width="12" />
            </SwitchCaseItem>
          </SwitchCase>
        </div>

        <p class="flex items-center gap-1">
          <small class="text-slate-500">{{ useDate(post.createdAt).timeAgo() }}</small>
          <span v-show="post.edited" class="block w-1 aspect-square bg-slate-500 rounded-full"></span>
          <small v-show="post.edited" class="text-slate-500">edited</small>
        </p>
      </div>
    </div>
  </div>
</template>
