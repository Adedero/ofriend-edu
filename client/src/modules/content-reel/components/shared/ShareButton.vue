<script setup lang="ts">
import { computed, ref } from 'vue';
import type { FullComment, FullPost } from '../../types';

interface Props {
  post?: FullPost;
  comment?: FullComment;
}

const { post, comment } = defineProps<Props>();

const author = computed(() => {
  if (post) return post.author.name;
  if (comment) return comment.author.name;
  return '';
})

const visible = ref(false);
</script>

<template>
  <div>
    <Button
      @click="visible = true" icon="pi pi-refrsh" label="Share" severity="secondary"
      rounded text class="text-sm flex items-center gap-0">
      <template #icon>
        <div>
          <MyIcon icon="share" width="20" height="20" />
        </div>
      </template>
    </Button>

    <Drawer v-model:visible="visible" position="bottom" style="height: auto">
      <template #header>
        <h1 class="font-semibold">Sharing {{ author }}'s post</h1>
      </template>
      <!-- <NewRepostItem :post-id="post.id" @on-post-shared="clearEditor" /> -->
    </Drawer>
  </div>
</template>
