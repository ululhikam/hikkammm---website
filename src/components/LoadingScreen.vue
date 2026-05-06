<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const progress = ref(0)
const loadingWrapper = ref<HTMLElement | null>(null)

onMounted(() => {
  const tl = gsap.timeline()
  
  tl.to(progress, {
    value: 9999999,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
      progress.value = Math.round(progress.value)
    }
  })
  .to(loadingWrapper.value, {
    yPercent: -100,
    duration: 2,
    ease: "power4.inOut",
    delay: 0.2
  })
})
</script>

<template>
  <div ref="loadingWrapper" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary text-secondary">
    <div class="text-8xl font-heading">{{ progress }}%</div>
    <div class="mt-4 text-accent uppercase tracking-widest text-sm font-body">Loading Experience</div>
  </div>
</template>
