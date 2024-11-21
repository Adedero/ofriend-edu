<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useFetch from "@/composables/use-fetch";
import { type MentionedUser } from '../types';
import fetchErrorHandler from '@/composables/use-fetch/functions/fetch-error-handler';
import type { UseFetchError } from "@/composables/use-fetch/functions/fetch-error-creator";
import useInfiniteScroll from '@/composables/use-infinite-scroll';

interface Props {
  buttonClass?: string;
  buttonSize?: 'small' | 'large';
  popupClass?: string;
}

const { buttonSize = 'small' } = defineProps<Props>();

const emit = defineEmits(['mention']);

const router = useRouter();

const visible = ref(false);

const users = ref<MentionedUser[]>([]);
const searchText = ref('');
const initial = ref('');

const LIMIT = 10;
const allLoaded = ref(false);
const MAX_MENTIONS = 20;

const loading = ref(false);
const err = ref<UseFetchError | null>(null);

const getUsers = async () => {
  err.value = null;

  if (users.value.length === MAX_MENTIONS) {
    err.value = {
      name: 'MaxMentionsError',
      message: 'You have reached the maximum number of mentions.'
    }
    return
  };
  if (!searchText.value) return;
  if (loading.value || allLoaded.value) return;

  if (searchText.value === initial.value) return;
  if (searchText.value !== initial.value) {
    users.value = [];
    initial.value = searchText.value;
  };

  loading.value = true;


  const { data, error } = await useFetch<MentionedUser[]>(
    `social/user/search?value=${searchText.value}&skip=${users.value.length}&limit=${LIMIT}`,
    { cache: true }
  );

  loading.value = false;

  if (error.value) {
    err.value = fetchErrorHandler(error.value, router);
    return;
  };

  if (!data.value) return;

  users.value.push(...data.value);
  if (data.value.length < LIMIT) allLoaded.value = true;
}

watch(searchText, () => {
  allLoaded.value = false;
});

const el = ref<null | HTMLElement>(null);
useInfiniteScroll(
  el,
  () => {
    getUsers()
  }
);

const handleUserClick = (user: MentionedUser) => {
  emit('mention', user);
  users.value = [];
  visible.value = false;
};

</script>

<template>
  <div>
    <Button @click="visible = !visible" severity="secondary" :icon="visible ? 'pi pi-times' : 'pi pi-at'"
      :size="buttonSize" :class="buttonClass" />

    <div ref="el" v-if="visible" :class="[
      popupClass,
      'w-72 max-h-80 p-2 rounded-lg z-20 bg-white border shadow-md border-slate-400 absolute overflow-y-auto']">

      <div v-if="loading" class="w-full grid gap-2">
        <div v-for="i in 3" :key="i" class="w-full flex items-center gap-2">
          <Skeleton shape="circle" width="2rem" height="2rem" class="flex-shrink-0" />
          <Skeleton height="1rem" />
        </div>
      </div>

      <div v-else-if="err">
        <SimpleError :message="err.message" />
      </div>

      <div class="w-full grid gap-2">
        <div>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search"> </InputIcon>
            <InputText type="search" v-model.trim="searchText" @keydown.enter="getUsers" placeholder="Search to mention"
              class="w-full" />
          </IconField>
        </div>

        <div v-if="users.length" class="w-full grid gap-2">
          <div v-for="user in users" :key="user.id" @click="handleUserClick(user)"
            class="py-1 px-2 hover:bg-turquoise/10 cursor-pointer rounded-md flex items-center gap-2">
            <MyAvatar shape="circle" :user avatar-class="w-8 h-8" />
            <p class="text-sm font-semibold">{{ user.name }}</p>
          </div>
        </div>

        <div v-else>No results</div>
      </div>
    </div>
  </div>
</template>
