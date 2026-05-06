<script setup lang="ts">
import { ref } from 'vue'
import Magnetic from './Magnetic.vue'
import { Menu, X } from 'lucide-vue-next'

const isOpen = ref(false)

const links = [
  { name: 'About', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Capabilities', href: '#capabilities' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Awards', href: '#awards' }
]
</script>

<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl transition-all duration-300">
    <nav class="bg-[#111]/80 backdrop-blur-xl border border-[#333] px-6 py-3 rounded-full flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] relative z-10">
      <!-- Logo -->
      <Magnetic>
        <a href="#" class="font-heading text-xl md:text-2xl tracking-widest uppercase cursor-pointer text-secondary">HKM.</a>
      </Magnetic>
      
      <!-- Desktop Links -->
      <div class="hidden md:flex gap-6 lg:gap-8 text-[0.65rem] lg:text-xs uppercase tracking-widest font-body font-medium text-[#aaa]">
        <Magnetic v-for="link in links" :key="link.name">
          <a :href="link.href" class="hover:text-white transition-colors">{{ link.name }}</a>
        </Magnetic>
      </div>

      <!-- CTA Button -->
      <div class="hidden md:block">
        <Magnetic>
          <a href="#contact" class="bg-secondary text-primary px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors block">
            Let's Talk
          </a>
        </Magnetic>
      </div>

      <!-- Mobile Hamburger -->
      <button class="md:hidden text-secondary p-1" @click="isOpen = !isOpen">
        <Menu v-if="!isOpen" :size="24" />
        <X v-else :size="24" />
      </button>
    </nav>
    
    <!-- Mobile Menu Dropdown (Opens Upwards) -->
    <div 
      class="md:hidden overflow-hidden transition-all duration-300 ease-in-out absolute bottom-full left-0 w-full mb-4 origin-bottom"
      :class="isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'"
    >
      <div class="bg-[#111]/95 backdrop-blur-xl border border-[#333] rounded-2xl p-6 flex flex-col gap-6 text-center shadow-2xl">
        <a v-for="link in links" :key="link.name" :href="link.href" class="text-xl font-heading text-secondary uppercase tracking-wider" @click="isOpen = false">
          {{ link.name }}
        </a>
        <a href="#contact" class="text-xl font-heading text-accent uppercase tracking-wider border-t border-[#333] pt-4 mt-2" @click="isOpen = false">Contact</a>
      </div>
    </div>
  </div>
</template>
