<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import safeFileFormats from '@/data/safe-file-formats';
import loadImage from '../../utils/load-image';

const MAX_MEDIA_AMOUNT = 20;

interface Props { loading?: boolean }
defineProps<Props>();

const emit = defineEmits(['upload', 'cancel']);

const acceptedFileFormats = safeFileFormats.join(',');

const files = ref<null | File[]>(null);
const fileUrls = ref<{ url: string; width: number; height: number }[]>([]);

const uploading = ref(false);
const errorMessage = ref<null | string>(null);

const handleInput = async (event: Event) => {
  errorMessage.value = null;
  const el = event.target as HTMLInputElement;
  if (!el.files) return;

  if (el.files.length > MAX_MEDIA_AMOUNT) {
    errorMessage.value = `You can only upload up to ${MAX_MEDIA_AMOUNT} files in one post.`
    return;
  };
  uploading.value = true;

  const invalidUpload = [...el.files].some(file => {
    const fileType = file.type.split('/')[0];
    return fileType !== 'image' && fileType !== 'video';
  });
  if (invalidUpload) {
    errorMessage.value = 'You can only upload photos or videos';
    uploading.value = false;
    return;
  };

  files.value = [...el.files];
  const urls: { url: string; width: number; height: number}[] = [];
  try {
    const results = await Promise.all(files.value.map(loadImage));
    results.forEach(({ data }) => {
      urls.push({ url: data.url, width: data.width, height: data.height });
    });
    emit('upload', results);
    uploading.value = false;
    fileUrls.value = urls;

  } catch (error) {
    errorMessage.value = 'Failed to upload images. Try again.';
    uploading.value = false;
    return;
  }

  /* const reader = new FileReader()
  reader.readAsDataURL(el.files[0])
  reader.onload = (e) => {
    firstFileUrl.value = e.target?.result as string;
  } */
}

const isImage = (file: File) => file.type.split('/')[0] === 'image';
const isVideo = (file: File) => file.type.split('/')[0] === 'video';

const reset = () => {
  files.value = []
  fileUrls.value = []
  emit('cancel')
}

onUnmounted(() => reset());
</script>

<template>
  <div class="relative">
    <label for="post-media-attachment"
      class="w-fit cursor-pointer flex items-center justify-center gap-1 p-2 rounded text-slate-500 hover:bg-slate-100">
      <span class="pi pi-images" style="font-size: 1.2rem"></span>
      <small class="font-semibold">Photo/video</small>
    </label>

    <input @input="handleInput" @cancel="reset" id="post-media-attachment" type="file" multiple
      :accept="acceptedFileFormats" class="hidden" />

    <SimpleError class="mt-2" v-if="errorMessage" :message="errorMessage" />

    <div v-if="files && files.length">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="pi pi-paperclip text-slate-500"></span>
          <p class="text-slate-500 text-sm font-semibold">
            {{ files.length }} {{ files.length > 1 ? 'files' : 'file' }} attached
          </p>
        </div>
        <Button :loading @click="reset" icon="pi pi-times-circle" severity="danger" text rounded />
      </div>

      <Loader v-if="uploading" type="spinner" />

      <div v-else>
        <div v-if="fileUrls.length" class="relative cursor-context-menu hover:brightness-75 transition-all">
          <p v-if="files.length > 1"
            class="text-6xl absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            + {{ files.length - 1 }}
          </p>
          <img v-if="isImage(files[0])" :src="fileUrls[0].url" alt="file-image" class="max-w-60">
          <video v-if="isVideo(files[0])" controls :src="fileUrls[0].url" class="max-w-60"></video>
        </div>
      </div>
    </div>
  </div>
</template>
