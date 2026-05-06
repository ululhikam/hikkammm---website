<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const storyWrapper = ref(null)
const words = ref<HTMLElement[]>([])
const stickyImg = ref(null)
const progressLine = ref(null)

const paragraphs = [
  "My journey didn't start with lines of code. It started with art. A deep-rooted fascination with visual storytelling, overlapping layers, and the psychology of how humans perceive beauty through brutalist aesthetics.",
  "Then came teaching. Standing in front of a classroom taught me the absolute necessity of conveying extremely complex, abstract ideas through simple, profound, and impactful communication.",
  "Technology was the natural, inevitable evolution. Code became the canvas where logic meets creativity. I began architecting web applications that weren't just functional, but deeply experiential.",
  "Today, Data Science and AI are the paint. I specialize in transforming unstructured, chaotic data into predictive elegance. Whether it's building a cutting-edge Vue interface or training a machine learning model, my goal remains the same: to build systems that don't just compute, but truly comprehend."
]

onMounted(() => {
  // Words reveal animation
  gsap.fromTo(words.value, 
    { opacity: 0.1 },
    {
      opacity: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: storyWrapper.value,
        start: "top 60%",
        end: "bottom 80%",
        scrub: 1,
      }
    }
  )

  // Sticky image parallax
  gsap.fromTo(stickyImg.value,
    { scale: 1.2, filter: 'grayscale(100%) blur(5px)' },
    {
      scale: 1, filter: 'grayscale(100%) blur(0px)',
      scrollTrigger: {
        trigger: storyWrapper.value,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    }
  )

  // Timeline progress line
  gsap.fromTo(progressLine.value,
    { scaleY: 0 },
    {
      scaleY: 1,
      transformOrigin: "top center",
      ease: "none",
      scrollTrigger: {
        trigger: storyWrapper.value,
        start: "top 60%",
        end: "bottom 80%",
        scrub: true
      }
    }
  )
})
</script>
<template>
  <section id="about" class="min-h-screen w-full py-32 px-6 md:px-24 flex flex-col justify-center border-t border-[#222]">
    <div ref="storyWrapper" class="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative">
      
      <div class="lg:col-span-7 relative pl-8 md:pl-12">
        <!-- Progress Line Timeline -->
        <div class="absolute left-0 top-0 bottom-0 w-[2px] bg-[#222]">
          <div ref="progressLine" class="w-full h-full bg-accent"></div>
          <!-- Dots -->
          <div class="absolute -left-1 top-0 w-3 h-3 rounded-full bg-secondary"></div>
          <div class="absolute -left-1 bottom-0 w-3 h-3 rounded-full bg-secondary"></div>
        </div>

        <h2 class="text-4xl md:text-8xl font-heading text-accent opacity-30 mb-16 uppercase leading-none">The <br/> Narrative</h2>
        
        <div class="space-y-16 font-body text-2xl md:text-4xl font-light leading-snug relative z-10">
          <div v-for="(p, i) in paragraphs" :key="i" class="relative group">
            <div class="absolute -left-12 md:-left-16 top-2 text-xs font-heading text-[#555] tracking-widest">{{ '0' + (i + 1) }}</div>
            <p class="flex flex-wrap gap-x-2 gap-y-1">
              <span v-for="(word, j) in p.split(' ')" :key="j" 
                    :ref="el => { if (el) words.push(el as HTMLElement) }" 
                    :class="{ 'text-secondary font-medium': i === paragraphs.length - 1, 'text-[#ccc]': i !== paragraphs.length - 1 }">
                {{ word }}
              </span>
            </p>
          </div>
        </div>
      </div>
      
<div class="lg:col-span-5 relative h-[500px] lg:h-[800px] w-full lg:sticky top-32 rounded-2xl overflow-hidden border border-[#333] group hidden lg:block">
    
    <!-- Gambar diubah menjadi hitam putih (grayscale) dan kontras dinaikkan agar lebih tajam -->
    <img ref="stickyImg" src="@/assets/hikam_narative.webp" class="absolute inset-0 object-cover w-full h-full transform scale-110 grayscale contrast-125" alt="Abstract brutalist architecture" />
    
    <!-- Overlay gelap untuk memastikan badge Fig.01 tetap terbaca -->
    <div class="absolute inset-0 bg-primary/40 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-1000"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none"></div>
    
    <div class="absolute bottom-8 left-8 text-accent font-body text-xs tracking-widest uppercase border border-[#333] bg-[#0a0a0a]/80 backdrop-blur px-4 py-2 rounded-full z-10 flex items-center gap-3">
        <div class="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
        Fig. 01 — Aesthetic Chaos
    </div>
    
</div>
    </div>
  </section>
</template>
