<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import type { FullPost } from '../../types';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useRouter } from 'vue-router';
import useFetch from '@/composables/use-fetch';
import { useEventBus } from '@vueuse/core';

const bus = inject<ReturnType<typeof useEventBus<{ name: string, data: string }>>>('bus');

const router = useRouter();

const post = inject<FullPost>('post');

const blocked = ref(false)

const loading = ref(false);
const err = ref<UseFetchError | null>(null);

const block = async () => {
  if (!post) return;
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<{ blocked: boolean }>(
    `social/block/${post.author._id}`, { method: 'POST', router }
  )
  loading.value = false;
  err.value = error.value;
  if (err.value || !data.value) return;
  blocked.value = data.value.blocked;
  if (blocked.value) {
    bus?.emit({ name: 'block-user', data: post.author._id });
  }
}

const firstName = computed(() => post?.author.name.split(' ')[0] ?? '');
</script>

<template>
  <div v-if="post">
    <Button @click="block" :loading :label="'Block '+ firstName" icon="pi pi-ban" text severity="secondary"
      class="text-left flex justify-normal" />
    <SimpleError v-if="err" :message="err.message"  />
  </div>
</template>
