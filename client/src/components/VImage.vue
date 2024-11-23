<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';

interface Props {
  alt?: string;
  src: string;
  aspectRatio?: number | string;
  width?: string | number;
  height?: string | number;
  preview?: boolean;
  rounded?: boolean;
  objectCover?: boolean;
}

const { width, height, aspectRatio, alt, src, preview = true, rounded = true } = defineProps<Props>();

const image = ref<HTMLImageElement | null>(null);
const observer = ref<IntersectionObserver | null>(null);

const loading = ref(true);
const error = ref(false);
const retryCount = ref(0);
const maxRetries = 3; // Limit the number of retries
const retryTimeout = 2000; // Delay between retries (in milliseconds)


const naturalWidth = ref<number | null>(null);
const naturalHeight = ref<number | null>(null);

const containerStyle = computed(() => {
  if (naturalWidth.value && naturalHeight.value) {
    const ratio = naturalWidth.value / naturalHeight.value;
    return {
      aspectRatio: ratio,
      width: width || '100%',
    };
  }
  if (aspectRatio) {
    //const ratio = typeof aspectRatio === 'string' ? parseFloat(aspectRatio) : aspectRatio;
    return {
      aspectRatio,
      width: width || '100%',
    };
  }
  return {
    width: width || '100%',
    height: height || 'auto',
  };
});

const handleLoad = () => {
  loading.value = false;
  error.value = false;
  retryCount.value = 0;
  if (image.value) {
    naturalWidth.value = image.value.naturalWidth;
    naturalHeight.value = image.value.naturalHeight;
  }
};

const handleError = () => {
  loading.value = false;
  error.value = true;
};

const reload = () => {
  if (retryCount.value < maxRetries) {
    retryCount.value++;
    loading.value = true;
    error.value = false;
    setTimeout(() => {
      if (image.value) {
        image.value.src = src;
      }
    }, retryTimeout); // Retry after a timeout
  } else {
    error.value = true; // No more retries allowed
  }
};

onMounted(() => {
  if (!image.value) return;

  image.value.addEventListener('load', handleLoad);
  image.value.addEventListener('error', handleError);

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && image.value) {
        image.value.src = src;
        if (alt) image.value.alt = alt;
        observer.value?.disconnect();
      }
    });
  }, { threshold: 0.1 });

  observer.value.observe(image.value);
});

onUnmounted(() => {
  if (!image.value) return;

  image.value.removeEventListener('load', handleLoad);
  image.value.removeEventListener('error', handleError);

  if (observer.value) {
    observer.value.unobserve(image.value);
  }
});
</script>

<template>
  <div class="image-container" :class="{ loaded: !loading && !error, 'rounded-lg': rounded }" :style="containerStyle">
    <div v-if="loading" class="loading-state">
      <Loader type="spinner" />
    </div>

    <div v-else-if="error" class="error-state">
      <div class="flex flex-col gap-2 items-center justify-center">
        <Message severity="error">
          <p class="text-sm">Error loading image. Please try again.</p>
        </Message>
        <Button
          @click="reload"
          :label="retryCount < maxRetries ? 'Retry' : 'Retry Limit Reached'"
          icon="pi pi-refresh"
          :disabled="retryCount >= maxRetries"
          severity="danger"
        />
      </div>
    </div>

    <img ref="image" :src="src" :alt="alt" :class="{ loaded: !loading && preview }" />
    <Image v-if="!loading && !error && preview" :src :alt :preview />
  </div>
</template>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
  background-color: rgb(71 85 105);
  transition: all 500ms;
}

.image-container.loaded {
  background-color: transparent;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

img.loaded {
  display: none;
}

.loading-state, .error-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
