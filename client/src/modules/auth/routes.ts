const authRoutes = [
  {
    path: '',
    name: 'sign-in',
    component: () => import('./views/SigninView.vue'),
  },
  {
    path: 'register',
    name: 'sign-up',
    component: () => import('./views/SignUpView.vue')
  },
  {
    path: 'otp-verification',
    name: 'otp-verification',
    component: () => import('./views/OtpView.vue')
  }
];

export default authRoutes;
