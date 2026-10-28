<script setup lang="ts">
type BadgeTone = 'neutral' | 'success' | 'warning' | 'info' | 'danger'

withDefaults(
  defineProps<{
    label: string
    tone?: BadgeTone
  }>(),
  {
    tone: 'neutral',
  },
)

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-white/10 bg-white/[0.06] text-white/60',
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  warning: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  info: 'border-sky-400/20 bg-sky-400/10 text-sky-300',
  danger: 'border-red-400/20 bg-red-400/10 text-red-300',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
    :class="toneClasses[tone]"
  >
    {{ label }}
  </span>
</template>