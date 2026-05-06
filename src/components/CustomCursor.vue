<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const cursor = ref<HTMLElement | null>(null)
const follower = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let posX = 0
let posY = 0

const onMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
  
  gsap.to(cursor.value, {
    x: mouseX,
    y: mouseY,
    duration: 0,
  })
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  
  gsap.ticker.add(() => {
    posX += (mouseX - posX) * 0.1
    posY += (mouseY - posY) * 0.1
    
    gsap.set(follower.value, {
      x: posX - 12,
      y: posY - 12,
    })
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <div class="hidden lg:block pointer-events-none fixed inset-0 z-[99]">
    <div ref="cursor" class="w-2 h-2 bg-secondary rounded-full fixed top-0 left-0 -ml-1 -mt-1 mix-blend-difference"></div>
    <div ref="follower" class="w-8 h-8 border border-secondary rounded-full fixed top-0 left-0 mix-blend-difference transition-transform duration-300 ease-out"></div>
  </div>
</template>
