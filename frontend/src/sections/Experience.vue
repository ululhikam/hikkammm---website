<script setup lang="ts">
import TiltCard from '../components/TiltCard.vue'

const experiences = [
  { org: 'Informatics Student Association', title: 'Vice Chairman', role: 'Led major programs — Syntax (intro workshops & competitions) and DeForka (academic & non-academic competitions + seminar)' },
  { org: 'BEM UST', title: 'Staff — Ministry of Foreign Affairs', role: 'Communication, external relations, networking, and organizational collaboration' },
  { org: 'Teater', title: 'Project Manager', role: 'Coordinating teams, production, and execution under deadlines' },
  { org: 'HMI (Himpunan Mahasiswa Islam)', title: 'Staff — PTKP', role: 'Student community involvement and leadership development' },
]
</script>
<template>
  <section id="experience" class="w-full py-32 px-6 md:px-24 bg-[#050505] border-t border-[#222]">
    <div class="max-w-7xl mx-auto w-full">
      <h2 class="text-4xl md:text-8xl font-heading text-secondary uppercase mb-20 text-center">Experience</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="(exp, i) in experiences" :key="i" class="h-full">
          <TiltCard :glare="true">
            <div class="bg-[#0a0a0a] border border-[#222] p-8 rounded-xl min-h-[240px] flex flex-col items-start hover:bg-[#111] transition-colors relative overflow-hidden group">

              <div class="text-accent font-body text-xs tracking-widest mb-4 border border-[#333] px-3 py-1 rounded-full">{{ exp.org }}</div>
              <h3 class="text-3xl font-heading text-secondary mb-4 uppercase leading-none">{{ exp.title }}</h3>
              <p class="text-[#888] font-body text-sm font-light leading-relaxed">{{ exp.role }}</p>

              <div class="absolute bottom-0 left-0 w-full h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  </section>
</template>
