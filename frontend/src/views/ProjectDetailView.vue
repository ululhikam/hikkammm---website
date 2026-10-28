<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getProject as getStaticProject } from '@/data/projects'
import { ApiError, api } from '@/lib/api'
import { mapPublicProject, type PublicProject } from '@/lib/publicContent'

const route = useRoute()
const project = ref<PublicProject | null>(null)
const loading = ref(true)

async function loadProject(slug: string): Promise<void> {
  loading.value = true

  try {
    const response = await api.getProject(slug)
    project.value = mapPublicProject(response.data)
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 404) {
      project.value = null
    } else {
      project.value = getStaticProject(slug) ?? null
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string') {
      void loadProject(slug)
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="w-full min-h-screen py-32 px-6 md:px-24 bg-primary">
    <div v-if="loading" class="max-w-5xl mx-auto w-full animate-pulse">
      <div class="h-3 w-28 rounded bg-white/10"></div>
      <div class="mt-8 h-4 w-48 rounded bg-white/10"></div>
      <div class="mt-4 h-16 w-3/4 rounded bg-white/10 md:h-24"></div>
      <div class="mt-10 h-72 w-full rounded border border-[#333] bg-white/[0.04] md:h-[28rem]"></div>
      <div class="mt-10 h-24 w-full rounded bg-white/[0.04]"></div>
    </div>

    <div v-else-if="project" class="max-w-5xl mx-auto w-full">
      <RouterLink to="/projects" class="font-body text-xs uppercase tracking-widest text-accent hover:text-secondary transition-colors">← All Projects</RouterLink>

      <div class="mt-10 mb-4 text-accent uppercase tracking-widest text-sm font-body">{{ project.category }} — {{ project.year }}</div>
      <h1 class="text-5xl md:text-8xl font-heading text-secondary uppercase leading-none mb-10">{{ project.title }}</h1>

      <div class="w-full h-72 md:h-[28rem] overflow-hidden rounded border border-[#333] mb-12">
        <img :src="project.img" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" :alt="project.title" />
      </div>

      <p class="font-body text-lg md:text-xl font-light leading-relaxed text-[#aaa] max-w-3xl mb-16">{{ project.fullDesc }}</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-[#333] pt-10 font-body text-sm uppercase tracking-widest">
        <div>
          <div class="text-[#666] mb-2">Stack</div>
          <div class="text-secondary">{{ project.tech }}</div>
        </div>
        <div>
          <div class="text-[#666] mb-2">Status</div>
          <div class="text-secondary">{{ project.status }}</div>
        </div>
        <div>
          <div class="text-[#666] mb-2">Year</div>
          <div class="text-secondary">{{ project.year }}</div>
        </div>
        <div>
          <div class="text-[#666] mb-2">Links</div>
          <div class="flex gap-4">
            <a v-if="project.live" :href="project.live" target="_blank" rel="noopener" class="text-secondary underline underline-offset-4 hover:text-accent">Live</a>
            <a v-if="project.repo" :href="project.repo" target="_blank" rel="noopener" class="text-secondary underline underline-offset-4 hover:text-accent">Repo</a>
            <span v-if="!project.live && !project.repo" class="text-[#666]">—</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-5xl mx-auto text-center py-40">
      <h1 class="text-4xl font-heading text-secondary uppercase mb-6">Project not found</h1>
      <RouterLink to="/projects" class="font-body text-accent underline underline-offset-4">Back to projects</RouterLink>
    </div>
  </section>
</template>
