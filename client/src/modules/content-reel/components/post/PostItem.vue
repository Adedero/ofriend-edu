<script setup lang="ts">
import { provide, ref, readonly } from 'vue';
import type { FullPost } from '../../types';
import { useEventBus } from '@vueuse/core'

const emit = defineEmits(['comments-count-click', 'block-author', 'delete-post', 'like']);

const bus = useEventBus<{ name: string, data: unknown}>('post');
provide('bus', bus);
bus.on(event => {
  switch (event.name) {
    case 'comments-count-click':
      emit('comments-count-click', event.data as { postId: string });
      break;
    case 'block-author':
      emit('block-author', event.data as { authorId: string });
      break;
    case 'edit-post':
      if (event.data as boolean) handlePostEdit();
      break;
    case 'delete-post':
      emit('delete-post', event.data as { postId: string });
      break;
    case 'like':
      emit('like', event.data as { liked: boolean });
      break;
    default:
      break;
  }
});

interface Props {
  post: FullPost
}
const { post } = defineProps<Props>();

provide('post', readonly(post));

const visible = ref(false);
function handlePostEdit () {
  visible.value = true;
}

</script>

<template>
  <div class="min-w-0 w-full">
    <Panel>
      <template #header>
        <PostItemHeader />
      </template>

      <template #icons>
        <PostItemIcon />
      </template>

      <div class="grid gap-2">
        <TextContent v-if="post.hasText" :text="post.textContent" />
        <MediaContent v-if="post.hasMedia" :media="post.media" />
      </div>


      <div v-if="post.reposting" class="mt-5 px-2">
        <div v-if="post.repostedPost">
          <SharedPostItem />
        </div>

        <Message v-else icon="pi pi-info-circle">
          <p>This post is no longer available.</p>
        </Message>
      </div>

      <template #footer>
        <PostItemFooter />
      </template>
    </Panel>

    <Drawer v-model:visible="visible" header="Edit post" position="bottom" class="h-auto">
     <!--  <EditPostItem v-if="visible" :post @onPostEdited="handlePostEdit" /> -->
    </Drawer>
  </div>
</template>
