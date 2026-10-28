<script setup lang="ts">
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-vue-next'
import { useAdminToast } from '@/composables/useAdminToast'

const { toasts, remove } = useAdminToast()

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const toneClasses = {
  success: 'border-emerald-400/25 bg-emerald-950/90 text-emerald-100',
  error: 'border-red-400/25 bg-red-950/90 text-red-100',
  info: 'border-sky-400/25 bg-sky-950/90 text-sky-100',
}
</script>

<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed right-4 top-4 z-[250] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
      <TransitionGroup name="admin-toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl"
          :class="toneClasses[toast.type]"
        >
          <component :is="icons[toast.type]" :size="17" class="mt-0.5 shrink-0" />
          <p class="flex-1 leading-relaxed">{{ toast.message }}</p>
          <button
            type="button"
            class="rounded p-0.5 opacity-60 transition hover:bg-white/10 hover:opacity-100"
            aria-label="Tutup notifikasi"
            @click="remove(toast.id)"
          >
            <X :size="15" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>