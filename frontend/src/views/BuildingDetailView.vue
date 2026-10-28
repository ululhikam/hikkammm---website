<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getBuilding as getStaticBuilding } from '@/data/projects'
import { ApiError, api } from '@/lib/api'
import { mapPublicBuilding, type PublicBuilding } from '@/lib/publicContent'

const route = useRoute()
const item = ref<PublicBuilding | null>(null)
const loading = ref(true)

async function loadBuilding(slug: string): Promise<void> {
  loading.value = true

  try {
    const response = await api.getBuilding(slug)
    item.value = mapPublicBuilding(response.data)
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 404) {
      item.value = null
    } else {
      item.value = getStaticBuilding(slug) ?? null
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string') {
      void loadBuilding(slug)
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="w-full min-h-screen py-32 px-6 md:px-24 bg-primary">
    <div v-if="loading" class="max-w-4xl mx-auto w-full animate-pulse">
      <div class="h-3 w-24 rounded bg-white/10"></div>
      <div class="mt-8 h-4 w-40 rounded bg-white/10"></div>
      <div class="mt-4 h-16 w-3/4 rounded bg-white/10 md:h-24"></div>
      <div class="mt-4 h-4 w-48 rounded bg-white/10"></div>
      <div class="mt-12 h-24 w-full rounded bg-white/[0.04]"></div>
    </div>

    <div v-else-if="item" class="max-w-4xl mx-auto w-full">
      <RouterLink to="/#building" class="font-body text-xs uppercase tracking-widest text-accent hover:text-secondary transition-colors">← Back</RouterLink>

      <div class="mt-10 mb-4 text-accent uppercase tracking-widest text-sm font-body">What I'm Building</div>
      <h1 class="text-5xl md:text-8xl font-heading text-secondary uppercase leading-none mb-4">{{ item.title }}</h1>
      <div class="text-accent font-body uppercase tracking-widest text-sm mb-12">{{ item.tagline }}</div>

      <p class="font-body text-lg md:text-xl font-light leading-relaxed text-[#aaa] max-w-3xl mb-16">{{ item.detail }}</p>

      <a v-if="item.link" :href="item.link" target="_blank" rel="noopener"
        class="inline-flex items-center gap-3 bg-secondary text-primary font-heading text-xl uppercase px-8 py-4 rounded-full hover:bg-accent transition-colors">
        Visit {{ item.title }} →
      </a>
    </div>

    <div v-else class="max-w-5xl mx-auto text-center py-40">
      <h1 class="text-4xl font-heading text-secondary uppercase mb-6">Not found</h1>
      <RouterLink to="/" class="font-body text-accent underline underline-offset-4">Back home</RouterLink>
    </div>
  </section>
</template>
