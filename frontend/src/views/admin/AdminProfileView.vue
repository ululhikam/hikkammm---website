<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Loader2, Plus, RefreshCw, Save, Trash2 } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { getAdminToken } from '@/lib/auth'
import { nullableUrl } from '@/lib/slug'
import type { ProfileInput, SocialLink } from '@/lib/types'
import { useAdminToast } from '@/composables/useAdminToast'
import AdminField from '@/components/admin/AdminField.vue'
import AdminPageHeader from '@/components/admin/AdminPageHeader.vue'

const token = getAdminToken() ?? ''
const toast = useAdminToast()

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const updatedAt = ref('')
const bioText = ref('')
const form = ref<ProfileInput>(emptyProfile())

function emptyProfile(): ProfileInput {
  return {
    name: '',
    headline: '',
    bio: [],
    location: '',
    email: '',
    avatarUrl: null,
    socials: [],
  }
}

function formatDate(value: string): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

async function load(): Promise<void> {
  loading.value = true
  error.value = ''

  try {
    const response = await api.getProfile()
    const profile = response.data

    form.value = {
      name: profile.name,
      headline: profile.headline,
      bio: [...profile.bio],
      location: profile.location,
      email: profile.email,
      avatarUrl: profile.avatarUrl,
      socials: profile.socials.map((social) => ({ ...social })),
    }
    bioText.value = profile.bio.join('\n')
    updatedAt.value = profile.updatedAt
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Gagal memuat profil.'
  } finally {
    loading.value = false
  }
}

function addSocial(): void {
  form.value.socials.push({ name: '', url: '' })
}

function removeSocial(index: number): void {
  form.value.socials.splice(index, 1)
}

function payloadFromForm(): ProfileInput {
  const socials: SocialLink[] = form.value.socials
    .map((social) => ({
      name: social.name.trim(),
      url: social.url.trim(),
    }))
    .filter((social) => social.name.length > 0 || social.url.length > 0)

  return {
    name: form.value.name.trim(),
    headline: form.value.headline.trim(),
    bio: bioText.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    location: form.value.location.trim(),
    email: form.value.email.trim(),
    avatarUrl: nullableUrl(form.value.avatarUrl),
    socials,
  }
}

