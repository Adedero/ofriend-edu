<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';
import { useRouter } from 'vue-router';
import useFetch from '@/composables/use-fetch';
import type { User } from '@/types/user.type';

interface Props {
  target: "post" | "comment";
  targetId: string;
}

interface Liker {
  _id: string;
  name: string;
  picture: User['picture']
}

const { target, targetId } = defineProps<Props>();

const router = useRouter();

const likers = ref<Liker[] | null>(null);
const loading = ref(false);
const allLoaded = ref(false);
const err = ref<UseFetchError | null>(null);

const skip = computed(() => {
  if (likers.value) {
    return likers.value.length
  }
  return 0;
});
const LIMIT = 20;

const displayLikers = async () => {
  if (allLoaded.value) return;
  err.value = null;
  loading.value = true;
  const { data, error } = await useFetch<Liker[]>(
    `social/like?${target}_id=${targetId}&skip=${skip.value}&limit=${LIMIT}`, { router }
  )
  loading.value = false;
  err.value = error.value;
  if (error.value || !data.value) return;

  if (data.value.length < LIMIT) allLoaded.value = true;
  if (likers.value) likers.value.push(...data.value);
  if (!likers.value) likers.value = data.value;
}

onMounted(async () => {
  await displayLikers();
});
</script>

<template>
  <div class="pt-5">
    <div v-if="likers">
      <div v-if="likers.length" class="flex flex-col gap-2 *:flex-shrink-0">
        <div v-for="liker in likers" :key="liker._id"
          @click="$router.push({
            name: 'user-social-profile',
            params: { profile_id: liker._id }
          })"
          class="cursor-pointer items-center gap-1 p-2 hover:font-semibold">
          <MyAvatar shape="circle" :user="liker" class="w-8 aspect-square" />
          <p>{{ liker.name }}</p>
        </div>

        <div v-if="!loading && !err && !allLoaded">
          <Button @click="displayLikers" label="More" outlined size="small" />
        </div>
      </div>

      <div v-else>
        <Message icon="pi pi-info-circle">No likes yet</Message>
      </div>
    </div>

     <LikersListSkeleton v-if="loading" />
    <FetchError v-if="err" :error="err" @retry="displayLikers" />
  </div>
</template>
