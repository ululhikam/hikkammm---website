<script setup lang="ts">
import TiltCard from '../components/TiltCard.vue'

const awards = [
  { year: '2022', title: 'Poetry Champion', org: 'National Level', icon: '✦' },
  { year: '2023', title: 'Intl Bronze', org: 'Global Science Fair', icon: '❂' },
  { year: '2024', title: 'Top Developer', org: 'Tech Innovators', icon: '⌘' },
  { year: '2025', title: 'AI Research', org: 'Data Foundation', icon: '❖' },
]
</script>
<template>
  <section id="awards" class="w-full py-32 px-6 md:px-24 bg-[#050505] border-t border-[#222]">
    <div class="max-w-7xl mx-auto w-full">
      <h2 class="text-4xl md:text-8xl font-heading text-secondary uppercase mb-20 text-center">Milestones & Awards</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(award, i) in awards" :key="i" class="h-full">
          <TiltCard :glare="true">
            <div class="bg-[#0a0a0a] border border-[#222] p-8 rounded-xl h-[300px] flex flex-col items-start hover:bg-[#111] transition-colors relative overflow-hidden group">
              <!-- Decorative icon -->
              <div class="text-5xl text-[#333] group-hover:text-secondary group-hover:scale-110 transition-all duration-500 mb-8">{{ award.icon }}</div>
              
              <div class="text-accent font-body text-xs tracking-widest mb-4 border border-[#333] px-3 py-1 rounded-full group-hover:border-accent transition-colors">{{ award.year }}</div>
              <h3 class="text-3xl font-heading text-secondary mb-4 uppercase leading-none">{{ award.title }}</h3>
              <div class="mt-auto text-[#666] font-body text-sm uppercase tracking-widest">{{ award.org }}</div>
              
              <!-- decorative line -->
              <div class="absolute bottom-0 left-0 w-full h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  </section>
</template>
