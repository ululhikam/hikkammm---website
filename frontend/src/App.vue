<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import CustomCursor from './components/CustomCursor.vue'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const isAdmin = computed(() => route.meta.layout === 'admin')

let lenis: Lenis | null = null
let ticker: ((time: number) => void) | null = null

function startSmoothScroll(): void {
  if (lenis) return

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  ticker = (time) => {
    lenis?.raf(time * 1000)
  }

  gsap.ticker.add(ticker)
  gsap.ticker.lagSmoothing(0)
}

function stopSmoothScroll(): void {
  if (ticker) {
    gsap.ticker.remove(ticker)
    ticker = null
  }

  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}

watch(
  isAdmin,
  (admin) => {
    if (admin) {
      stopSmoothScroll()
      return
    }

    startSmoothScroll()
  },
  { immediate: true },
)

onBeforeUnmount(stopSmoothScroll)
</script>

<template>
  <template v-if="!isAdmin">
    <div class="fixed inset-0 pointer-events-none z-[999] opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <LoadingScreen />
    <CustomCursor />
    <Navbar />
    <main class="w-full relative z-10 flex flex-col items-center overflow-hidden">
      <RouterView />
    </main>
  </template>
  <RouterView v-else />
</template>