<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'
import VisionSection from '@/components/VisionSection.vue'
import NowSection from '@/components/NowSection.vue'
import AboutPage from '@/sections/About.vue'
import ServicesPage from '@/sections/Services.vue'
import CapabilitiesPage from '@/sections/Capabilities.vue'
import PortfolioPage from '@/sections/Portfolio.vue'
import ExperiencePage from '@/sections/Experience.vue'
import AwardsPage from '@/sections/Awards.vue'
import ContactPage from '@/sections/Contact.vue'
import BuildingSection from '@/components/BuildingSection.vue'
</script>

<template>
  <HeroSection />
  <AboutPage />
  <ServicesPage />
  <CapabilitiesPage />
  <PortfolioPage />
  <BuildingSection />
  <ExperiencePage />
  <AwardsPage />
  <VisionSection />
  <NowSection />
  <ContactPage />
</template>
