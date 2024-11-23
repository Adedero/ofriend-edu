<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

interface Props {
  media?: { _id: string; name: string; url: string; mimetype: string }[];
  preview?: boolean;
};
const { media, preview = true } = defineProps<Props>();
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
        aspect-ratio="16/9"
        :src="media[0].url"
        alt="Image"
      />
      <video-player
       v-if="media[0].mimetype.includes('video')"
        :src="media[0].url"
        fluid
        controls
        :loop="false"
        :volume="0.6"
      />
    </div>

    <div v-if="media.length > 1"></div>
  </div>
</template>
