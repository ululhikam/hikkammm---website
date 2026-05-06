<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const projects = [
  { title: 'Concern Software House', category: 'Web App', tech: 'Vue 3 / Tailwind / Node', desc: 'A premium software house landing and portfolio platform.', fullDesc: 'Concern Software House is a modern, high-performance platform designed for scaling businesses. Built with a focus on SEO, accessibility, and dynamic cinematic aesthetics.', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000' },
  { title: 'MAN 1 OKI', category: 'School Portal', tech: 'Vue / Laravel / Rest API', desc: 'A complete transformation of a legacy school portal into a modern hub.', fullDesc: 'This project completely reimagined the school\'s digital presence, offering seamless communication for students, administration tools, and a dynamic public-facing portfolio.', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000' },
  { title: 'Predictive Sales', category: 'Data Science', tech: 'Python / Pandas / Scikit', desc: 'Predicting future sales trends with 94% accuracy for retail datasets.', fullDesc: 'Leveraging historical data to build robust predictive models. The project utilizes advanced feature engineering, cross-validation, and hyperparameter tuning with Random Forests.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000' },
]

const activeIndex = ref<number | null>(null)
const selectedProject = ref<typeof projects[0] | null>(null)
const hoverImg = ref<HTMLElement | null>(null)

let mouseX = 0
let mouseY = 0
let currentX = 0
let currentY = 0

const openModal = (project: typeof projects[0]) => {
  selectedProject.value = project
  document.body.style.overflow = 'hidden' // prevent scroll
}

const closeModal = () => {
  selectedProject.value = null
  document.body.style.overflow = '' // restore scroll
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
      <h2 class="text-4xl md:text-8xl font-heading text-secondary mb-16 uppercase">Portfolio</h2>
      
      <div class="flex flex-col border-t border-[#333]">
        <div v-for="(project, i) in projects" :key="i" 
             class="group border-b border-[#333] py-8 md:py-16 cursor-pointer relative overflow-hidden"
             @mouseenter="activeIndex = i" @mouseleave="activeIndex = null"
             @click="openModal(project)">
             
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
         :class="{ 'scale-100 opacity-100': activeIndex !== null && selectedProject === null }">
      <img v-if="activeIndex !== null" :src="projects[activeIndex].img" class="w-full h-full object-cover filter grayscale contrast-125" />
    </div>
    
    <!-- Modal -->
    <div v-if="selectedProject" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-md">
      <div class="absolute inset-0 cursor-pointer" @click="closeModal"></div>
      <div class="relative w-full max-w-4xl bg-[#111] border border-[#333] p-8 md:p-16 flex flex-col gap-8 shadow-2xl z-10 animate-in fade-in zoom-in duration-300">
        <button @click="closeModal" class="absolute top-6 right-6 text-2xl text-accent hover:text-secondary transition-colors">&times;</button>
        <div>
          <div class="text-accent uppercase tracking-widest text-sm mb-4 font-body">{{ selectedProject.category }}</div>
          <h3 class="text-5xl md:text-7xl font-heading uppercase text-secondary">{{ selectedProject.title }}</h3>
        </div>
        <div class="w-full h-64 md:h-96 overflow-hidden rounded border border-[#333]">
          <img :src="selectedProject.img" class="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
        <p class="font-body text-lg md:text-xl font-light leading-relaxed text-[#aaa]">{{ selectedProject.fullDesc }}</p>
        <div class="border-t border-[#333] pt-8 flex justify-between items-center">
          <div class="text-sm font-bold uppercase tracking-widest text-secondary">{{ selectedProject.tech }}</div>
          <a href="#" class="text-sm uppercase tracking-widest text-accent hover:text-secondary transition-colors underline underline-offset-4">View Live Case Study</a>
        </div>
      </div>
    </div>
  </section>
</template>
