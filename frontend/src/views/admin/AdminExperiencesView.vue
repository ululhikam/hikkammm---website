<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loader2, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { getAdminToken } from '@/lib/auth'
import type { Experience, ExperienceInput, ExperienceType } from '@/lib/types'
import { useAdminToast } from '@/composables/useAdminToast'
import { usePaginatedList } from '@/composables/usePaginatedList'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import AdminField from '@/components/admin/AdminField.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'

interface ExperienceForm {
  organization: string
  title: string
  description: string
  startYear: string
  endYear: string
  type: ExperienceType
  sortOrder: number
}

const token = getAdminToken() ?? ''
const toast = useAdminToast()

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')
const form = ref<ExperienceForm>(emptyExperience())

const typeOptions: Array<{ value: ExperienceType; label: string }> = [
  { value: 'work', label: 'Work' },
  { value: 'organization', label: 'Organization' },
  { value: 'education', label: 'Education' },
  { value: 'volunteer', label: 'Volunteer' },
]

const { items, meta, loading, error, page, totalPages, load, next, prev } =
  usePaginatedList<Experience>((query) => api.listExperiences(query))

function emptyExperience(): ExperienceForm {
  return {
    organization: '',
    title: '',
    description: '',
    startYear: '',
    endYear: '',
    type: 'organization',
    sortOrder: 0,
  }
}

function typeLabel(type: ExperienceType): string {
  return typeOptions.find((option) => option.value === type)?.label ?? type
}

function typeTone(type: ExperienceType): 'info' | 'success' | 'warning' | 'neutral' {
  if (type === 'work') return 'success'
  if (type === 'organization') return 'info'
  if (type === 'education') return 'warning'
  return 'neutral'
}

function formatPeriod(startYear: number | null, endYear: number | null): string {
  if (!startYear && !endYear) return '—'
  return `${startYear ?? '?'} — ${endYear ?? 'Sekarang'}`
}

function parseYear(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

function openCreate(): void {
  editingId.value = null
  form.value = emptyExperience()
  formError.value = ''
  modalOpen.value = true
}

function openEdit(experience: Experience): void {
  editingId.value = experience.id
  form.value = {
    organization: experience.organization,
    title: experience.title,
    description: experience.description,
    startYear: experience.startYear?.toString() ?? '',
    endYear: experience.endYear?.toString() ?? '',
    type: experience.type,
    sortOrder: experience.sortOrder,
  }
  formError.value = ''
  modalOpen.value = true
}

function payloadFromForm(): ExperienceInput {
  return {
    organization: form.value.organization.trim(),
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    startYear: parseYear(form.value.startYear),
    endYear: parseYear(form.value.endYear),
    type: form.value.type,
    sortOrder: form.value.sortOrder,
  }
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''

  try {
    const payload = payloadFromForm()

    if (!payload.organization) throw new Error('Organisasi wajib diisi.')
    if (!payload.title) throw new Error('Posisi wajib diisi.')

    if (editingId.value) {
      await api.updateExperience(token, editingId.value, payload)
      toast.success('Experience berhasil diperbarui.')
    } else {
      await api.createExperience(token, payload)
      toast.success('Experience baru berhasil ditambahkan.')
    }

    modalOpen.value = false
    await load()
  } catch (caught) {
    formError.value = caught instanceof Error ? caught.message : 'Gagal menyimpan experience.'
    toast.error(formError.value)
  } finally {
    saving.value = false
  }
}

async function remove(experience: Experience): Promise<void> {
  if (!window.confirm(`Hapus experience "${experience.title}" di ${experience.organization}?`)) {
    return
  }

  try {
    await api.deleteExperience(token, experience.id)
    if (items.value.length === 1 && page.value > 1) page.value -= 1
    await load()
    toast.success('Experience dihapus.')
  } catch (caught) {
    toast.error(caught instanceof Error ? caught.message : 'Gagal menghapus experience.')
  }
}

onMounted(load)
</script>

<template>
  <div>
    <AdminPageHeader
      title="Experiences"
      description="Kelola pengalaman kerja, organisasi, pendidikan, dan volunteer."
    >
      <button type="button" class="admin-btn-primary" @click="openCreate">
        <Plus :size="16" />
        Experience baru
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
              <th>Experience</th>
              <th>Tipe</th>
              <th>Periode</th>
              <th>Urutan</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="experience in items" :key="experience.id">
              <td>
                <p class="font-medium text-white">{{ experience.title }}</p>
                <p class="mt-0.5 text-[0.7rem] text-white/35">{{ experience.organization }}</p>
                <p v-if="experience.description" class="mt-1 max-w-md truncate text-[0.7rem] text-white/25">
                  {{ experience.description }}
                </p>
              </td>
              <td>
                <AdminBadge :label="typeLabel(experience.type)" :tone="typeTone(experience.type)" />
              </td>
              <td class="text-white/50">{{ formatPeriod(experience.startYear, experience.endYear) }}</td>
              <td class="text-white/45">{{ experience.sortOrder }}</td>
              <td>
                <div class="flex items-center justify-end gap-1">
                  <button type="button" class="admin-btn-ghost" title="Edit" @click="openEdit(experience)">
                    <Pencil :size="15" />
                  </button>
                  <button
                    type="button"
                    class="admin-btn-ghost text-red-300/70 hover:text-red-300"
                    title="Hapus"
                    @click="remove(experience)"
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
        <p class="text-sm text-white/40">Belum ada experience.</p>
        <button type="button" class="admin-btn mt-4" @click="openCreate">
          <Plus :size="15" />
          Tambah experience pertama
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
      :title="editingId ? 'Edit experience' : 'Experience baru'"
      description="Pengalaman ini tampil di bagian Experience pada homepage."
      @close="modalOpen = false"
    >
      <form id="experience-form" class="space-y-4" @submit.prevent="submit">
        <p v-if="formError" class="rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-3 text-xs leading-relaxed text-red-200">
          {{ formError }}
        </p>

        <div class="grid gap-4 sm:grid-cols-2">
          <AdminField label="Organisasi" required>
            <input v-model="form.organization" class="admin-input" placeholder="Nama organisasi / perusahaan" />
          </AdminField>
          <AdminField label="Posisi" required>
            <input v-model="form.title" class="admin-input" placeholder="Software Developer" />
          </AdminField>
          <AdminField label="Tipe">
            <select v-model="form.type" class="admin-input admin-select">
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </AdminField>
          <AdminField label="Urutan tampil">
            <input v-model.number="form.sortOrder" type="number" class="admin-input" />
          </AdminField>
          <AdminField label="Tahun mulai">
            <input v-model="form.startYear" type="number" min="1900" max="2200" class="admin-input" placeholder="2024" />
          </AdminField>
          <AdminField label="Tahun selesai" hint="Kosongkan jika masih berlangsung">
            <input v-model="form.endYear" type="number" min="1900" max="2200" class="admin-input" placeholder="2026" />
          </AdminField>
        </div>

        <AdminField label="Deskripsi">
          <textarea v-model="form.description" class="admin-input admin-textarea" rows="5" />
        </AdminField>
      </form>

      <template #footer>
        <button type="button" class="admin-btn-ghost" @click="modalOpen = false">Batal</button>
        <button type="submit" form="experience-form" class="admin-btn-primary" :disabled="saving">
          <Loader2 v-if="saving" :size="15" class="animate-spin" />
          {{ saving ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Tambah experience' }}
        </button>
      </template>
    </AdminModal>
  </div>
</template>