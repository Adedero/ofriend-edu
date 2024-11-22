<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { FullPost } from '../../types';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useRouter } from 'vue-router';
import useFetch from '@/composables/use-fetch';
import useUserStore from '@/stores/user.store';
import { useEventBus } from '@vueuse/core';

const bus = inject<ReturnType<typeof useEventBus<{ name: string, data: boolean }>>>('bus');

const router = useRouter();

const userStore = useUserStore();

const post = inject<FullPost>('post');
const loading = ref(false);
const err = ref<UseFetchError | null>(null);

interface SaveStatus { saved: boolean };
const saveStatus = ref<SaveStatus | null>(null);

const getPostSaveStatus = async () => {
  err.value = null;
  if (!post) {
    err.value = { name: 'InvalidPostError', message: 'Failed to load' };
    return;
  };
  loading.value = true;
  const { data, error } = await useFetch<SaveStatus>(
    `social/post/save/${post._id}`, { cache: true, router }
  );
  loading.value = false;
  err.value = error.value;

  if (data.value) saveStatus.value = data.value;
};

const handleToggleSave = (saved: boolean) => {
  if (saveStatus.value) saveStatus.value.saved = saved;
};

const edit = () => {
  bus?.emit({ name: 'edit-post', data: true });
}

onMounted(async () =>{
  await getPostSaveStatus()
});
</script>

<template>
  <div v-if="post">
    <Loader v-if="loading" />
    <FetchError v-else-if="err" :error="err" @retry="getPostSaveStatus" :show-icon="false" />
    <div v-else-if="saveStatus">
      <PostItemOptionCopyLink />
      <PostItemOptionBlockUser />
      <div v-if="!post.isViewedByAuthor && post.author._id !== userStore.user?.id">
        <PostItemOptionSavePost :saved="saveStatus.saved" @toggle-save="handleToggleSave" />
        <PostItemOptionToggleFollow />
        <PostItemOptionBlockUser />
        <!-- Option to report post -->
      </div>

      <div v-if="post.isViewedByAuthor && post.author._id === userStore.user?.id">
        <Divider />
        <Button @click="edit" label="Edit post" icon="pi pi-file-edit" text severity="secondary" fluid class="flex justify-normal" />
        <PostItemOptionDeletePost />
      </div>
    </div>
  </div>
</template>
