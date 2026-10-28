<script setup lang="ts">
const groups = [
  { label: 'Programming', items: ['Python', 'PHP', 'JavaScript', 'C++', 'Java', 'TypeScript'] },
  { label: 'Web & Backend', items: ['Vue', 'Next.js', 'Node.js', 'Laravel', 'CodeIgniter', 'Django'] },
  { label: 'Data & Infra', items: ['MySQL', 'PostgreSQL', 'Prisma', 'Supabase', 'Git', 'Vercel'] },
  { label: 'Currently Exploring', items: ['Data Science', 'Data Engineering', 'Data Analytics', 'NLP', 'LLMs'] },
]
</script>
<template>
  <section id="capabilities" class="w-full py-32 px-6 md:px-24 bg-[#050505]">
    <div class="max-w-6xl mx-auto w-full">
      <h2 class="text-4xl md:text-8xl font-heading text-secondary mb-24 uppercase">Capabilities</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
        <div v-for="(group, i) in groups" :key="i" class="space-y-8">
          <h3 class="text-xl font-body text-accent uppercase tracking-widest border-b border-[#333] pb-4">{{ group.label }}</h3>
          <div class="flex flex-wrap gap-3">
            <span v-for="item in group.items" :key="item"
              class="font-heading text-2xl md:text-4xl text-[#666] hover:text-white transition-colors cursor-default border border-[#1a1a1a] hover:border-[#444] rounded-lg px-4 py-2 bg-[#0a0a0a]">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
