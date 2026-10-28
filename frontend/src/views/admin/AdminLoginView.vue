<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from 'lucide-vue-next'
import { api } from '@/lib/api'
import { getAdminToken, saveAdminToken } from '@/lib/auth'

const route = useRoute()
const router = useRouter()

const token = ref(getAdminToken() ?? '')
const remember = ref(true)
const showToken = ref(false)
const loading = ref(false)
const error = ref(
  route.query.reason === 'expired' ? 'Sesi admin berakhir. Silakan login ulang.' : '',
)

async function submit(): Promise<void> {
  const value = token.value.trim()

  if (!value) {
    error.value = 'Token admin wajib diisi.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await api.verifyAdmin(value)
    saveAdminToken(value, remember.value)
    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    await router.push(redirect)
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Token admin tidak valid.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070707] px-4 py-12 text-white">
    <div class="pointer-events-none absolute inset-0 opacity-60">
      <div class="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-3xl" />
      <div class="absolute bottom-0 right-0 h-[24rem] w-[24rem] translate-x-1/3 translate-y-1/3 rounded-full bg-white/[0.04] blur-3xl" />
    </div>

    <div class="relative w-full max-w-md">
      <RouterLink
        to="/"
        class="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 transition hover:text-white"
      >
        <ArrowLeft :size="15" />
        Kembali ke website
      </RouterLink>

      <div class="admin-card overflow-hidden p-6 shadow-[0_30px_120px_rgba(0,0,0,0.6)] sm:p-8">
        <div class="mb-8 flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
            <ShieldCheck :size="22" />
          </div>
          <div>
            <h1 class="text-xl font-semibold tracking-tight">Admin Panel</h1>
            <p class="text-xs text-white/40">Hikkammm portfolio CMS</p>
          </div>
        </div>

        <form class="space-y-5" @submit.prevent="submit">
          <label class="block">
            <span class="admin-label">Admin API token</span>
            <div class="relative">
              <KeyRound :size="16" class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                v-model="token"
                :type="showToken ? 'text' : 'password'"
                class="admin-input pl-10 pr-11"
                placeholder="Masukkan ADMIN_API_TOKEN"
                autocomplete="current-password"
                autofocus
              />
              <button
                type="button"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/35 transition hover:bg-white/10 hover:text-white"
                :aria-label="showToken ? 'Sembunyikan token' : 'Tampilkan token'"
                @click="showToken = !showToken"
              >
                <EyeOff v-if="showToken" :size="16" />
                <Eye v-else :size="16" />
              </button>
            </div>
            <span class="mt-2 block text-[0.7rem] leading-relaxed text-white/30">
              Token disimpan di browser kamu. Ambil nilainya dari
              <code class="rounded bg-white/[0.06] px-1 py-0.5 text-white/50">ADMIN_API_TOKEN</code>
              di environment backend.
            </span>
          </label>

          <label class="flex cursor-pointer items-center gap-2.5 text-xs text-white/50">
            <input v-model="remember" type="checkbox" class="h-4 w-4 rounded border-white/20 bg-white/[0.06] accent-white" />
            Ingat sesi di perangkat ini
          </label>

          <p v-if="error" class="rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-3 text-xs leading-relaxed text-red-200">
            {{ error }}
          </p>

          <button type="submit" class="admin-btn-primary w-full" :disabled="loading">
            <Loader2 v-if="loading" :size="16" class="animate-spin" />
            <ShieldCheck v-else :size="16" />
            {{ loading ? 'Memverifikasi...' : 'Masuk ke admin panel' }}
          </button>
        </form>
      </div>

      <p class="mt-6 text-center text-[0.7rem] text-white/25">
        Halaman ini tidak diindeks dan hanya bisa diakses dengan token admin.
      </p>
    </div>
  </div>
</template>