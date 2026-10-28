<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { projects } from '@/data/projects'

const router = useRouter()

const activeIndex = ref<number | null>(null)
const hoverImg = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let currentX = 0
let currentY = 0

const openDetail = (project: typeof projects[0]) => {
  router.push(`/projects/${project.slug}`)
}

const onMouseMove = (e: MouseEvent) => {
  mouseX = e.clientX
  mouseY = e.clientY
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  
  gsap.ticker.add(() => {
    currentX += (mouseX - currentX) * 0.1
    currentY += (mouseY - currentY) * 0.1
    
    if (hoverImg.value) {
      gsap.set(hoverImg.value, {
        x: currentX - 200, // offset half width
        y: currentY - 150, // offset half height
      })
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
})
</script>
<template>
  <section id="portfolio" class="w-full py-32 px-6 md:px-24 border-t border-[#222] relative">
    <div class="max-w-7xl mx-auto w-full">
      <div class="flex items-end justify-between mb-16 gap-8">
        <h2 class="text-4xl md:text-8xl font-heading text-secondary uppercase">Projects</h2>
        <RouterLink to="/projects" class="font-body text-xs uppercase tracking-widest text-accent hover:text-secondary transition-colors mb-4 whitespace-nowrap">View all →</RouterLink>
      </div>
      
      <div class="flex flex-col border-t border-[#333]">
        <div v-for="(project, i) in projects" :key="i" 
             class="group border-b border-[#333] py-8 md:py-16 cursor-pointer relative overflow-hidden"
             @mouseenter="activeIndex = i" @mouseleave="activeIndex = null"
             @click="openDetail(project)">
             
          <div class="absolute inset-0 bg-secondary transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] z-0"></div>
             
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:text-primary transition-colors duration-500 delay-100">
            <div>
              <div class="text-sm uppercase tracking-widest font-body opacity-70 mb-2">{{ project.category }}</div>
              <h3 class="text-4xl md:text-7xl font-heading tracking-tight">{{ project.title }}</h3>
            </div>
            <div class="text-left md:text-right max-w-sm mt-4 md:mt-0">
              <p class="font-body text-sm md:text-base opacity-80 mb-2">{{ project.desc }}</p>
              <div class="text-xs uppercase tracking-widest font-bold">{{ project.tech }}</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

    <!-- Floating Image Hover Reveal -->
    <div ref="hoverImg" 
         class="fixed top-0 left-0 w-[400px] h-[300px] pointer-events-none z-40 overflow-hidden mix-blend-screen scale-0 opacity-0 transition-all duration-300 ease-out"
         :class="{ 'scale-100 opacity-100': activeIndex !== null }">
      <img v-if="activeIndex !== null" :src="projects[activeIndex].img" class="w-full h-full object-cover filter grayscale contrast-125" />
    </div>

  </section>
</template>
