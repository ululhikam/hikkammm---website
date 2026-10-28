<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps<{
  page: number
  totalPages: number
  total: number
  loading?: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <div class="flex flex-col gap-2 border-t border-white/10 px-4 py-3 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
    <span>Halaman {{ page }} dari {{ totalPages }} · {{ total }} data</span>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="admin-btn px-3 py-2 text-xs"
        :disabled="page <= 1 || loading"
        @click="emit('prev')"
      >
        <ChevronLeft :size="14" />
        Prev
      </button>
      <button
        type="button"
        class="admin-btn px-3 py-2 text-xs"
        :disabled="page >= totalPages || loading"
        @click="emit('next')"
      >
        Next
        <ChevronRight :size="14" />
      </button>
    </div>
  </div>
</template>