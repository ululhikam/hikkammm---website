<script setup lang="ts">
import TiltCard from '../components/TiltCard.vue'

const wins = [
  { title: 'Lomba Puisi', desc: 'Juara lomba puisi — kemampuan menulis kreatif di tingkat event.' },
  { title: 'IIIREX', desc: 'Lomba inovasi aplikasi untuk kesehatan — menghadirkan Cathy, aplikasi inovasi kesehatan.' },
]
</script>
<template>
  <section id="wins" class="w-full py-32 px-6 md:px-24 bg-[#050505] border-t border-[#222]">
    <div class="max-w-7xl mx-auto w-full">
      <h2 class="text-4xl md:text-8xl font-heading text-secondary uppercase mb-20 text-center">Wins</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div v-for="(win, i) in wins" :key="i" class="h-full">
          <TiltCard :glare="true">
            <div class="bg-[#0a0a0a] border border-[#222] p-8 rounded-xl min-h-[220px] flex flex-col items-start hover:bg-[#111] transition-colors relative overflow-hidden group">

              <div class="text-accent font-body text-xs tracking-widest mb-4 border border-[#333] px-3 py-1 rounded-full">Achievement</div>
              <h3 class="text-3xl font-heading text-secondary mb-4 uppercase leading-none">{{ win.title }}</h3>
              <p class="text-[#888] font-body text-sm font-light leading-relaxed">{{ win.desc }}</p>

              <div class="absolute bottom-0 left-0 w-full h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  </section>
</template>
