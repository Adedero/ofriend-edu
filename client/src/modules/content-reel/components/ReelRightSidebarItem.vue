<script setup lang="ts">
import type { Follows } from '../types';

interface Props {
  users?: Follows['followers' | 'following'];
  header?: string;
}
const { users = [] } = defineProps<Props>();
</script>

<template>
  <div class="followers flex-shrink-0 flex flex-col items-center lg:items-start">
    <h1 v-if="header" class="text-center font-bold lg:text-left">{{ header }}</h1>

    <div v-if="users" class="mt-5 grid gap-3 lg:w-full">
      <div v-if="users.length">
        <div v-for="user in users" :key="user.id"
          @click="$router.push({ name: 'user-social-profile', query: { profile_id: user.id } })"
          class="grid grid-cols-7 xl:grid-cols-10 items-center cursor-pointer">

          <MyAvatar :user shape="circle" size="large" avatar-class="w-10 h-10 col-span-7 lg:col-span-2" />
          <div class="hidden overflow-x-hidden lg:block col-span-5 xl:col-span-8">
            <p class="font-medium text-sm">{{ user.name }}</p>
            <p class="text-xs max-w-full truncate">{{ user.bio }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <slot></slot>
      </div>

      <div v-if="users.length === 3" class="grid gap-3">
        <Button @click="$router.push({ name: 'user-social-profile' })"
          icon="pi pi-angle-right" size="large" rounded outlined class="lg:hidden" />
        <Button @click="$router.push({ name: 'user-social-profile' })"
          label="Show All" outlined class="hidden lg:flex" />
      </div>
    </div>
  </div>
</template>