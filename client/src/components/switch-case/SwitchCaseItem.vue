<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';

interface Props {
  value: string | number | boolean;
};

const props = defineProps<Props>();

const switchCase: Ref<string | number | boolean> | undefined = inject('switch-case');

const isMatched = computed(() => switchCase ? props.value === switchCase.value : false);
</script>

<template>
  <div v-if="isMatched">
    <slot />
  </div>
</template>
