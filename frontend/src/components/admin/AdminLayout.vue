<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  Award,
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  UserRound,
  X,
} from 'lucide-vue-next'
import { clearAdminToken } from '@/lib/auth'
import AdminToastHost from './AdminToastHost.vue'

interface AdminLink {
  name: string
  label: string
  icon: Component
}

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const links: AdminLink[] = [
  { name: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { name: 'admin-projects', label: 'Projects', icon: FolderKanban },
  { name: 'admin-buildings', label: 'Buildings', icon: Building2 },
  { name: 'admin-experiences', label: 'Experiences', icon: BriefcaseBusiness },
  { name: 'admin-awards', label: 'Awards', icon: Award },
  { name: 'admin-profile', label: 'Profile', icon: UserRound },
  { name: 'admin-messages', label: 'Messages', icon: Mail },
]

const pageTitle = computed(() => (route.meta.title as string | undefined) ?? 'Admin')

function isActive(name: string): boolean {
  return route.name === name
}

function logout(): void {
  clearAdminToken()
  sidebarOpen.value = false
  void router.push({ name: 'admin-login' })
}

function onUnauthorized(): void {
  sidebarOpen.value = false
  void router.push({ name: 'admin-login', query: { reason: 'expired' } })
}

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)

onMounted(() => {
  window.addEventListener('admin-unauthorized', onUnauthorized)
})

onBeforeUnmount(() => {
  window.removeEventListener('admin-unauthorized', onUnauthorized)
})
</script>

<template>
  <div class="min-h-screen bg-[#070707] text-white">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0b0b0b] transition-transform duration-300 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <RouterLink :to="{ name: 'admin-dashboard' }" class="flex items-center gap-3">
          <img src="/favicon_hikam.webp" alt="Hikkammm" class="h-8 w-auto" />
          <div>
            <p class="text-sm font-semibold tracking-wide">Hikkammm</p>
            <p class="text-[0.65rem] uppercase tracking-[0.2em] text-white/35">Admin Panel</p>
          </div>
        </RouterLink>
        <button
          type="button"
          class="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Tutup menu"
          @click="sidebarOpen = false"
        >
          <X :size="18" />
        </button>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name }"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
          :class="
            isActive(link.name)
              ? 'bg-white text-black'
              : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
          "
        >
          <component :is="link.icon" :size="17" />
          <span>{{ link.label }}</span>
        </RouterLink>
      </nav>

      <div class="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white"
        >
          <ExternalLink :size="17" />
          Lihat website
        </a>
        <button
          type="button"
          class="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-red-500/10 hover:text-red-300"
          @click="logout"
        >
          <LogOut :size="17" />
          Logout
        </button>
      </div>
    </aside>

    <div class="min-h-screen lg:pl-72">
      <header class="sticky top-0 z-30 border-b border-white/10 bg-[#070707]/85 backdrop-blur-xl">
        <div class="flex items-center gap-3 px-4 py-4 md:px-6">
          <button
            type="button"
            class="rounded-lg border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Buka menu"
            @click="sidebarOpen = true"
          >
            <Menu :size="18" />
          </button>
          <div class="min-w-0 flex-1">
            <p class="text-[0.65rem] uppercase tracking-[0.22em] text-white/35">Admin</p>
            <h1 class="truncate text-lg font-semibold text-white">{{ pageTitle }}</h1>
          </div>
          <span class="hidden rounded-full border border-white/10 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.16em] text-white/40 sm:inline-flex">
            Bearer auth
          </span>
        </div>
      </header>

      <main class="px-4 py-6 md:px-6 md:py-8">
        <RouterView />
      </main>
    </div>

    <AdminToastHost />
  </div>
</template>