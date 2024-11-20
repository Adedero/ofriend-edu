<script setup lang="ts">
import useDate from '@/composables/use-date';
import useUserStore from '@/stores/user.store';
import links from '../../data/links';
import utils from '@/utils';
import { computed, ref } from 'vue';

interface Props {
  minimized?: boolean;
}
const { minimized = false } = defineProps<Props>();

const userStore = useUserStore();

const socialNavClasses = computed(() => ({
  'lg:w-full': !minimized,
}));

const menu = ref()
const items = ref([
  {
    label: 'Profile',
    items: [
      { label: userStore.user?.name, icon: 'pi pi-user' },
      { label: 'Joined ' + useDate(userStore.user?.createdAt).formatDate(), icon: 'pi pi-calendar-clock' },
      { label: userStore.user?.bio ? userStore.user.bio.slice(0, 20) + '...' : '', icon: 'pi pi-info-circle' }
    ]
  }
])

const toggle = (event: Event) => {
  menu.value.toggle(event)
}
</script>

<template>
  <div class="h-full flex flex-col items-center *:flex-shrink-0">
    <div class="flex flex-col items-center *:flex-shrink-0 gap-2">
      <MyAvatar :user="userStore.user" icon-class="aspect-square w-16"
        avatar-class="aspect-square h-16 w-16 bg-turquoise text-white text-3xl" />

      <div class="hidden" :class="{ 'lg:flex lg:flex-col lg:items-center': !minimized }">
        <h3 class="font-semibold">{{ userStore.user?.name }}</h3>
        <p class="text-slate-600 text-sm">Joined {{ useDate(userStore.user?.createdAt).formatDate() }}</p>
        <p class="mt-2 text-sm font-medium truncated">{{ userStore.user?.bio }}</p>
      </div>
    </div>

    <div class="mt-2" :class="{ 'lg:hidden': !minimized }">
      <Button type="button" icon="pi pi-user" @click="toggle" rounded severity="secondary"/>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>

    <Divider />

    <div class="grid gap-1" :class="socialNavClasses">
      <RouterLink v-for="link in links" :key="link.name" :to="link.path"
        :class="['social-nav', minimized ? 'minimized' : 'maximized']">
        <span :class="[link.icon]"></span>
        <span class="hidden text-sm" :class="{ 'lg:inline': !minimized }">{{ link.name }}</span>
      </RouterLink>
    </div>

    <div v-if="!minimized" class="mt-auto px-2" :class="socialNavClasses">
      <Button @click="utils.signout($router, $route.fullPath)" label="Sign out" icon="pi pi-sign-out" icon-pos="right"
        class="hidden lg:w-full lg:flex" />
      <Button @click="utils.signout($router, $route.fullPath)" icon="pi pi-sign-out" icon-pos="right" size="large"
        class="w-12 lg:hidden " />
    </div>
    <div v-else class="mt-auto px-2" :class="socialNavClasses">
      <Button @click="utils.signout($router, $route.fullPath)" icon="pi pi-sign-out" icon-pos="right" size="large" class="w-12" />
    </div>
  </div>
</template>

<style scoped>
a.social-nav {
  @apply flex items-center gap-4 p-5 rounded-lg transition-colors hover:bg-turquoise/10;
}

a.social-nav.maximized.router-link-exact-active {
  @apply bg-turquoise/10 font-semibold text-primary relative lg:before:absolute lg:before:content-[''] lg:before:w-2 lg:before:h-full lg:before:left-0 lg:before:bg-turquoise;
}

a.social-nav.minimized.router-link-exact-active {
  @apply bg-turquoise/10 font-semibold text-primary relative;
}

.truncated {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
