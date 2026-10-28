<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const visionRef = ref(null)
const quoteWords = ref<HTMLElement[]>([])

const text = "Fundamentals first. Real systems. Products people actually use."

onMounted(() => {
  gsap.fromTo(quoteWords.value,
    { opacity: 0.1, y: 50 },
    {
      opacity: 1, y: 0,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: visionRef.value,
        start: "top 80%",
        end: "center 40%",
        scrub: 1
      }
    }
  )
})
</script>
<template>
  <section class="keep-bg w-full min-h-screen flex items-center justify-center py-32 px-6 md:px-12 bg-secondary text-primary relative overflow-hidden">
    <!-- Huge background rotating element -->
    <div class="absolute -top-[10%] -right-[20%] w-[150vw] h-[150vw] md:w-[60vw] md:h-[60vw] border-[1px] md:border-[2px] border-primary opacity-[0.05] md:opacity-10 rounded-full animate-[spin_20s_linear_infinite] mix-blend-multiply pointer-events-none"></div>
    <div class="absolute -bottom-[10%] -left-[20%] w-[120vw] h-[120vw] md:w-[40vw] md:h-[40vw] border-[1px] md:border-[2px] border-primary opacity-[0.05] md:opacity-10 animate-[spin_15s_linear_infinite_reverse] mix-blend-multiply pointer-events-none"></div>

    <div ref="visionRef" class="max-w-6xl text-center relative z-10 w-full">
      <div class="flex items-center justify-center gap-4 mb-16">
        <div class="h-[2px] w-8 md:w-12 bg-primary"></div>
        <div class="text-xs md:text-sm font-body font-bold uppercase tracking-widest">The Core Vision</div>
        <div class="h-[2px] w-8 md:w-12 bg-primary"></div>
      </div>
      
      <blockquote class="relative text-5xl md:text-8xl lg:text-[7rem] font-heading leading-[0.9] uppercase tracking-tighter flex flex-wrap justify-center gap-x-3 md:gap-x-6 gap-y-2 md:gap-y-4">
        <span class="text-[#aaa] text-8xl md:text-[15rem] leading-none absolute -top-12 md:-top-32 -left-4 md:-left-16 opacity-30 font-serif">"</span>
        <span v-for="(word, i) in text.split(' ')" :key="i" 
              :ref="el => { if(el) quoteWords.push(el as HTMLElement) }"
              class="inline-block"
              :class="{ 'italic text-accent': word.includes('Fundamentals') || word.includes('Products') }">
          {{ word }}
        </span>
        <span class="text-[#aaa] text-8xl md:text-[15rem] leading-none absolute -bottom-12 md:-bottom-32 -right-4 md:-right-16 opacity-30 font-serif">"</span>
      </blockquote>
    </div>
  </section>
</template>
