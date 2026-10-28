<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 class="text-2xl font-semibold tracking-tight text-white">{{ title }}</h2>
      <p v-if="description" class="mt-1 max-w-2xl text-sm leading-relaxed text-white/40">
        {{ description }}
      </p>
    </div>
    <div class="flex shrink-0 flex-wrap items-center gap-2">
      <slot />
    </div>
  </div>
</template>