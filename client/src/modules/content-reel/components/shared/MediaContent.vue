<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import type { FullPost } from '../../types';

interface Props {
  media?: FullPost['media'];
};
const { media } = defineProps<Props>();
const image = ref<HTMLImageElement | null>();

onMounted(() => {
  if (!image.value) return;
  console.log(image.value)
});
</script>

<template>
  <div v-if="media && media.length">
    <div v-if="media.length === 1">
      <v-image
        v-if="media[0].mimetype.includes('image')"
        :aspect-ratio="`${media[0].width ?? '16'}/${media[0].height ?? '9'}`"
        :src="media[0].url"
        alt="Image"
      />
      <video-player
       v-if="media[0].mimetype.includes('video')"
        :src="media[0].url"
        :aspect-ratio="`${media[0].width ?? ''}:${media[0].height ?? ''}`"
        fluid
        controls
        :loop="false"
        :volume="0.6"
      />
    </div>

    <div v-if="media.length > 1">
      <MediaCarousel :media />
    </div>
  </div>
</template>
