import { computed, ref, type Ref } from 'vue'
import type { ListResponse, PaginationMeta, PaginationQuery } from '@/lib/types'

export function usePaginatedList<T>(
  loader: (query: PaginationQuery) => Promise<ListResponse<T>>,
  pageSize = 20,
) {
  const items = ref([]) as Ref<T[]>
  const meta = ref<PaginationMeta>({ total: 0, limit: pageSize, offset: 0 })
  const loading = ref(false)
  const error = ref('')
  const page = ref(1)

  const totalPages = computed(() => Math.max(1, Math.ceil(meta.value.total / pageSize)))
  const hasNext = computed(() => page.value < totalPages.value)
  const hasPrev = computed(() => page.value > 1)

  async function load(): Promise<void> {
    loading.value = true
    error.value = ''

    try {
      const response = await loader({
        limit: pageSize,
        offset: (page.value - 1) * pageSize,
      })

      items.value = response.data
      meta.value = response.meta

      if (page.value > totalPages.value) {
        page.value = totalPages.value
      }
    } catch (caught) {
      error.value = caught instanceof Error ? caught.message : 'Gagal memuat data'
    } finally {
      loading.value = false
    }
  }

  function next(): void {
    if (hasNext.value) {
      page.value += 1
      void load()
    }
  }

  function prev(): void {
    if (hasPrev.value) {
      page.value -= 1
      void load()
    }
  }

  function reset(): Promise<void> {
    page.value = 1
    return load()
  }

  return {
    items,
    meta,
    loading,
    error,
    page,
    totalPages,
    hasNext,
    hasPrev,
    load,
    next,
    prev,
    reset,
  }
}