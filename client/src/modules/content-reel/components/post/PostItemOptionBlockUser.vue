<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import type { FullPost } from '../../types';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useRouter } from 'vue-router';
import useFetch from '@/composables/use-fetch';

const emit = defineEmits(['block-author']);

const router = useRouter();

const post = inject<FullPost>('post');

const blocked = ref(false);

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

  if (!data.value) return;
  blocked.value = data.value.blocked;
  if (blocked.value) {
    emit('block-author');
  }
};
const firstName = computed(() => post?.author.name.split(' ')[0] ?? '');
</script>

<template>
  <div v-if="post">
    <Button @click="block" :loading :label="'Block ' + firstName"
      icon="pi pi-ban" text severity="secondary" class="flex justify-normal" />

    <SimpleError v-if="err" :message="err.message"  />
  </div>
</template>
