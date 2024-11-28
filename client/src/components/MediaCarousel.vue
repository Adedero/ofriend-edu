<script setup lang="ts">
import { ref } from 'vue';
import type { FullPost } from '@/modules/content-reel/types';

interface Props {
  media: FullPost['media']
}
const { media } = defineProps<Props>();

const responsiveOptions = ref([
    {
        breakpoint: '991px',
        numVisible: 4
    },
    {
        breakpoint: '767px',
        numVisible: 3
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
</script>

<template>
  <div v-if="media && media.length">
    <div>
      <Galleria :value="media" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true" containerStyle="max-width: 640px"
        :showItemNavigators="true" :showThumbnails="false" :showItemNavigatorsOnHover="true" :showIndicators="true">
        <template #item="slotProps">
          <VImage
          v-if="slotProps.item.mimetype.includes('image')"
          :src="slotProps.item.url"
          :alt="slotProps.item.name"
          :preview="false"
          :rounded="false"
          />
          <!-- <img :src="slotProps.item.src" :alt="slotProps.item.name" style="width: 100%; display: block;" /> -->
        </template>
        <template #thumbnail="slotProps">
          <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block;" />
        </template>
    </Galleria>
    </div>
   <!--  <div class="carousel-container border bg-slate-600" :class="{ three: media.length === 3 }">
      <div v-for="item in media.slice(0, 4)" :key="item._id" class="media-container">
        <VImage
          v-if="item.mimetype.includes('image')"
          :src="item.url"
          :alt="item.name"
          :preview="false"
          :rounded="false"
          />
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.carousel-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-radius: 12px;
  height: 15rem;
  overflow: hidden;
  cursor: pointer;
  position: relative;

  &::before {
    position: absolute;
    content: "";
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    transition: background 200ms;
  }

  &:hover:before {
    background-color: rgba(0, 0, 0, 0.2);
  }
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
