<script setup lang="ts">
import useUserStore from '@/stores/user.store';
import { computed } from 'vue';

const userStore = useUserStore();

const userId = computed(() => userStore.user?.id ?? "")
</script>

<template>
  <main class="h-dvh w-dvw relative">
    <header class="p-3">
      <RouterLink :to="userId ? { name: 'app', params: { userId }} : '/'">
        <img src="../../assets/images/logo-dark.svg" alt="ofriend-logo">
      </RouterLink>
    </header>

    <!-- <div class="p-3 w-full mt-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]">
      <div class="max-w-[28rem] mx-auto">
        <img src="../../assets/images/403.svg" alt="Page not found" class="block">
      </div>

      <div class="text-center grid gap-2 place-content-center">
        <p class="text-xl md:text-2xl">Oops! You aren't allowed to view this page.</p>
        <p class="font-medium">This could have happened for a number of reasons:</p>
        <ul class="list-disc text-left">
          <li>If you're trying to visit a user's profile or view their post,<br> you may have blocked them or they may
            have blocked you 😔.</li>
          <li>You may have encountered a network issue.</li>
        </ul>

        <div class="w-fit mx-auto mt-5 flex gap-2">
          <Button v-if="userId" @click="$router.push({ name: 'app', params: { userId: userStore.user.id } })"
            label="Explore More Content" />
          <Button v-else @click="$router.push('/')" label="Explore More Content" />
          <Button @click="$router.back()" label="Take Me Back" severity="secondary" />
        </div>

      </div>
    </div> -->

  </main>
</template>
