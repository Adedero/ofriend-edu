<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import type { FullPost } from '../../types';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useRouter } from 'vue-router';
import useFetch from '@/composables/use-fetch';

const router = useRouter();

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
      <div v-if="!post.isViewedByAuthor">
        <PostItemOptionSavePost :saved="saveStatus.saved" @toggle-save="handleToggleSave" />
        <PostItemOptionToggleFollow />
      </div>
    </div>
  </div>
</template>
