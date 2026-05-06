<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const sectionRef = ref(null)
const bars = ref<HTMLElement[]>([])
const counters = ref<HTMLElement[]>([])

const skills = [
  { group: 'Web Dev', items: [
    { name: 'Vue / React', level: 95 }, 
    { name: 'Tailwind CSS', level: 90 }, 
    { name: 'GSAP / Framer', level: 85 }, 
    { name: 'Node.js', level: 80 }
  ]},
  { group: 'Data Science', items: [
    { name: 'Python', level: 90 }, 
    { name: 'Pandas / NumPy', level: 88 }, 
    { name: 'Scikit-Learn', level: 85 }, 
    { name: 'TensorFlow', level: 75 }
  ]},
  { group: 'Design & Comm', items: [
    { name: 'Figma / UI/UX', level: 85 }, 
    { name: 'Brutalism', level: 95 }, 
    { name: 'Storytelling', level: 92 }, 
    { name: 'Public Speaking', level: 90 }
  ]}
]

onMounted(() => {
  bars.value.forEach((bar, index) => {
    const parentList = bar.closest('li')
    if (!parentList) return
    const levelAttr = parentList.getAttribute('data-level')
    if (!levelAttr) return
    
    const targetLevel = parseInt(levelAttr)
    const counterEl = counters.value[index]
    
    gsap.fromTo(bar,
      { width: 0 },
      {
        width: `${targetLevel}%`,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.value,
          start: "top 75%"
        }
      }
    )
    
    if (counterEl) {
      gsap.fromTo(counterEl, 
        { innerHTML: 0 },
        {
          innerHTML: targetLevel,
          duration: 1.5,
          ease: "power4.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: sectionRef.value,
            start: "top 75%"
          }
        }
      )
    }
  })
})
</script>
<template>
  <section id="capabilities" ref="sectionRef" class="w-full py-32 px-6 md:px-24 bg-[#050505]">
    <div class="max-w-6xl mx-auto w-full">
      <h2 class="text-4xl md:text-8xl font-heading text-secondary mb-24 uppercase">Capabilities</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        <div v-for="(skillGroup, i) in skills" :key="i" class="space-y-8">
          <h3 class="text-xl font-body text-accent uppercase tracking-widest border-b border-[#333] pb-4">{{ skillGroup.group }}</h3>
          <ul class="space-y-6">
            <li v-for="(item, j) in skillGroup.items" :key="j" class="group relative" :data-level="item.level">
              <div class="flex justify-between items-end relative z-10">
                <span class="font-heading text-3xl md:text-4xl group-hover:text-white transition-colors text-[#666]">{{ item.name }}</span>
                <span :ref="el => { if (el) counters.push(el as HTMLElement) }" class="font-body text-sm font-bold text-accent group-hover:text-secondary transition-colors">0</span>
              </div>
              <div class="w-full h-[2px] bg-[#111] mt-2 relative overflow-hidden">
                <div :ref="el => { if (el) bars.push(el as HTMLElement) }" class="absolute top-0 left-0 h-full bg-secondary w-0"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
