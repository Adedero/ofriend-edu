<script setup lang="ts">
import type { FullPost } from '@/modules/content-reel/types';

interface Props {
  media: FullPost['media']
}
const { media } = defineProps<Props>();
</script>

<template>
  <div v-if="media && media.length">
    <div class="carousel-container">
      <!-- <div v-for="item in media" :key="item._id" class="media-container">
        //Media
      </div> -->
      <div class="media-container bg-red-500"></div>
      <div class="media-container bg-blue-500"></div>
      <div class="media-container bg-yellow-500"></div>
    </div>
    Media
  </div>
</template>

<style scoped>
.carousel-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-radius: 6px;
  height: 10rem;
  overflow: hidden;

  .media-container:nth-of-type(1) {
    background-color: purple;
  }
}
.carousel-container.three {

}
</style>
