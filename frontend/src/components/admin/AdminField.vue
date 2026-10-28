<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
  required?: boolean
  error?: string
}>()
</script>

<template>
  <label class="block">
    <span class="admin-label">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </span>
    <slot />
    <span v-if="hint" class="mt-1 block text-[0.7rem] leading-relaxed text-white/30">
      {{ hint }}
    </span>
    <span v-if="error" class="mt-1 block text-[0.7rem] text-red-400">{{ error }}</span>
  </label>
</template>