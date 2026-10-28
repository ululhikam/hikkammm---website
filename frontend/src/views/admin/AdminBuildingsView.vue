<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ExternalLink, Loader2, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { getAdminToken } from '@/lib/auth'
import { nullableUrl, slugify } from '@/lib/slug'
import type { Building, BuildingInput } from '@/lib/types'
import { useAdminToast } from '@/composables/useAdminToast'
import { usePaginatedList } from '@/composables/usePaginatedList'
import AdminField from '@/components/admin/AdminField.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'

const token = getAdminToken() ?? ''
const toast = useAdminToast()

const modalOpen = ref(false)
const editingSlug = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')
const form = ref<BuildingInput>(emptyBuilding())

const { items, meta, loading, error, page, totalPages, load, next, prev } =
  usePaginatedList<Building>((query) => api.listBuildings(query))

function emptyBuilding(): BuildingInput {
  return {
    slug: '',
    title: '',
    tagline: '',
    description: '',
    detail: '',
    linkUrl: null,
    sortOrder: 0,
  }
}

function openCreate(): void {
  editingSlug.value = null
  form.value = emptyBuilding()
  formError.value = ''
  modalOpen.value = true
}

function openEdit(building: Building): void {
  editingSlug.value = building.slug
  form.value = {
    slug: building.slug,
    title: building.title,
    tagline: building.tagline,
    description: building.description,
    detail: building.detail,
    linkUrl: building.linkUrl,
    sortOrder: building.sortOrder,
  }
  formError.value = ''
  modalOpen.value = true
}

function onTitleInput(): void {
  if (!editingSlug.value) {
    form.value.slug = slugify(form.value.title)
  }
}

function payloadFromForm(): BuildingInput {
  return {
    ...form.value,
    slug: form.value.slug.trim() || slugify(form.value.title),
    title: form.value.title.trim(),
    tagline: form.value.tagline.trim(),
    description: form.value.description.trim(),
    detail: form.value.detail.trim(),
    linkUrl: nullableUrl(form.value.linkUrl),
  }
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''

  try {
    const payload = payloadFromForm()

    if (!payload.title) throw new Error('Judul building wajib diisi.')
    if (!payload.slug) throw new Error('Slug building wajib diisi.')

    if (editingSlug.value) {
      await api.updateBuilding(token, editingSlug.value, payload)
      toast.success('Building berhasil diperbarui.')
    } else {
      await api.createBuilding(token, payload)
      toast.success('Building baru berhasil ditambahkan.')
    }

    modalOpen.value = false
    await load()
  } catch (caught) {
    formError.value = caught instanceof Error ? caught.message : 'Gagal menyimpan building.'
    toast.error(formError.value)
  } finally {
    saving.value = false
  }
}

async function remove(building: Building): Promise<void> {
  if (!window.confirm(`Hapus building "${building.title}"? Tindakan ini tidak bisa dibatalkan.`)) {
    return
  }

  try {
    await api.deleteBuilding(token, building.slug)
    if (items.value.length === 1 && page.value > 1) page.value -= 1
    await load()
    toast.success('Building dihapus.')
  } catch (caught) {
    toast.error(caught instanceof Error ? caught.message : 'Gagal menghapus building.')
  }
}

onMounted(load)
</script>

<template>
  <div>
    <AdminPageHeader
      title="Buildings"
      description="Kelola produk, bisnis, atau hal yang sedang kamu bangun."
    >
      <button type="button" class="admin-btn-primary" @click="openCreate">
        <Plus :size="16" />
        Building baru
      </button>
      <button type="button" class="admin-btn" :disabled="loading" @click="load">
        <RefreshCw :size="15" :class="loading ? 'animate-spin' : ''" />
      </button>
    </AdminPageHeader>

    <p v-if="error" class="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {{ error }}
    </p>

    <div class="admin-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Building</th>
              <th>Tagline</th>
              <th>Link</th>
              <th>Urutan</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="building in items" :key="building.id">
              <td>
                <p class="font-medium text-white">{{ building.title }}</p>
                <p class="mt-0.5 text-[0.7rem] text-white/30">/{{ building.slug }}</p>
              </td>
              <td class="max-w-sm">
                <p class="truncate text-white/55">{{ building.tagline || '—' }}</p>
              </td>
              <td>
                <a
                  v-if="building.linkUrl"
                  :href="building.linkUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1 text-xs text-sky-300 hover:text-sky-200"
                >
                  Buka
                  <ExternalLink :size="12" />
                </a>
                <span v-else class="text-white/20">—</span>
              </td>
              <td class="text-white/45">{{ building.sortOrder }}</td>
              <td>
                <div class="flex items-center justify-end gap-1">
                  <button type="button" class="admin-btn-ghost" title="Edit" @click="openEdit(building)">
                    <Pencil :size="15" />
                  </button>
                  <button
                    type="button"
                    class="admin-btn-ghost text-red-300/70 hover:text-red-300"
                    title="Hapus"
                    @click="remove(building)"
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
        <div v-for="index in 4" :key="index" class="h-14 animate-pulse rounded-xl bg-white/[0.04]" />
      </div>

      <div v-else-if="!loading && items.length === 0" class="px-4 py-16 text-center">
        <p class="text-sm text-white/40">Belum ada building.</p>
        <button type="button" class="admin-btn mt-4" @click="openCreate">
          <Plus :size="15" />
          Tambah building pertama
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
      :title="editingSlug ? 'Edit building' : 'Building baru'"
      description="Konten ini tampil di bagian Building pada homepage."
      @close="modalOpen = false"
    >
      <form id="building-form" class="space-y-4" @submit.prevent="submit">
        <p v-if="formError" class="rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-3 text-xs leading-relaxed text-red-200">
          {{ formError }}
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <AdminField label="Judul" required>
            <input v-model="form.title" class="admin-input" placeholder="Nama building" @input="onTitleInput" />
          </AdminField>
          <AdminField label="Slug" required>
            <input v-model="form.slug" class="admin-input" placeholder="nama-building" />
          </AdminField>
        </div>

        <AdminField label="Tagline">
          <input v-model="form.tagline" class="admin-input" placeholder="Satu kalimat singkat" />
        </AdminField>

        <AdminField label="Deskripsi">
          <textarea v-model="form.description" class="admin-input admin-textarea" rows="3" />
        </AdminField>

        <AdminField label="Detail">
          <textarea v-model="form.detail" class="admin-input admin-textarea" rows="6" />
        </AdminField>

        <div class="grid gap-4 sm:grid-cols-2">
          <AdminField label="Link URL">
            <input v-model="form.linkUrl" class="admin-input" placeholder="https://..." />
          </AdminField>
          <AdminField label="Urutan tampil">
            <input v-model.number="form.sortOrder" type="number" class="admin-input" />
          </AdminField>
        </div>
      </form>

      <template #footer>
        <button type="button" class="admin-btn-ghost" @click="modalOpen = false">Batal</button>
        <button type="submit" form="building-form" class="admin-btn-primary" :disabled="saving">
          <Loader2 v-if="saving" :size="15" class="animate-spin" />
          {{ saving ? 'Menyimpan...' : editingSlug ? 'Simpan perubahan' : 'Tambah building' }}
        </button>
      </template>
    </AdminModal>
  </div>
</template>