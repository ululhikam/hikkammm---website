import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'
import BuildingDetailView from '@/views/BuildingDetailView.vue'

export default createRouter({
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
  ],
})
