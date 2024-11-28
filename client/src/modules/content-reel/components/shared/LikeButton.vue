<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { FullComment, FullPost } from '../../types';
import useFetch from '@/composables/use-fetch';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useEventBus } from '@vueuse/core';

interface Props {
  post?: FullPost;
  comment?: FullComment;
}

const { post, comment } = defineProps<Props>();

const bus = inject<ReturnType<typeof useEventBus<{ name: string, data: boolean }>>>('bus');

const router = useRouter();

const loading = ref(false);
const err = ref<UseFetchError | null>(null);

const api = computed<string | null>(() => {
  if (post) return `social/like?post_id=${post._id}`
  if (comment) return `social/like?comment_id=${comment._id}`
  return null
});

const toggleLike = async () => {
  if (!api.value) return;
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<{ liked: boolean }>(
    api.value, { method: 'POST', router }
  )
  loading.value = false;
  err.value = error.value;

  if (err.value || !data.value) return;
  bus?.emit({ name: 'like', data: data.value.liked });
}
</script>

<template>
  <div>
    <Button v-if="post" @click="toggleLike" label="Like"
      :loading rounded text
      :icon="post.isLikedByViewer ? 'pi pi-thumbs-up-fill text-turquoise' : 'pi pi-thumbs-up'"
      class="text-sm">
    </Button>

    <Button v-if="comment" @click="toggleLike" label="Like"
      :loading rounded text
      :icon="comment.isLikedByViewer ? 'pi pi-thumbs-up-fill text-turquoise' : 'pi pi-thumbs-up'"
      class="text-sm">
    </Button>
  </div>
</template>
