<script setup lang="ts">
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { onMounted, ref } from 'vue';
import type { Follows } from '../types';
import useFetch from '@/composables/use-fetch';
import fetchErrorHandler from '@/composables/use-fetch/functions/fetch-error-handler';
import { useRouter } from 'vue-router';

const router = useRouter();

const loading = ref(false);
const err = ref<null | UseFetchError> (null);
const follows = ref<null | Follows>(null);
const AMOUNT = 3;

const getFollows = async () => {
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<Follows>(`social/follow?skip=0&limit=${AMOUNT}&type=followers,following`, { cache: true });
  loading.value = false;

  if (error.value) {
    err.value = fetchErrorHandler(error.value, router);
    return;
  }
  if (!data.value) return;
  follows.value = data.value;
};

onMounted(async () => {
  await getFollows();
});
</script>

<template>
  <div class="w-full">
    <ReelRightSidebarSkeleton v-if="loading" />

    <FetchError v-else-if="err" :error="err" @retry="getFollows" />

    <div v-else class="grid gap-3">
      <ReelRightSidebarItem :users="follows?.followers" header="Followers">
        <div class="text-slate-400 text-6xl lg:hidden">0</div>
        <div class="hidden lg:grid gap-3 text-sm text-slate-500 p-1">
          <img src="../../../assets/img/no-followers.svg" alt="no followers">
          <p class="text-center">No one follows you at the moment.</p>
          <p class="text-center font-semibold">Post more interesting stuff to attract followers!</p>
        </div>
      </ReelRightSidebarItem>

      <Divider />

      <ReelRightSidebarItem :users="follows?.following" header="Following">
        <div class="text-slate-400 text-6xl lg:hidden">0</div>
        <div class="hidden lg:grid gap-3 text-sm text-slate-500 p-1">
          <img src="../../../assets/img/no-following.jpg" alt="no following">
          <p class="text-center">You're not following anyone at the moment.</p>
          <p class="text-center font-semibold">Search for interesting profiles to follow!</p>
        </div>
      </ReelRightSidebarItem>
    </div>
  </div>
</template>
