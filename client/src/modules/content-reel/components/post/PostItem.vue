<script setup lang="ts">
import { provide, ref, readonly } from 'vue';
import type { FullPost } from '../../types';
import { useEventBus } from '@vueuse/core'

const emit = defineEmits(['block-author', 'delete-post']);

const bus = useEventBus<{ name: string, data: unknown}>('post');
provide('bus', bus);
bus.on(event => {
  switch (event.name) {
    case 'block-author':
      emit('block-author', event.data as { authorId: string });
      break;
    case 'edit-post':
      if (event.data as boolean) {
        handlePostEdit();
      }
      break;
    case 'delete-post':
      emit('delete-post', event.data as { postId: string });
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

      <div>
        <TextContent v-if="post.hasText" :text="post.textContent" />
      </div>
    </Panel>
  </div>
</template>
