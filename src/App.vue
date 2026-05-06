<script setup lang="ts">
import { onMounted } from 'vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import HeroSection from './components/HeroSection.vue'
import VisionSection from './components/VisionSection.vue'
import NowSection from './components/NowSection.vue'
import Navbar from './components/Navbar.vue'
import LoadingScreen from './components/LoadingScreen.vue'

// Imported from new public folder as pages
import AboutPage from './public/About.vue'
import ServicesPage from './public/Services.vue'
import CapabilitiesPage from './public/Capabilities.vue'
import PortfolioPage from './public/Portfolio.vue'
import AwardsPage from './public/Awards.vue'
import ContactPage from './public/Contact.vue'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
})
</script>

<template>
  <div class="fixed inset-0 pointer-events-none z-[999] opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
  <LoadingScreen />
  <!-- <CustomCursor /> -->
  <Navbar />
  <main class="w-full relative z-10 flex flex-col items-center overflow-hidden">
    <HeroSection />
    <AboutPage />
    <ServicesPage />
    <CapabilitiesPage />
    <PortfolioPage />
    <AwardsPage />
    <VisionSection />
    <NowSection />
    <ContactPage />
  </main>
</template>

<style>
/* Add any global App specific styles here */
</style>
