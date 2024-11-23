<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import type { FullPost } from '../../types';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useRouter } from 'vue-router';
import useFetch from '@/composables/use-fetch';

interface Props { saved: boolean }
const { saved } = defineProps<Props>();

const emit = defineEmits(['toggle-save']);

const router = useRouter();

const post = inject<FullPost>('post');

const loading = ref(false);
const err = ref<UseFetchError | null>(null);

const togglePostSave = async () => {
  if (!post) return;
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<{ saved: boolean }>(
    `social/post/save/${post._id}`, { method: 'POST', router }
  )
  loading.value = false;
  err.value = error.value;
  if (err.value || !data.value) return;
  emit('toggle-save', data.value.saved);
}
</script>
<template>
  <div v-if="post">
    <Button @click="togglePostSave" :label="saved ? 'Unsave' : 'Save'" :loading="loading"
    :icon="saved ? 'pi pi-bookmark pi-fill' : 'pi pi-bookmark'" text severity="secondary" class="flex justify-normal"
    :class="{ 'text-turquoise': saved }" fluid />
    <SimpleError v-if="err" :message="err.message"  />
  </div>
</template>togglePostSave
