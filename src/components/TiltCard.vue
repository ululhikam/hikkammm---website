<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'

const cardRef = ref<HTMLElement | null>(null)
const props = defineProps({
  glare: { type: Boolean, default: true }
})

let bounds: DOMRect
const mouseLeaveDelay = ref<any>(null)

const onMouseEnter = () => {
  if (mouseLeaveDelay.value) clearTimeout(mouseLeaveDelay.value)
  if (cardRef.value) bounds = cardRef.value.getBoundingClientRect()
}

const onMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return
  const mouseX = e.clientX - bounds.left
  const mouseY = e.clientY - bounds.top
  
  const xPct = (mouseX / bounds.width) - 0.5
  const yPct = (mouseY / bounds.height) - 0.5
  
  gsap.to(cardRef.value, {
    duration: 0.5,
    rotateY: xPct * 20, // Max rotation 20deg
    rotateX: -yPct * 20,
    ease: "power2.out",
    transformPerspective: 1000
  })

  if (props.glare) {
    const glareEl = cardRef.value.querySelector('.glare') as HTMLElement
    if (glareEl) {
      gsap.to(glareEl, {
        duration: 0.5,
        x: mouseX - bounds.width,
        y: mouseY - bounds.height,
        opacity: 0.15,
      })
    }
  }
}

const onMouseLeave = () => {
  mouseLeaveDelay.value = setTimeout(() => {
    if (cardRef.value) {
      gsap.to(cardRef.value, {
        duration: 1,
        rotateY: 0,
        rotateX: 0,
        ease: "elastic.out(1, 0.3)"
      })
      if (props.glare) {
        const glareEl = cardRef.value.querySelector('.glare') as HTMLElement
        if (glareEl) {
          gsap.to(glareEl, { opacity: 0, duration: 1 })
        }
      }
    }
  }, 100)
}
</script>

<template>
  <div 
    ref="cardRef" 
    class="relative transform-style-3d group h-full" 
    @mouseenter="onMouseEnter" 
    @mousemove="onMouseMove" 
    @mouseleave="onMouseLeave"
  >
    <div v-if="glare" class="glare absolute w-[200%] h-[200%] top-0 left-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_50%)] opacity-0 pointer-events-none z-50 mix-blend-overlay rounded-full"></div>
    <slot />
  </div>
</template>

<style scoped>
.transform-style-3d {
  transform-style: preserve-3d;
}
</style>
