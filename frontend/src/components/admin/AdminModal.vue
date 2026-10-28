<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    wide?: boolean
  }>(),
  {
    description: '',
    wide: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    emit('close')
  }
}

watch(
  () => props.open,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''

    if (open) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="admin-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[150] overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="emit('close')"
      >
        <div
          class="admin-modal-panel mx-auto my-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-[0_30px_120px_rgba(0,0,0,0.8)] md:my-10"
          :class="wide ? 'max-w-4xl' : 'max-w-2xl'"
        >
          <header class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-6">
            <div>
              <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
              <p v-if="description" class="mt-1 text-xs leading-relaxed text-white/40">
                {{ description }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
              aria-label="Tutup"
              @click="emit('close')"
            >
              <X :size="18" />
            </button>
          </header>

          <div class="max-h-[calc(100vh-14rem)] overflow-y-auto px-5 py-5 md:px-6">
            <slot />
          </div>

          <footer
            v-if="$slots.footer"
            class="flex flex-col-reverse gap-2 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:flex-row sm:justify-end md:px-6"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>