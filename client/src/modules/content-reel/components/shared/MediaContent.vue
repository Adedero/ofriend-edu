<script setup lang="ts">
import { onMounted, ref } from 'vue';

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
      <VImage v-if="media[0].mimetype.includes('image')" aspect-ratio="16/9" :src="media[0].url" alt="Image" />
      <!-- <Image ref="image" v-if="media[0].mimetype.includes('image')" :src="media[0].url" alt="Image" :preview width="100%" /> -->
    </div>

    <div v-else></div>
  </div>
</template>
