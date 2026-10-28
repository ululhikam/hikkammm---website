import { reactive } from 'vue'

export type AdminToastType = 'success' | 'error' | 'info'

export interface AdminToast {
  id: number
  type: AdminToastType
  message: string
}

const toasts = reactive<AdminToast[]>([])
let nextId = 1

function remove(id: number): void {
  const index = toasts.findIndex((toast) => toast.id === id)

  if (index >= 0) {
    toasts.splice(index, 1)
  }
}

function push(type: AdminToastType, message: string): number {
  const id = nextId++
  toasts.push({ id, type, message })
  window.setTimeout(() => remove(id), 4500)
  return id
}

export function useAdminToast() {
  return {
    toasts,
    remove,
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
    info: (message: string) => push('info', message),
  }
}