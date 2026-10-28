<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loader2, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { getAdminToken } from '@/lib/auth'
import type { Award, AwardInput } from '@/lib/types'
import { useAdminToast } from '@/composables/useAdminToast'
import { usePaginatedList } from '@/composables/usePaginatedList'
import AdminField from '@/components/admin/AdminField.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'

interface AwardForm {
  title: string
  issuer: string
  year: string
  description: string
  sortOrder: number
}

const token = getAdminToken() ?? ''
const toast = useAdminToast()

const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')
const form = ref<AwardForm>(emptyAward())

const { items, meta, loading, error, page, totalPages, load, next, prev } =
  usePaginatedList<Award>((query) => api.listAwards(query))

function emptyAward(): AwardForm {
  return {
    title: '',
    issuer: '',
    year: '',
    description: '',
    sortOrder: 0,
  }
}

function openCreate(): void {
  editingId.value = null
  form.value = emptyAward()
  formError.value = ''
  modalOpen.value = true
}

function openEdit(award: Award): void {
  editingId.value = award.id
  form.value = {
    title: award.title,
    issuer: award.issuer ?? '',
    year: award.year ?? '',
    description: award.description,
    sortOrder: award.sortOrder,
  }
  formError.value = ''
  modalOpen.value = true
}

function payloadFromForm(): AwardInput {
  return {
    title: form.value.title.trim(),
    issuer: form.value.issuer.trim() || null,
    year: form.value.year.trim() || null,
    description: form.value.description.trim(),
    sortOrder: form.value.sortOrder,
  }
}

async function submit(): Promise<void> {
  saving.value = true
  formError.value = ''

  try {
    const payload = payloadFromForm()

    if (!payload.title) throw new Error('Judul award wajib diisi.')

    if (editingId.value) {
      await api.updateAward(token, editingId.value, payload)
      toast.success('Award berhasil diperbarui.')
    } else {
      await api.createAward(token, payload)
      toast.success('Award baru berhasil ditambahkan.')
    }

    modalOpen.value = false
    await load()
  } catch (caught) {
    formError.value = caught instanceof Error ? caught.message : 'Gagal menyimpan award.'
    toast.error(formError.value)
  } finally {
    saving.value = false
  }
}

async function remove(award: Award): Promise<void> {
  if (!window.confirm(`Hapus award "${award.title}"?`)) {
    return
  }

  try {
    await api.deleteAward(token, award.id)
    if (items.value.length === 1 && page.value > 1) page.value -= 1
    await load()
    toast.success('Award dihapus.')
  } catch (caught) {
    toast.error(caught instanceof Error ? caught.message : 'Gagal menghapus award.')
  }
}

onMounted(load)
</script>

<template>
  <div>
    <AdminPageHeader
      title="Awards"
      description="Kelola pencapaian, penghargaan, dan sertifikasi."
    >
      <button type="button" class="admin-btn-primary" @click="openCreate">
        <Plus :size="16" />
        Award baru
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
              <th>Award</th>
              <th>Penerbit</th>
              <th>Tahun</th>
              <th>Urutan</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="award in items" :key="award.id">
              <td>
                <p class="font-medium text-white">{{ award.title }}</p>
                <p v-if="award.description" class="mt-1 max-w-md truncate text-[0.7rem] text-white/25">
                  {{ award.description }}
                </p>
              </td>
              <td class="text-white/50">{{ award.issuer || '—' }}</td>
              <td class="text-white/50">{{ award.year || '—' }}</td>
              <td class="text-white/45">{{ award.sortOrder }}</td>
              <td>
                <div class="flex items-center justify-end gap-1">
                  <button type="button" class="admin-btn-ghost" title="Edit" @click="openEdit(award)">
                    <Pencil :size="15" />
                  </button>
                  <button
                    type="button"
                    class="admin-btn-ghost text-red-300/70 hover:text-red-300"
                    title="Hapus"
                    @click="remove(award)"
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
        <p class="text-sm text-white/40">Belum ada award.</p>
        <button type="button" class="admin-btn mt-4" @click="openCreate">
          <Plus :size="15" />
          Tambah award pertama
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
      :title="editingId ? 'Edit award' : 'Award baru'"
      description="Pencapaian ini tampil di bagian Awards pada homepage."
      @close="modalOpen = false"
    >
      <form id="award-form" class="space-y-4" @submit.prevent="submit">
        <p v-if="formError" class="rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-3 text-xs leading-relaxed text-red-200">
          {{ formError }}
        </p>

        <AdminField label="Judul" required>
          <input v-model="form.title" class="admin-input" placeholder="Nama award / pencapaian" />
        </AdminField>

        <div class="grid gap-4 sm:grid-cols-2">
          <AdminField label="Penerbit">
            <input v-model="form.issuer" class="admin-input" placeholder="Nama organisasi" />
          </AdminField>
          <AdminField label="Tahun">
            <input v-model="form.year" class="admin-input" placeholder="2026" />
          </AdminField>
        </div>

        <AdminField label="Deskripsi">
          <textarea v-model="form.description" class="admin-input admin-textarea" rows="5" />
        </AdminField>

        <AdminField label="Urutan tampil">
          <input v-model.number="form.sortOrder" type="number" class="admin-input" />
        </AdminField>
      </form>

      <template #footer>
        <button type="button" class="admin-btn-ghost" @click="modalOpen = false">Batal</button>
        <button type="submit" form="award-form" class="admin-btn-primary" :disabled="saving">
          <Loader2 v-if="saving" :size="15" class="animate-spin" />
          {{ saving ? 'Menyimpan...' : editingId ? 'Simpan perubahan' : 'Tambah award' }}
        </button>
      </template>
    </AdminModal>
  </div>
</template>