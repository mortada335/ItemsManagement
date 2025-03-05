import { ref, computed } from 'vue'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const toast = (props: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      title: props.title,
      description: props.description,
      variant: props.variant || 'default',
      duration: props.duration || 5000,
    }

    toasts.value = [...toasts.value, newToast]

    setTimeout(() => {
      dismiss(id)
    }, newToast.duration)

    return id
  }

  const dismiss = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toast,
    dismiss,
    toasts: computed(() => toasts.value),
  }
}
