<script setup lang="ts">
import TiltCard from './TiltCard.vue'
</script>
<template>
  <section class="w-full py-32 px-6 md:px-24 bg-primary flex justify-center items-center relative overflow-hidden">
    <!-- Grid Background -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto w-full z-10">
      <TiltCard :glare="true">
        <div class="relative w-full rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#222] p-12 md:p-24 overflow-hidden group">
          <!-- Animated Glow -->
          <div class="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-[0.05] animate-[spin_4s_linear_infinite] pointer-events-none mix-blend-screen"></div>
          <div class="absolute inset-[1px] bg-[#050505] rounded-2xl z-0"></div> <!-- inner mask -->
          
          <div class="relative z-10 flex flex-col md:flex-row gap-12 items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-8 w-fit bg-[#111] border border-[#333] px-4 py-2 rounded-full">
                <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]"></div>
                <span class="font-body text-xs uppercase tracking-widest text-accent font-medium">Status: Actively Building</span>
              </div>
              <h2 class="text-4xl md:text-7xl font-heading uppercase text-secondary mb-6 leading-none">What I'm <br/> Doing Now</h2>
              <p class="font-body text-xl md:text-2xl font-light text-[#aaa] leading-relaxed max-w-2xl">
                Currently expanding into <span class="text-white font-medium border-b border-[#444]">Data Science, Data Engineering & NLP</span>, while building <span class="text-white font-medium border-b border-[#444]">Concern Dev</span> into a real software house — learning fundamentals first, then turning them into products.
              </p>
            </div>
            
            <div class="w-full md:w-auto mt-8 md:mt-0">
              <a href="#contact" class="inline-flex items-center justify-center px-10 py-5 bg-secondary text-primary font-heading text-2xl uppercase hover:bg-accent transition-colors w-full md:w-auto rounded group-hover:scale-105 duration-300">
                Start a Conversation
              </a>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  </section>
</template>
