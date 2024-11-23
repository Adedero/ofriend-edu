<script setup lang="ts">
import type { FullPost } from '@/modules/content-reel/types';

interface Props {
  media: FullPost['media']
}
const { media } = defineProps<Props>();
</script>

<template>
  <div v-if="media && media.length">
    <div class="carousel-container border bg-slate-600" :class="{ three: media.length === 3 }">
      <div v-for="item in media.slice(0, 4)" :key="item._id" class="media-container">
        <VImage
          v-if="item.mimetype.includes('image')"
          :src="item.url"
          :alt="item.name"
          :preview="false"
          :rounded="false"
          />
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-radius: 12px;
  height: 15rem;
  overflow: hidden;
}

.media-container {
  overflow: hidden;
}

.carousel-container.three {
  .media-container:nth-of-type(1) {
    grid-row: span 2 / span 2;
  }
}
</style>
