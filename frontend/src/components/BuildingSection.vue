<script setup lang="ts">
import { buildings } from '@/data/projects'
</script>

<template>
  <section id="building" class="w-full py-32 px-6 md:px-24 bg-[#050505] border-t border-[#222]">
    <div class="max-w-7xl mx-auto w-full">
      <div class="flex items-end justify-between mb-16 gap-8">
        <h2 class="text-4xl md:text-8xl font-heading text-secondary uppercase">Currently<br/>Building</h2>
        <p class="font-body text-accent max-w-xs text-right text-sm md:text-base">Not just learning — turning knowledge into products and businesses.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RouterLink
          v-for="b in buildings"
          :key="b.slug"
          :to="`/building/${b.slug}`"
          class="group bg-[#0a0a0a] border border-[#222] hover:border-[#555] rounded-xl p-10 md:p-14 transition-colors duration-500 flex flex-col min-h-[280px]"
        >
          <div class="font-body text-xs uppercase tracking-widest text-accent mb-6 border border-[#333] px-3 py-1 rounded-full w-fit">{{ b.tagline }}</div>
          <h3 class="text-4xl md:text-6xl font-heading text-secondary uppercase leading-none mb-6 group-hover:text-accent transition-colors">{{ b.title }}</h3>
          <p class="font-body text-[#888] font-light leading-relaxed flex-1">{{ b.desc }}</p>
          <div class="mt-10 text-xs uppercase tracking-widest text-secondary">Read detail →</div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
