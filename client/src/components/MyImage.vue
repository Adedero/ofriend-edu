<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits(['load', 'error']);

interface Props {
  src?: string;
  alt?: string;
  preview?: boolean;
  width?: string | number;
  height?: string | number;
}

const { preview = true, src, alt, width = '100%', height = 300 } = defineProps<Props>();

const image = ref<HTMLImageElement | null>(null);
const loading = ref(true);
const error = ref(false);

const currentSrc = ref(src); // Default to src
const imageWidth = ref<number | null>(null); // Actual image width after load
const imageHeight = ref<number | null>(null); // Actual image height after load

const handleLoad = () => {
  loading.value = false;
  error.value = false;
  if (image.value) {
    imageWidth.value = image.value.naturalWidth; // Get the actual width
    imageHeight.value = image.value.naturalHeight; // Get the actual height
  }
  emit('load');
};

const handleError = () => {
  error.value = true;
  loading.value = false;
  emit('error');
};

const retryLoad = () => {
  error.value = false;
  loading.value = true;
  currentSrc.value = src; // Retry with the original src
};

onMounted(() => {
  if (image.value) {
    image.value.addEventListener('load', handleLoad);
    image.value.addEventListener('error', handleError);
  }
});

onUnmounted(() => {
  if (image.value) {
    image.value.removeEventListener('load', handleLoad);
    image.value.removeEventListener('error', handleError);
  }
});

// Compute background color class based on loading or error state
const bg = computed(() => loading.value ? 'bg-slate-300' : error.value ? 'bg-slate-800' : '');

// Calculate the aspect ratio for the container based on the image's dimensions
const aspectRatio = computed(() => {
  if (imageWidth.value && imageHeight.value) {
    return imageWidth.value / imageHeight.value; // Aspect ratio (width / height)
  }
  return 1; // Default aspect ratio if image is not loaded yet
});

// Dynamic height calculation based on the aspect ratio
const containerHeight = computed(() => {
  if (imageWidth.value && imageHeight.value) {
    // Height based on aspect ratio of the image
    return `${(imageHeight.value / imageWidth.value) * 100}%`; // Maintain aspect ratio relative to width (100%)
  }
  return `${height}px`; // Default height until image is loaded
});
</script>

<template>
  <div
    :class="['image-container', bg]"
    :style="{ width: width, height: containerHeight, aspectRatio, position: 'relative' }"
  >
    <!-- Loading and error handling -->
    <div v-if="loading" class="loading-state">
      <Loader />
    </div>
    <div v-else-if="error" class="error-state">
      <div class="flex flex-col gap-2 items-center justify-center">
        <Message severity="error">
          <p class="text-sm">Error loading image</p>
        </Message>
        <Button @click="retryLoad" label="Retry" icon="pi pi-refresh" severity="danger" />
      </div>
    </div>

    <!-- Image element -->
    <img ref="image" :src="currentSrc" :alt="alt" loading="lazy" class="image hidden" />
    <Image v-if="!loading" :src="currentSrc" :alt :preview />
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  border-radius: 6px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-state, .error-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
