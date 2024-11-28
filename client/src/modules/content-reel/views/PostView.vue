<script setup lang="ts">
import useFetch from '@/composables/use-fetch';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FullPost } from '../types';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const err = ref<null | UseFetchError>(null);
const post = ref<FullPost | null>(null);

const getPost = async (postId: string) => {
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<FullPost>(`social/post/${postId}`, { cache: true, router });
  loading.value = false;
  err.value = error.value;

  console.log(data.value);
  if (data.value) post.value = data.value;
};

onMounted(async () => {
  await getPost(route.params.post_id as string);
});
</script>

<template>
  <main>
    <PostItemSkeleton v-if="loading" />
    <FetchError v-else-if="err" :error="err" @retry="getPost($route.params.post_id as string)" />
    <div v-else-if="post">
      <PostItem
        :post
        @like="(liked : boolean) => post && (post.isLikedByViewer = liked)" />
    </div>
  </main>
</template>
