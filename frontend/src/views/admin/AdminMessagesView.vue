<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Eye, Loader2, Mail, RefreshCw, Trash2 } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { getAdminToken } from '@/lib/auth'
import type { ContactMessage, ContactStatus } from '@/lib/types'
import { useAdminToast } from '@/composables/useAdminToast'
import { usePaginatedList } from '@/composables/usePaginatedList'
import AdminBadge from '@/components/admin/AdminBadge.vue'
import AdminModal from '@/components/admin/AdminModal.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'
import AdminPagination from '@/components/admin/AdminPagination.vue'

const token = getAdminToken() ?? ''
const toast = useAdminToast()

const statusFilter = ref<ContactStatus | ''>('')
const selectedMessage = ref<ContactMessage | null>(null)
const detailOpen = ref(false)
const updating = ref(false)
const deleting = ref(false)

const tabs: Array<{ value: ContactStatus | ''; label: string }> = [
  { value: '', label: 'Semua' },
  { value: 'new', label: 'Baru' },
  { value: 'read', label: 'Dibaca' },
  { value: 'archived', label: 'Arsip' },
]

const { items, meta, loading, error, page, totalPages, load, next, prev, reset } =
  usePaginatedList<ContactMessage>((query) =>
    api.listContactMessages(token, {
      ...query,
      status: statusFilter.value || undefined,
    }),
  )

function contactTone(status: ContactStatus): 'warning' | 'info' | 'neutral' {
  if (status === 'new') return 'warning'
  if (status === 'read') return 'info'
  return 'neutral'
}

function statusLabel(status: ContactStatus): string {
  if (status === 'new') return 'Baru'
  if (status === 'read') return 'Dibaca'
  return 'Arsip'
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function openMessage(message: ContactMessage): Promise<void> {
  selectedMessage.value = message
  detailOpen.value = true

  if (message.status === 'new') {
    await updateStatus(message, 'read', false)
  }
}

async function updateStatus(
  message: ContactMessage,
  status: ContactStatus,
  notify = true,
): Promise<void> {
  updating.value = true

  try {
    const response = await api.updateContactMessageStatus(token, message.id, status)

    if (selectedMessage.value?.id === message.id) {
      selectedMessage.value = response.data
    }

    await load()

    if (notify) {
      toast.success(`Status pesan diubah menjadi ${statusLabel(status).toLowerCase()}.`)
    }
  } catch (caught) {
    toast.error(caught instanceof Error ? caught.message : 'Gagal mengubah status pesan.')
  } finally {
    updating.value = false
  }
}

async function remove(message: ContactMessage): Promise<void> {
  if (!window.confirm(`Hapus pesan "${message.subject}" dari ${message.name}?`)) {
    return
  }

  deleting.value = true

  try {
    await api.deleteContactMessage(token, message.id)
    if (selectedMessage.value?.id === message.id) {
      detailOpen.value = false
      selectedMessage.value = null
    }
    if (items.value.length === 1 && page.value > 1) page.value -= 1
    await load()
    toast.success('Pesan dihapus.')
  } catch (caught) {
    toast.error(caught instanceof Error ? caught.message : 'Gagal menghapus pesan.')
  } finally {
    deleting.value = false
  }
}

watch(statusFilter, () => {
  void reset()
})

onMounted(load)
</script>

<template>
  <div>
    <AdminPageHeader
      title="Messages"
      description="Pesan yang dikirim lewat form kontak website."
    >
      <button type="button" class="admin-btn" :disabled="loading" @click="load">
        <RefreshCw :size="15" :class="loading ? 'animate-spin' : ''" />
        Refresh
      </button>
    </AdminPageHeader>

    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        class="rounded-xl border px-3.5 py-2 text-xs font-medium transition"
        :class="
          statusFilter === tab.value
            ? 'border-white bg-white text-black'
            : 'border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.06] hover:text-white'
        "
        @click="statusFilter = tab.value"
      >
        {{ tab.label }}
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
              <th>Dari</th>
              <th>Subjek</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="message in items" :key="message.id">
              <td>
                <p class="font-medium text-white">{{ message.name }}</p>
                <p class="mt-0.5 text-[0.7rem] text-white/35">{{ message.email }}</p>
              </td>
              <td class="max-w-sm">
                <p class="truncate text-white/65">{{ message.subject }}</p>
              </td>
              <td>
                <AdminBadge :label="statusLabel(message.status)" :tone="contactTone(message.status)" />
              </td>
              <td class="whitespace-nowrap text-xs text-white/40">{{ formatDate(message.createdAt) }}</td>
              <td>
                <div class="flex items-center justify-end gap-1">
                  <button type="button" class="admin-btn-ghost" title="Lihat pesan" @click="openMessage(message)">
                    <Eye :size="15" />
                  </button>
                  <button
                    type="button"
                    class="admin-btn-ghost text-red-300/70 hover:text-red-300"
                    title="Hapus"
                    :disabled="deleting"
                    @click="remove(message)"
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
        <Mail :size="28" class="mx-auto mb-3 text-white/15" />
        <p class="text-sm text-white/40">Tidak ada pesan pada filter ini.</p>
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
      :open="detailOpen"
      title="Detail pesan"
      description="Baca pesan dan ubah status tindak lanjutnya."
      wide
      @close="detailOpen = false"
    >
      <div v-if="selectedMessage" class="space-y-5">
        <div class="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-white">{{ selectedMessage.subject }}</p>
            <p class="mt-1 text-xs text-white/40">
              {{ selectedMessage.name }} · {{ selectedMessage.email }}
            </p>
          </div>
          <div class="flex flex-col items-start gap-2 sm:items-end">
            <AdminBadge
              :label="statusLabel(selectedMessage.status)"
              :tone="contactTone(selectedMessage.status)"
            />
            <p class="text-[0.7rem] text-white/30">{{ formatDate(selectedMessage.createdAt) }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-[#0b0b0b] p-4">
          <p class="whitespace-pre-wrap text-sm leading-relaxed text-white/70">{{ selectedMessage.message }}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="admin-btn"
            :disabled="updating || selectedMessage.status === 'read'"
            @click="updateStatus(selectedMessage, 'read')"
          >
            <Loader2 v-if="updating" :size="14" class="animate-spin" />
            Tandai dibaca
          </button>
          <button
            type="button"
            class="admin-btn"
            :disabled="updating || selectedMessage.status === 'archived'"
            @click="updateStatus(selectedMessage, 'archived')"
          >
            Arsipkan
          </button>
          <button
            type="button"
            class="admin-btn-danger ml-auto"
            :disabled="deleting"
            @click="remove(selectedMessage)"
          >
            <Loader2 v-if="deleting" :size="14" class="animate-spin" />
            <Trash2 v-else :size="14" />
            Hapus pesan
          </button>
        </div>
      </div>
    </AdminModal>
  </div>
</template>