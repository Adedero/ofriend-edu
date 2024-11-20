const dashboardRoutes = [
  {
    path: '',
    name: 'dashboard',
    component: () => import('./views/DashboardView.vue'),
  }
];

export default dashboardRoutes;
