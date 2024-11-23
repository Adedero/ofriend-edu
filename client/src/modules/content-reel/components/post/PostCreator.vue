<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import visibilityOptions from '@/data/visibilty';
import useFetch from "@/composables/use-fetch";
import useUserStore from '@/stores/user.store';
import { handleMention, parseMentions } from '../../utils/mentions';
//import socket from '@/config/socket.config';
import type { MediaFile, MentionedUser, Post } from '../../types';
import type { UseFetchError } from "@/composables/use-fetch/functions/fetch-error-creator";
import fetchErrorHandler from '@/composables/use-fetch/functions/fetch-error-handler';


const router = useRouter();
const userStore = useUserStore();

const status = ref(visibilityOptions[0]);

const files = ref<null | MediaFile[]>(null);
const setFiles = (data: MediaFile[]) => (files.value = data);

const post = ref<Post>({
  textContent: '',
  status: '',
  hasText: false,
  hasMedia: false,
  mentions: []
});

const text = ref('');
const mentions = ref<MentionedUser[]>([]);

const onMention = (user: MentionedUser) => handleMention(user, text, mentions, 'text-box');

const posting = ref(false);
const err = ref<null | UseFetchError>(null);

const createPost = async () => {
  post.value.hasText = text.value.length > 0;
  post.value.hasMedia = (files.value?.length ?? 0) > 0;
  post.value.status = status.value.name;
  if (!post.value.hasText && !post.value.hasMedia) return;

  const { text: parsedText, mentions: filteredMentions } = parseMentions(text.value, mentions.value);
  post.value.textContent = parsedText;
  post.value.mentions = filteredMentions;

  const form = new FormData();
  form.append('post', JSON.stringify(post.value));

  if (files.value) {
    files.value.forEach((file, index) => form.append(`file-${index + 1}`, file.file));
    form.append('file_data', JSON.stringify(files.value.map(file => {
      return {
        name: file.file.name,
        width: file.data.width,
        height: file.data.height
      }
    })));
  };

  err.value = null;
  posting.value = true;

  const { data, error } = await useFetch('social/post', { method: 'POST', body: form });

  posting.value = false;
  if (error.value) {
    err.value = fetchErrorHandler(error.value, router);
    return;
  };
  if (!data.value) return;
  //socket.emit('post-created', userStore.user, data.value.postId);
  router.push({
    name: 'post',
    params: { post_id: data.value.postId as string}
  });
};
</script>

<template>
  <div class="p-3 border rounded-md">
    <div class="flex flex-col gap-1">
      <div class="flex items-center justify-end gap-2">
        <p class="text-[0.8rem] font-medium">Who can see this?</p>
        <Select v-model="status" :options="visibilityOptions" option-label="desc"
          input-class="text-[0.8rem] h-7 flex items-center px-1" />
      </div>
      <div class="flex items-start gap-2 justify-between">
        <MyAvatar shape="circle" avatar-class="h-10 w-10 flex-shrink-0" :user="userStore.user" />

        <Textbox v-model="text" fluid rows="1" input-id="text-box" autoresize :max-rows="15"
          placeholder="Ready to share your knowledge?" />
      </div>
    </div>

    <div class="mt-3 flex items-start justify-between">
      <div class="flex items-start justify-center gap-2">
        <PostCreatorMediaAttachment @upload="setFiles" @cancel="files = null" :loading="posting" />
      </div>

      <div class="flex items-center gap-3 relative">
        <UserMention @mention="onMention" popup-class="top-12 right-0" />

        <Button @click="createPost" :loading="posting" label="Post" icon="pi pi-angle-double-right" icon-pos="right"
          size="small" />
      </div>
    </div>

    <SimpleError v-if="err" :message="err.message" class="mt-2" />
  </div>
</template>
