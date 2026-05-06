<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'

const heroWrapper = ref<HTMLElement | null>(null)
const mainText = ref<HTMLElement | null>(null)
const floaters = ref<HTMLElement[]>([])

const handleParallax = (clientX: number, clientY: number) => {
  if (!mainText.value) return
  const { innerWidth, innerHeight } = window
  
  const isMobile = innerWidth < 768
  const maxTilt = isMobile ? 12 : 30 // Sedikit dikurangi di mobile agar tidak terlalu miring
  
  const xPos = (clientX / innerWidth - 0.5) * maxTilt
  const yPos = (clientY / innerHeight - 0.5) * -maxTilt
  
  gsap.to(mainText.value, {
    rotateX: yPos,
    rotateY: xPos,
    duration: 1,
    ease: "power2.out"
  })
  
  floaters.value.forEach((floater, i) => {
    const speed = isMobile ? (i + 1) * 8 : (i + 1) * 20
    // Kita gunakan x dan y (pixel) untuk parallax
    gsap.to(floater, {
      x: (clientX / innerWidth - 0.5) * speed,
      y: (clientY / innerHeight - 0.5) * speed,
      duration: 1.5,
      ease: "power2.out"
    })
  })
}

const onMouseMove = (e: MouseEvent) => handleParallax(e.clientX, e.clientY)
const onTouchMove = (e: TouchEvent) => {
  handleParallax(e.touches[0].clientX, e.touches[0].clientY)
}

onMounted(() => {
  // 1. Entrance Animation untuk Teks
  gsap.fromTo('.hero-text-line', 
    { yPercent: 120, skewY: 10, opacity: 0 },
    { yPercent: 0, skewY: 0, opacity: 1, duration: 1.5, stagger: 0.1, ease: "power4.out", delay: 2 }
  )

  // 2. Entrance Animation untuk Elemen Mengambang
  gsap.fromTo(floaters.value,
    { scale: 0, opacity: 0, rotation: -45 },
    { scale: 1, opacity: 1, rotation: 0, duration: 1.5, stagger: 0.2, ease: "back.out(1.5)", delay: 2.5,
      onComplete: () => {
        // 3. Continuous Floating Animation (Berjalan terus-menerus)
        // Menggunakan yPercent agar tidak bentrok dengan nilai y (pixel) dari Parallax
        gsap.to(floaters.value, {
          yPercent: 10,
          rotation: () => Math.random() * 4 - 2, // Rotasi acak tipis
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: 0.4
        })
      }
    }
  )
  
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('touchmove', onTouchMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('touchmove', onTouchMove)
})
</script>

<template>
  <section id="hero" ref="heroWrapper" class="h-[100dvh] w-full relative overflow-hidden flex flex-col items-center justify-center bg-primary" style="perspective: 1000px;">
    
    <!-- Profile/Abstract Image: Dinaikkan ke top-[10vh] di mobile agar menjauh dari teks -->
    <div :ref="el => { if(el) floaters.push(el as HTMLElement) }" 
         class="absolute z-0
                top-[10vh] left-1/2 -translate-x-1/2 
                md:top-[20%] md:left-[10%] md:translate-x-0 
                w-48 h-48 sm:w-56 sm:h-56 md:w-48 md:h-48 
                rounded-full overflow-hidden filter grayscale contrast-125">
       <img src="@/assets/hikam.webp" class="w-full h-full object-cover" alt="Creative abstract" />
    </div>

    <!-- Massive Anti-Mainstream Text: Diturunkan sedikit ke mt-[18vh] di mobile agar memberi ruang untuk foto di atasnya -->
    <div ref="mainText" class="relative z-10 flex flex-col transform-style-3d pointer-events-none mix-blend-difference w-full px-4 mt-[18vh] md:mt-0">
      <div class="overflow-hidden w-full flex justify-start md:justify-center">
         <h1 class="hero-text-line text-[26vw] md:text-[15vw] leading-[0.75] md:leading-[0.8] font-heading text-secondary uppercase tracking-tighter m-0 ml-[4vw] md:-ml-[10vw]">Developer</h1>
      </div>
      <div class="overflow-hidden w-full flex justify-start md:justify-center">
         <!-- Pada mobile didorong ke kanan agar mengisi ruang kosong -->
         <h1 class="hero-text-line text-[26vw] md:text-[15vw] leading-[0.75] md:leading-[0.8] font-heading text-secondary uppercase tracking-tighter m-0 ml-[28vw] md:ml-[15vw]">Data<span class="text-accent italic">&nbsp;&</span></h1>
      </div>
      <div class="overflow-hidden w-full flex justify-start md:justify-center">
         <h1 class="hero-text-line text-[26vw] md:text-[15vw] leading-[0.75] md:leading-[0.8] font-heading text-secondary uppercase tracking-tighter m-0 ml-[8vw] md:-ml-[5vw]">Scientist</h1>
      </div>
    </div>
    
    <!-- Available Badge: Disesuaikan agar mengisi gap di sebelah kanan-bawah teks -->
    <div :ref="el => { if(el) floaters.push(el as HTMLElement) }" class="absolute top-[48vh] right-[4vw] md:top-auto md:bottom-[25%] md:right-[15%] w-20 h-20 md:w-32 md:h-32 flex items-center justify-center border border-accent rounded-full border-dashed z-20">
       <div class="absolute inset-0 animate-[spin_10s_linear_infinite] border border-secondary rounded-full border-dashed opacity-50"></div>
       <span class="text-[0.45rem] md:text-xs font-body text-secondary uppercase tracking-widest text-center leading-tight">Available<br/>Collaboration</span>
    </div>
    
    <!-- Descriptive Text: Ditampilkan di mobile agar layar bawah tidak kosong -->
    <div :ref="el => { if(el) floaters.push(el as HTMLElement) }" class="absolute bottom-[20%] left-[6vw] w-[60%] md:top-[35%] md:bottom-auto md:right-[8%] md:left-auto md:w-48 z-20 text-left md:text-right mix-blend-difference">
       <p class="text-[0.65rem] md:text-xs font-body uppercase text-accent tracking-widest leading-relaxed">
         Bridging the gap between aesthetic brutalism and logical precision.
       </p>
    </div>
    
    <!-- Location -->
    <!-- <div :ref="el => { if(el) floaters.push(el as HTMLElement) }" class="absolute bottom-[8%] left-[6vw] md:bottom-[10%] md:left-[5%] flex items-center gap-3 z-20 mix-blend-difference">
       <div class="w-8 md:w-12 h-[1px] bg-secondary"></div>
       <span class="text-[0.6rem] md:text-[0.65rem] font-body text-secondary uppercase tracking-widest">Yogyakarta, ID</span>
    </div> -->
    
    <!-- Background Texture -->
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,#111_0%,transparent_100%)] opacity-50 pointer-events-none"></div>

  </section>
</template>

<style scoped>
.transform-style-3d {
  transform-style: preserve-3d;
}
</style>