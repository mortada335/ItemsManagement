<script setup lang="ts">
import { computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2 } from 'lucide-vue-next'
import type { Item } from '@/stores/item-store'

const props = defineProps<{
  open: boolean
  item: Item | null
}>()

const emit = defineEmits<{
  close: []
  edit: [item: Item]
  delete: [id: number]
}>()

const formattedDate = computed(() => {
  if (!props.item?.createdAt) return ''

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(props.item.createdAt))
})

const formattedPrice = computed(() => {
  if (!props.item) return ''

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.item.price)
})

const getPriorityColor = (priority: string): string => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
  }
}

const handleEdit = () => {
  if (props.item) {
    emit('edit', props.item)
  }
  emit('close')
}

const handleDelete = () => {
  if (props.item) {
    if (confirm('Are you sure you want to delete this item?')) {
      emit('delete', props.item.id)
    }
  }
  emit('close')
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Item Details</DialogTitle>
        <DialogDescription> View detailed information about this item. </DialogDescription>
      </DialogHeader>

      <div v-if="item" class="py-4">
        <div class="grid gap-6">
          <!-- Header with name and actions -->
          <div class="flex items-start justify-between">
            <h3 class="text-xl font-semibold">{{ item.name }}</h3>
            <div class="flex gap-2">
              <Badge :class="getPriorityColor(String(item.priority))">
                {{ item.priority }}
              </Badge>
            </div>
          </div>

          <!-- Item details -->
          <div class="grid gap-4">
            <div>
              <h4 class="text-sm font-medium text-muted-foreground mb-1">Description</h4>
              <p class="text-sm">{{ item.description || 'No description provided.' }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                <p class="text-sm">{{ item.category }}</p>
              </div>

              <div>
                <h4 class="text-sm font-medium text-muted-foreground mb-1">Price</h4>
                <p class="text-sm font-semibold">{{ formattedPrice }}</p>
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-muted-foreground mb-1">Created</h4>
              <p class="text-sm">{{ formattedDate }}</p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter class="flex justify-between sm:justify-between">
        <div class="flex gap-2">
          <Button variant="outline" size="sm" @click="handleEdit" class="gap-1">
            <Edit class="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" @click="handleDelete" class="gap-1">
            <Trash2 class="h-4 w-4" />
            Delete
          </Button>
        </div>
        <Button variant="secondary" @click="emit('close')">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
