<script setup lang="ts">
import type { UseFetchError } from '@/composables/use-fetch/functions/fetch-error-creator';

interface Props {
  error?: null | UseFetchError;
  fill?: string;
  loading?: boolean;
  reloadButton?: boolean;
  reloadButtonLabel?: string;
  reloadPage?: boolean;
  message?: string;
  icon?: string;
  showIcon?: boolean;
}

const {
  reloadButton = true,
  reloadButtonLabel = "Retry",
  reloadPage = false,
  icon = 'no-wifi',
  showIcon = true,
} = defineProps<Props>()

const emit = defineEmits(['retry']);

function handleReload () {
  if (reloadPage) {
    window.location.reload();
    return
  }
  emit('retry');
}

</script>
<template>
  <div v-if="error">
    <div v-if="!error.status || (error.status && error.status >= 500)">
      <div class="bg-slate-200 rounded-md w-full px-2 py-4 flex flex-col gap-3 items-center justify-center">
        <div class="flex-shrink-0">
          <div v-if="showIcon">
            <slot name="icon">
              <MyIcon :icon width="40" height="40" />
            </slot>
          </div>
        </div>

        <div class="flex-shrink-0 text-center">
          <slot name="message" :message>
            <div class="text-sm font-medium">
              <p v-if="message">{{ message }}</p>
              <p v-else-if="error">{{ error.message }}</p>
              <p v-else>
                Something went wrong.
                <br>
                Check your connection and try again.
              </p>
            </div>
          </slot>
        </div>

        <div v-if="reloadButton" class="flex-shrink-0">
          <Button @click="handleReload" :label="reloadButtonLabel" size="small" :loading="loading"
            icon="pi pi-refresh" />
        </div>
      </div>
    </div>

    <div v-else>
      <Message severity="error" class="flex">
        <p class="text-sm">{{ error.message }}</p>

        <div v-if="reloadButton" class="mt-2">
          <Button @click="handleReload" severity="danger" :label="reloadButtonLabel"
            size="small" :loading="loading" icon="pi pi-refresh" />
        </div>
      </Message>
    </div>
  </div>
</template>
