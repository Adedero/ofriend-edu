<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import type { FullPost } from '../../types';

const emit = defineEmits(['clickOutside']);
interface Props {
  media: FullPost['media']
}
const { media } = defineProps<Props>();

const content = ref<HTMLElement>();

onClickOutside(
  content,
  () => {
    emit('clickOutside');
  }
)
</script>

<template>
  <div v-if="media" ref="content"
    class="w-dvw h-[80dvh] overflow-x-auto overflow-y-hidden flex gap-5 md:flex-col *:flex-shrink-0
    md:overflow-y-auto md:overflow-x-hidden md:h-dvh md:w-[70dvw] md:max-w-[40rem]">
    <div v-for="item in media" :key="item._id" class="h-full md:w-full p-4">
      <img v-if="item.mimetype.includes('image')" :src="item.url" class="h-full w-full object-contain">
    
      <video-player
       v-if="item.mimetype.includes('video')"
        :src="item.url"
        :aspect-ratio="`${item.width ?? ''}:${item.height ?? ''}`"
        fluid
        controls
        :loop="false"
        :volume="0.6"
      />
    </div>
  </div>
</template>
