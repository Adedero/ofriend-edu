<template>
  <aside class="grid gap-3">
    <div class="followers flex-shrink-0 flex flex-col items-center lg:items-start">
      <h1 class="text-center font-bold lg:text-left">Followers</h1>

      <div class="mt-5 grid gap-3 lg:w-full">
        <div v-for="i in 3" :key="i" class="flex items-center gap-2">
          <Skeleton shape="circle" width="3rem" height="3rem" />

          <div class="hidden lg:grid lg:gap-2">
            <Skeleton width="5rem" height="1.5rem" />
            <Skeleton width="5rem" height="0.8rem" />
          </div>
        </div>
      </div>
    </div>

    <Divider />

    <div class="following flex-shrink-0 flex flex-col items-center lg:items-start">
      <h1 class="text-center font-bold lg:text-left">Following</h1>
      <div class="mt-5 grid gap-3 lg:w-full">
        <div v-for="i in 3" :key="i" class="flex items-center gap-2">
          <Skeleton shape="circle" width="3rem" height="3rem" />

          <div class="hidden lg:grid lg:gap-2">
            <Skeleton width="5rem" height="1.5rem" />
            <Skeleton width="5rem" height="0.8rem" />
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
