<script setup lang="ts">
import { inject, ref } from 'vue';
import type { FullPost } from '../../types';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useRouter } from 'vue-router';
import useFetch from '@/composables/use-fetch';
import { useEventBus } from '@vueuse/core';
import { useToast } from 'primevue/usetoast';

const bus = inject<ReturnType<typeof useEventBus<{ name: string, data: string }>>>('bus');
const router = useRouter();

const post = inject<FullPost>('post');

const toast = useToast();
const visible = ref(false);

const loading = ref(false);
const err = ref<UseFetchError | null>(null);

const deletePost = async () => {
  if (!post) return;
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<{ deleted: boolean }>(
    `social/post/${post._id}`, { method: 'DELETE', router }
  );
  loading.value = false;
  err.value = error.value;
  if (err.value || !data.value) {
    if (err.value && !visible.value) {
      toast.add({
        severity: 'error',
        summary: 'Failed to delete post',
        detail: err.value.message,
        life: 3000
      });
    }
    return
  };
  if (data.value.deleted) {
    toast.add({
      severity: 'success',
      detail: 'Post deleted.',
      life: 3000
    });
    bus?.emit({ name: 'delete-post', data: post._id });
  }
}
</script>

<template>
  <div v-if="post">
    <Button @click="visible = true" label="Delete post" icon="pi pi-trash" text severity="danger" fluid class="flex justify-normal" />
    <Dialog v-model:visible="visible" @hide="visible = false" modal header="Confirmation" style="z-index: 100;">
      <div class="max-w-72">
        <span v-if="loading">Your post is being deleted. <br> We'll notify you when it's done.</span>
        <span v-else class="text-red-500">Are you sure you want to delete this post?</span>
        <div class="mt-4 flex items-center gap-2 justify-end">
          <Button v-if="!loading" @click="visible = false" label="Cancel" severity="secondary" />
          <Button @click="deletePost" :loading :label="loading ? 'Deleting' : 'Proceed'" severity="danger" />
        </div>
        <!-- <LoadingBar v-if="loading" v-model:visible="loading" loading-text="Deleting post..." /> -->
        <SimpleError v-if="err" :message="err.message" class="mt-2" />
      </div>
    </Dialog>
  </div>
</template>
