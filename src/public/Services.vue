<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import TiltCard from '../components/TiltCard.vue'

const sectionRef = ref(null)
const cards = ref<HTMLElement[]>([])

const services = [
  { 
    id: '01', 
    title: 'Frontend Engineering', 
    desc: 'Crafting pixel-perfect, highly kinetic web interfaces using Vue, React, and GSAP. Performance-driven and visually stunning.',
    tags: ['Vue 3', 'React', 'GSAP', 'WebGL']
  },
  { 
    id: '02', 
    title: 'Data Science & AI', 
    desc: 'Transforming raw data into predictive models. Building intelligent systems that comprehend and automate complex workflows.',
    tags: ['Python', 'TensorFlow', 'LLMs', 'Scikit']
  },
  { 
    id: '03', 
    title: 'UI/UX Design', 
    desc: 'Designing brutalist, cinematic experiences. Focus on typography, grid systems, and unconventional layouts that tell a story.',
    tags: ['Figma', 'Prototyping', 'Brutalism', 'Motion']
  }
]

onMounted(() => {
  gsap.fromTo(cards.value,
    { y: 100, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out",
      scrollTrigger: { trigger: sectionRef.value, start: "top 70%" }
    }
  )
})
</script>
<template>
  <section id="services" ref="sectionRef" class="w-full py-32 px-6 md:px-24 bg-primary border-t border-[#222]">
    <div class="max-w-7xl mx-auto w-full">
      <div class="flex flex-col md:flex-row justify-between items-end mb-24">
        <h2 class="text-4xl md:text-8xl font-heading text-secondary uppercase">Expertise <br/> & Services</h2>
        <p class="font-body text-accent max-w-sm text-left md:text-right mt-8 md:mt-0 text-lg">Delivering end-to-end solutions combining aesthetic mastery with complex system architecture.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(service, i) in services" :key="i" :ref="el => { if (el) cards.push(el as HTMLElement) }" class="h-full">
          <TiltCard :glare="true">
            <div class="bg-[#0a0a0a] border border-[#222] p-8 md:p-12 h-full flex flex-col group-hover:border-[#555] transition-colors duration-500 rounded-xl overflow-hidden relative">
              <!-- Background gradient glow -->
              <div class="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-700"></div>
              
              <div class="text-secondary font-heading text-6xl opacity-20 mb-8">{{ service.id }}</div>
              <h3 class="text-3xl font-heading text-secondary mb-6 uppercase tracking-wide">{{ service.title }}</h3>
              <p class="font-body text-[#888] font-light leading-relaxed flex-1">{{ service.desc }}</p>
              
              <div class="flex flex-wrap gap-2 mt-12">
                <span v-for="(tag, j) in service.tags" :key="j" class="text-xs font-body uppercase tracking-widest px-3 py-1 border border-[#333] text-[#aaa] rounded-full bg-[#111]">
                  {{ tag }}
                </span>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  </section>
</template>
