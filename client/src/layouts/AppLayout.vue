<script setup lang="ts">
import useUserStore from '@/stores/user.store';
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();
//Set authenticated user
onBeforeMount(() => {
  userStore.setUser(route.params.user_id as string);
  if (!userStore.user) {
    router.push({ name: 'sign-in' });
  }
});

//Set up push notifications
/* 
import { onBeforeMount, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import socket from '@/config/socket.config';
import { useUserStore } from '@/stores/user';
import { useToast } from "primevue/usetoast";
import { initializePushNotifications } from "@/services/push-notification";

onMounted(async () => {
  await initializePushNotifications(userStore.user, router, toast);

  !socket.connected && socket.connect();

  socket.on('connect', () => {
    console.log('Connected to socket server');
    socket.emit('online', userStore.user.id);
  });
});

onUnmounted(() => {
  socket.emit('offline', userStore.user.id);
  socket.disconnect();
}) */
</script>

<template>
  <RouterView />
</template>
