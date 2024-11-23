<script setup lang="ts">
import Popper from "vue3-popper";
interface Props {
  hover?: boolean;
  openDelay?: string | number;
  closeDelay?: string | number;
}
const {
  hover = false,
  openDelay = 200,
  closeDelay = 200,
} = defineProps<Props>();
</script>

<template>
  <Popper v-bind="$attrs" :hover :openDelay :closeDelay :z-index="10">
    <slot />
    <template #content="props">
      <slot name="content" v-bind="props" />
    </template>
  </Popper>
</template>

<style>
:root {
  --popper-theme-background-color: #fff;
  --popper-theme-background-color-hover: #fff;
  --popper-theme-text-color: var(--p-text-color);
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 5px;
  --popper-theme-box-shadow: 0 6px 20px -6px rgba(0, 0, 0, 0.25);
}
</style>
