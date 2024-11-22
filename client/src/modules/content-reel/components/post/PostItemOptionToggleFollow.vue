<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import type { FullPost } from '../../types';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useRouter } from 'vue-router';
import useFetch from '@/composables/use-fetch';

const router = useRouter();

const post = inject<FullPost>('post');

const following = ref(false)
watchEffect(() => following.value = post ? post.viewerFollowsAuthor: false);

const loading = ref(false);
const err = ref<UseFetchError | null>(null);

const toggleUserFollow = async () => {
  if (!post) return;
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<{ following: boolean }>(
    `social/follow/${post.author._id}`, { method: 'POST', router }
  )
  loading.value = false;
  err.value = error.value;

  if (data.value) following.value = data.value.following;
}

const firstName = computed(() => post?.author.name.split(' ')[0] ?? '')
</script>

<template>
  <div v-if="post">
    <Button @click="toggleUserFollow"
    :label="following ? `Unfollow ${firstName}` : `Follow ${firstName}`"
    :icon="following ? 'pi pi-user-minus' : 'pi pi-user-plus'" text severity="secondary" class="text-left"
    :class="{ 'text-accent': following }" :loading />

    <SimpleError v-if="err" :message="err.message"  />
  </div>
</template>
