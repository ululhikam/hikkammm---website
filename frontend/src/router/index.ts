import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'
import BuildingDetailView from '@/views/BuildingDetailView.vue'
import { isAdminAuthenticated } from '@/lib/auth'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'public' | 'admin'
    requiresAuth?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/projects/:slug', name: 'project-detail', component: ProjectDetailView },
    { path: '/building/:slug', name: 'building-detail', component: BuildingDetailView },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginView.vue'),
      meta: { layout: 'admin', title: 'Login Admin' },
    },
    {
      path: '/admin',
      component: () => import('@/components/admin/AdminLayout.vue'),
      meta: { layout: 'admin', requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('@/views/admin/AdminProjectsView.vue'),
          meta: { title: 'Projects' },
        },
        {
          path: 'buildings',
          name: 'admin-buildings',
          component: () => import('@/views/admin/AdminBuildingsView.vue'),
          meta: { title: 'Buildings' },
        },
        {
          path: 'experiences',
          name: 'admin-experiences',
          component: () => import('@/views/admin/AdminExperiencesView.vue'),
          meta: { title: 'Experiences' },
        },
        {
          path: 'awards',
          name: 'admin-awards',
          component: () => import('@/views/admin/AdminAwardsView.vue'),
          meta: { title: 'Awards' },
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('@/views/admin/AdminProfileView.vue'),
          meta: { title: 'Profile' },
        },
        {
          path: 'messages',
          name: 'admin-messages',
          component: () => import('@/views/admin/AdminMessagesView.vue'),
          meta: { title: 'Messages' },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAdminAuthenticated()) {
    return {
      name: 'admin-login',
      query: { redirect: to.fullPath },
    }
  }

  if (to.name === 'admin-login' && isAdminAuthenticated()) {
    return { name: 'admin-dashboard' }
  }

  return true
})

export default router