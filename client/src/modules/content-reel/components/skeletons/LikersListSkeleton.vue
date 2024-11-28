<template>
  <div v-for="i in 5" :key="i" class="mb-2 flex items-center gap-2">
    <Skeleton shape="circle" height="2rem" width="2rem" class="flex-shrink-0" />
    <Skeleton height="1.5rem" class="flex-grow" />
  </div>
</template>