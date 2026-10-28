<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getBuilding } from '@/data/projects'

const route = useRoute()
const item = computed(() => getBuilding(route.params.slug as string))
</script>

<template>
  <section class="w-full min-h-screen py-32 px-6 md:px-24 bg-primary">
    <div v-if="item" class="max-w-4xl mx-auto w-full">
      <RouterLink to="/#building" class="font-body text-xs uppercase tracking-widest text-accent hover:text-secondary transition-colors">← Back</RouterLink>

      <div class="mt-10 mb-4 text-accent uppercase tracking-widest text-sm font-body">What I'm Building</div>
      <h1 class="text-5xl md:text-8xl font-heading text-secondary uppercase leading-none mb-4">{{ item.title }}</h1>
      <div class="text-accent font-body uppercase tracking-widest text-sm mb-12">{{ item.tagline }}</div>

      <p class="font-body text-lg md:text-xl font-light leading-relaxed text-[#aaa] max-w-3xl mb-16">{{ item.detail }}</p>

      <a :href="item.link" target="_blank" rel="noopener"
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
