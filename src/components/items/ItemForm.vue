<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { type Item } from '@/stores/item-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps<{
  open: boolean
  item: Item | null
}>()

const emit = defineEmits<{
  close: []
  submit: [item: Item | Omit<Item, 'id' | 'createdAt'>]
}>()

const formData: any = ref({
  name: '',
  description: '',
  category: '',
  price: 0,
})

const isEditing = computed(() => !!props.item)
const dialogTitle = computed(() => (isEditing.value ? 'Edit Item' : 'Add New Item'))

watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      formData.value = {
        name: newItem.name,
        description: newItem.description,
        category: newItem.category,
        price: newItem.price,
      }
    } else {
      formData.value = {
        name: '',
        description: '',
        category: '',
        price: 0,
      }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  if (isEditing.value && props.item) {
    emit('submit', {
      ...props.item,
      ...formData.value,
    })
  } else {
    emit('submit', formData.value)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
        <DialogDescription>
          {{
            isEditing
              ? 'Edit the details of your item below.'
              : 'Fill in the details of your new item below.'
          }}
        </DialogDescription>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="name">Name</Label>
          <Input id="name" v-model="formData.name" placeholder="Item name" required />
        </div>

        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="Item description"
          />
        </div>

        <div class="space-y-2">
          <Label for="category">Category</Label>
          <Input id="category" v-model="formData.category" placeholder="Item category" required />
        </div>

        <div class="space-y-2">
          <Label for="price">Price</Label>
          <Input
            id="price"
            v-model.number="formData.price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="emit('close')">Cancel</Button>
          <Button type="submit">{{ isEditing ? 'Update' : 'Create' }}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