async function submit(): Promise<void> {
  saving.value = true
  error.value = ''

  try {
    const payload = payloadFromForm()

    if (!payload.name) throw new Error('Nama wajib diisi.')
    if (!payload.email) throw new Error('Email wajib diisi.')

    const response = await api.updateProfile(token, payload)
    form.value = {
      name: response.data.name,
      headline: response.data.headline,
      bio: [...response.data.bio],
      location: response.data.location,
      email: response.data.email,
      avatarUrl: response.data.avatarUrl,
      socials: response.data.socials.map((social) => ({ ...social })),
    }
    bioText.value = response.data.bio.join('\n')
    updatedAt.value = response.data.updatedAt
    toast.success('Profil berhasil diperbarui.')
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Gagal menyimpan profil.'
    toast.error(error.value)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <AdminPageHeader
      title="Profile"
      description="Edit identitas utama yang tampil di homepage dan halaman kontak."
    >
      <button type="button" class="admin-btn" :disabled="loading" @click="load">
        <RefreshCw :size="15" :class="loading ? 'animate-spin' : ''" />
        Refresh
      </button>
      <button type="submit" form="profile-form" class="admin-btn-primary" :disabled="saving || loading">
        <Loader2 v-if="saving" :size="15" class="animate-spin" />
        <Save v-else :size="15" />
        {{ saving ? 'Menyimpan...' : 'Simpan profil' }}
      </button>
    </AdminPageHeader>

    <p v-if="error" class="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {{ error }}
    </p>

    <div v-if="loading" class="grid gap-5 xl:grid-cols-[1fr_20rem]">
      <div class="admin-card h-[32rem] animate-pulse" />
      <div class="admin-card h-64 animate-pulse" />
    </div>

    <form v-else id="profile-form" class="grid gap-5 xl:grid-cols-[1fr_20rem]" @submit.prevent="submit">
      <div class="space-y-5">
        <section class="admin-card p-4 md:p-5">
          <h3 class="text-sm font-semibold text-white">Identitas</h3>
          <p class="mb-4 mt-1 text-[0.7rem] text-white/35">Nama, headline, dan kontak utama.</p>

          <div class="grid gap-4 sm:grid-cols-2">
            <AdminField label="Nama" required>
              <input v-model="form.name" class="admin-input" placeholder="Nama lengkap" />
            </AdminField>
            <AdminField label="Headline">
              <input v-model="form.headline" class="admin-input" placeholder="Software Developer & Builder" />
            </AdminField>
            <AdminField label="Lokasi">
              <input v-model="form.location" class="admin-input" placeholder="Yogyakarta, Indonesia" />
            </AdminField>
            <AdminField label="Email" required>
              <input v-model="form.email" type="email" class="admin-input" placeholder="email@example.com" />
            </AdminField>
          </div>

          <div class="mt-4">
            <AdminField label="Avatar URL" hint="Kosongkan untuk memakai avatar default.">
              <input v-model="form.avatarUrl" class="admin-input" placeholder="https://..." />
            </AdminField>
          </div>
        </section>

        <section class="admin-card p-4 md:p-5">
          <h3 class="text-sm font-semibold text-white">Bio</h3>
          <p class="mb-4 mt-1 text-[0.7rem] text-white/35">
            Satu baris akan menjadi satu paragraf.
          </p>
          <AdminField label="Bio">
            <textarea v-model="bioText" class="admin-input admin-textarea min-h-[180px]" rows="8" />
          </AdminField>
        </section>

        <section class="admin-card p-4 md:p-5">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-sm font-semibold text-white">Social links</h3>
              <p class="mt-1 text-[0.7rem] text-white/35">
                Tautan yang tampil di bagian profil dan kontak.
              </p>
            </div>
            <button type="button" class="admin-btn shrink-0" @click="addSocial">
              <Plus :size="15" />
              Tambah
            </button>
          </div>

          <div v-if="form.socials.length === 0" class="mt-4 rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-xs text-white/30">
            Belum ada social link.
          </div>

          <div v-else class="mt-4 space-y-3">
            <div
              v-for="(social, index) in form.socials"
              :key="index"
              class="grid gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:grid-cols-[1fr_1.6fr_auto]"
            >
              <input v-model="social.name" class="admin-input" placeholder="GitHub" />
              <input v-model="social.url" class="admin-input" placeholder="https://github.com/..." />
              <button
                type="button"
                class="admin-btn-ghost justify-center text-red-300/70 hover:text-red-300"
                title="Hapus social"
                @click="removeSocial(index)"
              >
                <Trash2 :size="15" />
              </button>
            </div>
          </div>
        </section>

        <div class="flex justify-end">
          <button type="submit" class="admin-btn-primary" :disabled="saving">
            <Loader2 v-if="saving" :size="15" class="animate-spin" />
            <Save v-else :size="15" />
            {{ saving ? 'Menyimpan...' : 'Simpan profil' }}
          </button>
        </div>
      </div>

      <aside class="space-y-5">
        <section class="admin-card overflow-hidden">
          <div class="aspect-square w-full bg-white/[0.04]">
            <img
              v-if="form.avatarUrl"
              :src="form.avatarUrl"
              alt="Avatar"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center text-5xl font-semibold text-white/15">
              {{ form.name.slice(0, 1).toUpperCase() || '?' }}
            </div>
          </div>
          <div class="p-4">
            <p class="text-sm font-semibold text-white">{{ form.name || 'Nama kamu' }}</p>
            <p class="mt-1 text-xs text-white/40">{{ form.headline || 'Headline' }}</p>
            <p class="mt-3 text-xs text-white/35">{{ form.location || 'Lokasi' }}</p>
            <p class="mt-1 break-all text-xs text-white/35">{{ form.email || 'Email' }}</p>
          </div>
        </section>

        <section class="admin-card p-4">
          <p class="text-[0.65rem] uppercase tracking-[0.18em] text-white/35">Terakhir diperbarui</p>
          <p class="mt-2 text-sm text-white/60">{{ formatDate(updatedAt) }}</p>
        </section>
      </aside>
    </form>
  </div>
</template>