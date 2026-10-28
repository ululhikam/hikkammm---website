<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
} from 'lucide-vue-next'
import { api } from '@/lib/api'
import { getAdminToken } from '@/lib/auth'
import { nullableUrl, slugify } from '@/lib/slug'
import type { Project, ProjectInput, ProjectStatus } from '@/lib/types'
import { useAdminToast } from '@/composables/useAdminToast'
import { usePaginatedList } from '@/composables/usePaginatedList'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'

const token = getAdminToken() ?? ''
const toast = useAdminToast()

const search = ref('')
const statusFilter = ref<ProjectStatus | ''>('')
const modalOpen = ref(false)
const editingSlug = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')
const techText = ref('')
const form = ref<ProjectInput>(emptyProject())

const statusOptions: Array<{ value: ProjectStatus; label: string }> = [
  { value: 'live', label: 'Live' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'concept', label: 'Concept' },
  { value: 'archived', label: 'Archived' },
]

const { items, meta, loading, error, page, totalPages, load, next, prev, reset } =
  usePaginatedList<Project>((query) =>
    api.listProjects({
      ...query,
      q: search.value || undefined,
      status: statusFilter.value || undefined,
    }),
  )

function emptyProject(): ProjectInput {
  return {
    slug: '',
    title: '',
    category: 'Web App',
    tech: [],
    year: new Date().getFullYear().toString(),
    status: 'in-progress',
    description: '',
    fullDescription: '',
    imageUrl: '',
    repoUrl: null,
    liveUrl: null,
    featured: false,
    sortOrder: 0,
  }
}

function statusTone(status: ProjectStatus): 'success' | 'warning' | 'info' | 'neutral' {
  if (status === 'live') return 'success'
  if (status === 'in-progress') return 'warning'
  if (status === 'concept') return 'info'
  return 'neutral'
}

function statusLabel(status: ProjectStatus): string {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}

function openCreate(): void {
  editingSlug.value = null
  form.value = emptyProject()
  techText.value = ''
  formError.value = ''
  modalOpen.value = true
}

function openEdit(project: Project): void {
  editingSlug.value = project.slug
  form.value = {
    slug: project.slug,
    title: project.title,
    category: project.category,
    tech: [...project.tech],
    year: project.year,
    status: project.status,
    description: project.description,
    fullDescription: project.fullDescription,
    imageUrl: project.imageUrl,
    repoUrl: project.repoUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
    sortOrder: project.sortOrder,
  }
  techText.value = project.tech.join(', ')
  formError.value = ''
  modalOpen.value = true
}

function onTitleInput(): void {
  if (!editingSlug.value) {
    form.value.slug = slugify(form.value.title)
  }
}

function payloadFromForm(): ProjectInput {
  return {
    ...form.value,
    slug: form.value.slug.trim() || slugify(form.value.title),
    title: form.value.title.trim(),
    category: form.value.category.trim(),
    year: form.value.year.trim(),
    description: form.value.description.trim(),
    fullDescription: form.value.fullDescription.trim(),
    imageUrl: form.value.imageUrl.trim(),
    tech: techText.value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    repoUrl: nullableUrl(form.value.repoUrl),
    liveUrl: nullableUrl(form.value.liveUrl),
  }
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''

  try {
    const payload = payloadFromForm()

    if (!payload.title) throw new Error('Judul project wajib diisi.')
    if (!payload.slug) throw new Error('Slug project wajib diisi.')
    if (!payload.description) throw new Error('Deskripsi singkat wajib diisi.')

    if (editingSlug.value) {
      await api.updateProject(token, editingSlug.value, payload)
      toast.success('Project berhasil diperbarui.')
    } else {
      await api.createProject(token, payload)
      toast.success('Project baru berhasil ditambahkan.')
    }

    modalOpen.value = false
    await load()
  } catch (caught) {
    formError.value = caught instanceof Error ? caught.message : 'Gagal menyimpan project.'
    toast.error(formError.value)
  } finally {
    saving.value = false
  }
}

