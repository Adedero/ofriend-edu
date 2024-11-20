<script setup lang="ts">
interface Props {
  text?: string;
  textPos?: string;
}

const { textPos = 'right' } = defineProps<Props>();
</script>

<template>
  <div class="flex items-center gap-2">
    <slot name="loader">
      <div class="loader" :class="{ 'order-2': textPos === 'left' }"></div>
    </slot>
    <slot name="text">
      <p v-if="text">{{ text }}</p>
    </slot>
  </div>
</template>

<style scoped>
/* HTML: <div class="loader"></div> */
.loader {
  width: 40px;
  aspect-ratio: 1;
  display: grid;
  border-radius: 50%;
  background:
    linear-gradient(0deg, rgb(0 25 56/50%) 30%, #0000 0 70%, rgb(0 25 56/100%) 0) 50%/8% 100%,
    linear-gradient(90deg, rgb(0 25 56/25%) 30%, #0000 0 70%, rgb(0 25 56/75%) 0) 50%/100% 8%;
  background-repeat: no-repeat;
  animation: l23 1s infinite steps(12);
}

.loader::before,
.loader::after {
  content: "";
  grid-area: 1/1;
  border-radius: 50%;
  background: inherit;
  opacity: 0.915;
  transform: rotate(30deg);
}

.loader::after {
  opacity: 0.83;
  transform: rotate(60deg);
}

@keyframes l23 {
  100% {
    transform: rotate(1turn)
  }
}
</style>