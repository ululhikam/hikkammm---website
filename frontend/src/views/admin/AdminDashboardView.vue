<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
  Award,
  BriefcaseBusiness,
  Building2,
  FolderKanban,
  Mail,
  RefreshCw,
  Server,
} from 'lucide-vue-next'
import { api } from '@/lib/api'
import { getAdminToken } from '@/lib/auth'
import type { ContactMessage, ContactStatus, Health } from '@/lib/types'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'

const token = getAdminToken() ?? ''
const loading = ref(true)
const error = ref('')
const recentMessages = ref<ContactMessage[]>([])
const health = ref<Health | null>(null)

const stats = reactive({
  projects: 0,
  buildings: 0,
  experiences: 0,
  awards: 0,
  newMessages: 0,
})

const cards = [
  { key: 'projects', label: 'Projects', icon: FolderKanban, to: '/admin/projects', tone: 'text-sky-300' },
  { key: 'buildings', label: 'Buildings', icon: Building2, to: '/admin/buildings', tone: 'text-emerald-300' },
  { key: 'experiences', label: 'Experiences', icon: BriefcaseBusiness, to: '/admin/experiences', tone: 'text-amber-300' },
  { key: 'awards', label: 'Awards', icon: Award, to: '/admin/awards', tone: 'text-fuchsia-300' },
  { key: 'newMessages', label: 'Pesan baru', icon: Mail, to: '/admin/messages', tone: 'text-red-300' },
] as const

function contactTone(status: ContactStatus): 'warning' | 'info' | 'neutral' {
  if (status === 'new') return 'warning'
  if (status === 'read') return 'info'
  return 'neutral'
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function load(): Promise<void> {
  loading.value = true
  error.value = ''

  try {
    const [projects, buildings, experiences, awards, newMessages, messages, healthResult] =
      await Promise.all([
        api.listProjects({ limit: 1 }),
        api.listBuildings({ limit: 1 }),
        api.listExperiences({ limit: 1 }),
        api.listAwards({ limit: 1 }),
        api.listContactMessages(token, { limit: 1, status: 'new' }),
        api.listContactMessages(token, { limit: 5 }),
        api.health(),
      ])

    stats.projects = projects.meta.total
    stats.buildings = buildings.meta.total
    stats.experiences = experiences.meta.total
    stats.awards = awards.meta.total
    stats.newMessages = newMessages.meta.total
    recentMessages.value = messages.data
    health.value = healthResult
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Gagal memuat dashboard.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <AdminPageHeader
      title="Dashboard"
      description="Ringkasan konten portfolio dan aktivitas pesan terbaru."
    >
      <button type="button" class="admin-btn" :disabled="loading" @click="load">
        <RefreshCw :size="15" :class="loading ? 'animate-spin' : ''" />
        Refresh
      </button>
    </AdminPageHeader>

    <p v-if="error" class="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {{ error }}
    </p>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <RouterLink
        v-for="card in cards"
        :key="card.key"
        :to="card.to"
        class="admin-card group p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <component :is="card.icon" :size="17" :class="card.tone" />
          </div>
          <span class="text-[0.62rem] uppercase tracking-[0.16em] text-white/30">Total</span>
        </div>
        <p class="mt-6 text-3xl font-semibold tracking-tight text-white">
          {{ loading ? '—' : stats[card.key] }}
        </p>
        <p class="mt-1 text-xs text-white/40">{{ card.label }}</p>
      </RouterLink>
    </div>

    <div class="mt-5 grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <section class="admin-card overflow-hidden">
        <div class="flex items-center justify-between border-b border-white/10 px-4 py-3.5">
          <div>
            <h3 class="text-sm font-semibold text-white">Pesan terbaru</h3>
            <p class="text-[0.7rem] text-white/35">5 pesan terakhir dari form kontak.</p>
          </div>
          <RouterLink :to="{ name: 'admin-messages' }" class="text-xs text-white/45 hover:text-white">
            Lihat semua
          </RouterLink>
        </div>

        <div v-if="loading" class="space-y-3 p-4">
          <div v-for="index in 4" :key="index" class="h-14 animate-pulse rounded-xl bg-white/[0.04]" />
        </div>

        <div v-else-if="recentMessages.length === 0" class="px-4 py-12 text-center text-sm text-white/35">
          Belum ada pesan masuk.
        </div>

        <ul v-else class="divide-y divide-white/5">
          <li v-for="message in recentMessages" :key="message.id" class="px-4 py-3.5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-white">{{ message.subject }}</p>
                <p class="mt-0.5 truncate text-xs text-white/35">
                  {{ message.name }} · {{ message.email }}
                </p>
              </div>
              <AdminBadge
                :label="message.status"
                :tone="contactTone(message.status)"
                class="shrink-0"
              />
            </div>
            <p class="mt-1 text-[0.7rem] text-white/25">{{ formatDate(message.createdAt) }}</p>
          </li>
        </ul>
      </section>

      <section class="admin-card p-4">
        <div class="flex items-center gap-3">
          <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Server :size="17" class="text-white/60" />
          </div>
          <div>
            <h3 class="text-sm font-semibold text-white">Status API</h3>
            <p class="text-[0.7rem] text-white/35">Koneksi ke backend production.</p>
          </div>
        </div>

        <dl class="mt-6 space-y-3 text-sm">
          <div class="flex items-center justify-between gap-3">
            <dt class="text-white/40">API</dt>
            <dd>
              <AdminBadge
                v-if="health"
                :label="health.status"
                :tone="health.status === 'ok' ? 'success' : 'danger'"
              />
              <span v-else class="text-white/30">—</span>
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-white/40">Database</dt>
            <dd>
              <AdminBadge
                v-if="health"
                :label="health.database"
                :tone="health.database === 'ok' ? 'success' : 'danger'"
              />
              <span v-else class="text-white/30">—</span>
            </dd>
          </div>
          <div class="flex items-center justify-between gap-3">
            <dt class="text-white/40">Versi</dt>
            <dd class="text-xs text-white/55">{{ health?.version ?? '—' }}</dd>
          </div>
        </dl>

        <RouterLink
          :to="{ name: 'admin-profile' }"
          class="admin-btn mt-6 w-full justify-center"
        >
          Edit profil
        </RouterLink>
      </section>
    </div>
  </div>
</template>