async function remove(project: Project): Promise<void> {
  if (!window.confirm(`Hapus project "${project.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
    return
  }

  try {
    await api.deleteProject(token, project.slug)
    if (items.value.length === 1 && page.value > 1) page.value -= 1
    await load()
    toast.success('Project dihapus.')
  } catch (caught) {
    toast.error(caught instanceof Error ? caught.message : 'Gagal menghapus project.')
  }
}

let searchTimer: number | undefined

watch(search, () => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    void reset()
  }, 300)
})

watch(statusFilter, () => {
  void reset()
})

onMounted(load)

onBeforeUnmount(() => {
  window.clearTimeout(searchTimer)
})
</script>

<template>
  <div>
    <AdminPageHeader
      title="Projects"
      description="Kelola project portfolio, status, teknologi, dan tautan yang tampil di website."
    >
      <button type="button" class="admin-btn-primary" @click="openCreate">
        <Plus :size="16" />
        Project baru
      </button>
    </AdminPageHeader>

    <div class="admin-card mb-4 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <Search :size="15" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          v-model="search"
          class="admin-input pl-9"
          placeholder="Cari judul atau deskripsi project..."
        />
      </div>
      <select v-model="statusFilter" class="admin-input admin-select sm:w-48">
        <option value="">Semua status</option>
        <option v-for="option in statusOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <button type="button" class="admin-btn" :disabled="loading" @click="load">
        <RefreshCw :size="15" :class="loading ? 'animate-spin' : ''" />
        Refresh
      </button>
    </div>

    <p v-if="error" class="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {{ error }}
    </p>

    <div class="admin-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Urutan</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in items" :key="project.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="h-11 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                    <img
                      v-if="project.imageUrl"
                      :src="project.imageUrl"
                      :alt="project.title"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="max-w-xs truncate font-medium text-white">{{ project.title }}</p>
                    <p class="mt-0.5 truncate text-[0.7rem] text-white/30">/{{ project.slug }}</p>
                    <p v-if="project.tech.length" class="mt-1 truncate text-[0.67rem] text-white/30">
                      {{ project.tech.join(' · ') }}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-white/70">{{ project.category }}</p>
                <p class="mt-0.5 text-[0.7rem] text-white/30">{{ project.year }}</p>
              </td>
              <td>
                <AdminBadge :label="statusLabel(project.status)" :tone="statusTone(project.status)" />
              </td>
              <td>
                <Star
                  :size="16"
                  :class="project.featured ? 'fill-amber-300 text-amber-300' : 'text-white/20'"
                />
              </td>
              <td class="text-white/45">{{ project.sortOrder }}</td>
              <td>
                <div class="flex items-center justify-end gap-1">
                  <a
                    v-if="project.liveUrl"
                    :href="project.liveUrl"
                    target="_blank"
                    rel="noreferrer"
                    class="admin-btn-ghost"
                    title="Buka live URL"
                  >
                    <ExternalLink :size="15" />
                  </a>
                  <button type="button" class="admin-btn-ghost" title="Edit" @click="openEdit(project)">
                    <Pencil :size="15" />
                  </button>
                  <button
                    type="button"
                    class="admin-btn-ghost text-red-300/70 hover:text-red-300"
                    title="Hapus"
                    @click="remove(project)"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="loading && items.length === 0" class="space-y-3 p-4">
        <div v-for="index in 5" :key="index" class="h-14 animate-pulse rounded-xl bg-white/[0.04]" />
      </div>

      <div v-else-if="!loading && items.length === 0" class="px-4 py-16 text-center">
        <p class="text-sm text-white/40">Belum ada project yang cocok.</p>
        <button type="button" class="admin-btn mt-4" @click="openCreate">
          <Plus :size="15" />
          Tambah project pertama
        </button>
      </div>

      <AdminPagination
        :page="page"
        :total-pages="totalPages"
        :total="meta.total"
        :loading="loading"
        @prev="prev"
        @next="next"
      />
    </div>

    <AdminModal
      :open="modalOpen"
      :title="editingSlug ? 'Edit project' : 'Project baru'"
      description="Perubahan langsung tersimpan ke Supabase setelah disimpan."
      wide
      @close="modalOpen = false"
    >
      <form id="project-form" class="space-y-4" @submit.prevent="submit">
        <p v-if="formError" class="rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-3 text-xs leading-relaxed text-red-200">
          {{ formError }}
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <AdminField label="Judul" required>
            <input v-model="form.title" class="admin-input" placeholder="Nama project" @input="onTitleInput" />
          </AdminField>
          <AdminField label="Slug" required hint="Dipakai di URL /projects/:slug">
            <input v-model="form.slug" class="admin-input" placeholder="nama-project" />
          </AdminField>
          <AdminField label="Kategori" required>
            <input v-model="form.category" class="admin-input" placeholder="Web App" />
          </AdminField>
          <AdminField label="Tahun" required>
            <input v-model="form.year" class="admin-input" placeholder="2026" />
          </AdminField>
          <AdminField label="Status">
            <select v-model="form.status" class="admin-input admin-select">
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </AdminField>
          <AdminField label="Urutan tampil" hint="Angka kecil tampil lebih dulu">
            <input v-model.number="form.sortOrder" type="number" class="admin-input" />
          </AdminField>
        </div>

        <AdminField label="Tech stack" hint="Pisahkan dengan koma, contoh: Vue, TypeScript, Supabase">
          <input v-model="techText" class="admin-input" placeholder="Vue, TypeScript, Supabase" />
        </AdminField>

        <AdminField label="Deskripsi singkat" required>
          <textarea v-model="form.description" class="admin-input admin-textarea" rows="3" />
        </AdminField>

        <AdminField label="Deskripsi lengkap">
          <textarea v-model="form.fullDescription" class="admin-input admin-textarea" rows="5" />
        </AdminField>

        <AdminField label="URL gambar" hint="Kosongkan jika belum ada gambar.">
          <input v-model="form.imageUrl" class="admin-input" placeholder="https://..." />
        </AdminField>

        <div
          v-if="form.imageUrl"
          class="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
        >
          <img :src="form.imageUrl" alt="Preview" class="h-40 w-full object-cover" />
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <AdminField label="Repo URL">
            <input v-model="form.repoUrl" class="admin-input" placeholder="https://github.com/..." />
          </AdminField>
          <AdminField label="Live URL">
            <input v-model="form.liveUrl" class="admin-input" placeholder="https://..." />
          </AdminField>
        </div>

        <label class="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-white/65">
          <input v-model="form.featured" type="checkbox" class="h-4 w-4 accent-white" />
          Tampilkan sebagai project unggulan
        </label>
      </form>

      <template #footer>
        <button type="button" class="admin-btn-ghost" @click="modalOpen = false">Batal</button>
        <button type="submit" form="project-form" class="admin-btn-primary" :disabled="saving">
          <Loader2 v-if="saving" :size="15" class="animate-spin" />
          {{ saving ? 'Menyimpan...' : editingSlug ? 'Simpan perubahan' : 'Tambah project' }}
        </button>
      </template>
    </AdminModal>
  </div>
</template>