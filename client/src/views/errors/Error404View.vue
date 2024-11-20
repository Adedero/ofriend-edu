<script setup>
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';

const userStore = useUserStore();

const userId = computed(() => userStore.user?.id ?? "")
</script>

<template>
  <main class="h-dvh w-dvw relative">
    <header class="p-3">
      <button @click="$router.push('/')" type="button">
        <img src="../../assets/images/logo-dark.svg" alt="ofriend-logo">
      </button>
    </header>

    <div class="p-3 w-full mt-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div class="max-w-[32rem] mx-auto">
        <img src="../../assets/images/404.svg" alt="Page not found" class="block">
      </div>

      <div class="text-center grid gap-2 place-content-center">
        <p class="text-xl md:text-2xl">Oops! Seems like something went wrong.</p>
        <p>The requested page could not be found</p>
        <Button v-if="userId" @click="$router.push({ name: 'app', params: { userId } })" label="Take Me Home"
          class="w-fit mx-auto mt-5" />
        <Button v-else @click="$router.push('/')" label="Take Me Home" class="w-fit mx-auto mt-5" />
      </div>
    </div>
  </main>
</template>
