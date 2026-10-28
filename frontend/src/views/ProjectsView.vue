<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { projects as staticProjects } from '@/data/projects'
import { loadProjects, type PublicProject } from '@/lib/publicContent'

const projects = ref<PublicProject[]>([...staticProjects])

onMounted(() => {
  void loadProjects()
    .then((items) => {
      projects.value = items
    })
    .catch(() => {
      // Tetap pakai data statis kalau API tidak bisa diakses.
    })
})
</script>

<template>
  <section class="w-full min-h-screen py-32 px-6 md:px-24 bg-primary">
    <div class="max-w-7xl mx-auto w-full">
      <h1 class="text-5xl md:text-8xl font-heading text-secondary uppercase mb-4">Projects</h1>
      <p class="font-body text-accent max-w-xl mb-20">
        Selected work — from client websites to ongoing experiments. Click a project for the full story.
      </p>

      <div class="flex flex-col border-t border-[#333]">
        <RouterLink
          v-for="p in projects"
          :key="p.slug"
          :to="`/projects/${p.slug}`"
          class="group border-b border-[#333] py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:pl-6 transition-all duration-500"
        >
          <div>
            <div class="text-sm uppercase tracking-widest font-body text-accent mb-2">{{ p.category }} — {{ p.year }}</div>
            <h3 class="text-3xl md:text-6xl font-heading text-secondary uppercase group-hover:text-accent transition-colors">{{ p.title }}</h3>
          </div>
          <div class="text-left md:text-right">
            <p class="font-body text-sm text-[#888] max-w-sm mb-2">{{ p.desc }}</p>
            <div class="text-xs uppercase tracking-widest text-accent">{{ p.tech }}</div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>
