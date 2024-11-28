<script setup lang="ts">
defineEmits(['click']);
</script>

<template>
  <div>
    <div class="flex items-center justify-center flex-col gap-3 md:flex-row">
      <div class="face flex-shrink-0">
        <span class="eyes">
          <span class="pupils"></span>
        </span>
        <span class="eyes">
          <span class="pupils"></span>
        </span>
        <!-- <div class="bandana"></div> -->
      </div>
      <div class="text-center md:text-left">
        <p class="font-semibold">Hmmm...</p>
        <p>Something seems suspicious.</p>
        <p>You need to verify your account to continue.</p>
      </div>
    </div>

    <div class="mt-2 flex justify-center md:justify-end">
      <Button @click="$emit('click')" label="OK" icon="pi pi-arrow-right" icon-pos="right" />
    </div>
  </div>
</template>

<style scoped>
.face {
  border-radius: 50%;
  aspect-ratio: 1/1;
  width: 6rem;
  background-color: var(--p-primary-color);
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  position: relative;
}

.bandana {
  position: absolute;
  width: 6rem;
  height: 3rem;
  background-color: red;
  bottom: -20%;
  z-index: 10;
  clip-path: polygon(50% 100%, 0 0, 100% 0);
  left: 50%;
  transform: translateX(-50%);
}

.eyes {
  position: relative;
  background-color: #fff;
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eyes::before,
.eyes::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  background-color: var(--p-primary-color);
  z-index: 10;
}

.eyes::before {
  top: 0;
  transform: translateY(-100%);
  animation: narrow-top 5s infinite;
}

.eyes::after {
  bottom: 0;
  transform: translateY(100%);
  animation: narrow-bottom 5s infinite;
}

.pupils {
  aspect-ratio: 1/1;
  width: 12px;
  background-color: #000914;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: dart 5s infinite;
}

@keyframes dart {
  0%, 10% { transform: translate(-50%, -50%); }        /* Start centered */
  20%, 30% { transform: translate(-150%, -50%); }      /* Dart left */
  40%, 50% { transform: translate(50%, -50%); }        /* Dart right */
  60%, 70% { transform: translate(-50%, -50%); }       /* Return center */
  80%, 100% { transform: translate(-50%, -50%); }      /* Hold center */
}

@keyframes narrow-top {
  0%, 40%, 100% { transform: translateY(-100%); }           /* Offscreen at start and end */
  80%, 90%, 96% { transform: translateY(-40%); }
  95% { transform: translateY(0); }                    /* Narrow eye at halfway */
}

@keyframes narrow-bottom {
  0%, 40%, 100% { transform: translateY(100%); }            /* Offscreen at start and end */
  80%, 90%, 96% { transform: translateY(40%); }
  95% { transform: translateY(0); }                    /* Narrow eye at halfway */
}
</style>
