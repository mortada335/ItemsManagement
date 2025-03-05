<script setup lang="ts">
import { useToast } from './use-toast'
import { X } from 'lucide-vue-next'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="bg-background border rounded-md shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right"
      :class="toast.variant === 'destructive' ? 'border-red-500' : 'border-border'"
    >
      <div class="flex-1">
        <h3 class="font-medium" :class="toast.variant === 'destructive' ? 'text-red-500' : ''">
          {{ toast.title }}
        </h3>
        <p v-if="toast.description" class="text-sm text-muted-foreground mt-1">
          {{ toast.description }}
        </p>
      </div>
      <button @click="dismiss(toast.id)" class="text-muted-foreground hover:text-foreground">
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </button>
    </div>
  </div>
</template>
