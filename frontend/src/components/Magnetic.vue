<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const magnetic = ref<HTMLElement | null>(null)

onMounted(() => {
  const element = magnetic.value
  if (!element) return

  element.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e
    const { height, width, left, top } = element.getBoundingClientRect()
    const x = clientX - (left + width / 2)
    const y = clientY - (top + height / 2)
    
    gsap.to(element, { x: x * 0.4, y: y * 0.4, duration: 1, ease: 'power3.out' })
  })

  element.addEventListener('mouseleave', () => {
    gsap.to(element, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' })
  })
})
</script>

<template>
  <div ref="magnetic" class="inline-block cursor-pointer">
    <slot />
  </div>
</template>
