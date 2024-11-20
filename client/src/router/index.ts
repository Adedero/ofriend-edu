import { createRouter, createWebHistory } from 'vue-router';

import authLayout from '@/modules/auth/auth-layout.vue';
import authRoutes from '@/modules/auth/routes';

import dashboardLayout from '@/modules/dashboard/dashboard-layout.vue';
import dashboardRoutes from '@/modules/dashboard/routes';

import AppLayout from '@/layouts/AppLayout.vue';

import ContentReelChatLayout from '@/layouts/ContentReelChatLayout.vue';

import ContentReelLayout from '@/modules/content-reel/content-reel-layout.vue';
import contentReelRoutes from '@/modules/content-reel/routes';

import ChatLayout from '@/modules/chat/chat-layout.vue';



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: authLayout,
      children: authRoutes
    },
    {
      path: '/app/:user_id',
      component: AppLayout,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'dashboard',
          component: dashboardLayout,
          children: dashboardRoutes,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: 'social',
          component: ContentReelChatLayout,
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: '',
              component: ContentReelLayout,
              children: contentReelRoutes
            },
            {
              path: 'chat',
              component: ChatLayout
            }
          ]
        }
      ]
    }
  ],
})

export default router
