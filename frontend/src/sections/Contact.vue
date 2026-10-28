<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Magnetic from '../components/Magnetic.vue'

const socialLinks = [
  { name: 'Website', url: 'https://hikkammm.my.id' },
  { name: 'Concern Dev', url: 'https://concern.web.id' },
  { name: 'Instagram', url: 'https://instagram.com/hikkammm_' },
  { name: 'Instagram (Brand)', url: 'https://instagram.com/necromanceroccultism' },
  { name: 'LinkedIn', url: 'https://id.linkedin.com/in/ulul-hikam' },
  { name: 'GitHub', url: 'https://github.com/ululhikam' },
  { name: 'WhatsApp', url: 'https://wa.me/6285211435617' }
]

const navLinks = [
  { name: 'About', url: '/#about' },
  { name: 'Capabilities', url: '/#capabilities' },
  { name: 'Projects', url: '/projects' },
  { name: 'Building', url: '/#building' },
  { name: 'Experience', url: '/#experience' },
  { name: 'Wins', url: '/#wins' },
  { name: 'Contact', url: '/#contact' }
]

// Untuk menampilkan waktu lokal di footer
const time = ref('')
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    time.value = new Date().toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta', 
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WIB'
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <!-- Menambahkan pb-32 (mobile) dan pb-40 (desktop) untuk memberi ruang pada bubble navbar -->
  <footer id="contact" class="w-full bg-[#050505] pt-32 pb-32 md:pb-40 px-6 md:px-12 border-t border-[#1a1a1a] relative overflow-hidden flex flex-col justify-between text-white">
    
    <!-- Modern Grid Background with Radial Mask -->
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20 relative">
      
      <!-- Left Column: CTA -->
      <div class="lg:col-span-8 flex flex-col items-start">
        <h2 class="text-5xl md:text-7xl lg:text-[5.5rem] font-heading uppercase leading-[1.1] mb-10 text-gray-100 tracking-tight">
          Got a project? <br />
          <span class="text-gray-400 italic font-light">Let's Talk.</span>
        </h2>
        
        <Magnetic>
          <a href="mailto:cemengsableng@gmail.com" class="group inline-flex items-center justify-center gap-4 bg-white text-black font-heading text-lg md:text-2xl uppercase px-10 py-5 rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95">
            <span>cemengsableng@gmail.com</span>
            <svg class="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </Magnetic>
      </div>

      <!-- Right Column: Links -->
      <div class="lg:col-span-4 grid grid-cols-2 gap-10 font-body text-sm uppercase tracking-widest">
        <!-- Socials -->
        <div class="flex flex-col gap-6">
          <h4 class="text-gray-500 font-bold mb-4 text-xs">Socials</h4>
          <!-- Ubah v-for di sini -->
          <template v-for="item in socialLinks" :key="item.name">
            <Magnetic>
              <!-- Tambahkan :href="item.url" dan target="_blank" agar buka di tab baru -->
              <a :href="item.url" target="_blank" rel="noopener noreferrer" class="group flex items-center w-fit text-gray-300 hover:text-white transition-colors duration-300">
                <span class="relative overflow-hidden pb-1">
                  {{ item.name }}
                  <span class="absolute bottom-0 left-0 w-full h-[1px] bg-white translate-x-[-105%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                </span>
                <svg class="w-3.5 h-3.5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </Magnetic>
          </template>
        </div>

        <!-- Navigation -->
        <div class="flex flex-col gap-6">
          <h4 class="text-gray-500 font-bold mb-4 text-xs">Menu</h4>
          <!-- Ubah v-for di sini -->
          <template v-for="item in navLinks" :key="item.name">
            <Magnetic>
              <!-- Tambahkan :href="item.url" -->
              <RouterLink :to="item.url" class="group flex items-center w-fit text-gray-300 hover:text-white transition-colors duration-300">
                <span class="relative overflow-hidden pb-1">
                  {{ item.name }}
                  <span class="absolute bottom-0 left-0 w-full h-[1px] bg-white translate-x-[-105%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                </span>
              </RouterLink>
            </Magnetic>
          </template>
        </div>      </div>
    </div>

    <!-- Bottom Copyright Bar -->
    <div class="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center text-[10px] sm:text-xs font-body text-gray-500 uppercase tracking-[0.2em] mt-auto z-10 border-t border-white/10 pt-8">
      <div class="flex items-center gap-6 mb-4 md:mb-0">
        <span>© {{ new Date().getFullYear() }}</span>
        <span class="hidden sm:inline-block w-1 h-1 rounded-full bg-gray-600"></span>
        <span class="hidden sm:inline-block">Yogyakarta, {{ time || 'Loading...' }}</span>
      </div>
    </div>
  </footer>
</template>
