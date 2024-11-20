const contentReelRoutes = [
  {
    path: '',
    name: 'content-reel',
    component: () => import('./views/ReelsView.vue')
  },
  {
    path: 'post/:post_id',
    name: 'post',
    component: () => import('./views/PostView.vue')
  },
  {
    path: 'saved-posts',
    name: 'saved-posts',
    component: () => import('./views/SavedPostsView.vue')
  },
  {
    path: 'profile',
    name: 'user-social-profile',
    component: () => import('./views/UserSocialProfileView.vue')
  },
  {
    path: 'profile-editor',
    name: 'social-profile-editor',
    component: () => import('./views/EditSocialProfileView.vue')
  },
  {
    path: 'notifications',
    name: 'reel-notifications',
    component: () => import('./views/ReelNotificationsView.vue')
  }
]

export default contentReelRoutes;