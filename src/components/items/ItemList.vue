<script setup lang="ts">
import { ref } from 'vue'
import { useItemStore, type Item } from '@/stores/item-store'
import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Trash2, RefreshCw, Eye, Plus } from 'lucide-vue-next'
import ItemForm from './ItemForm.vue'
import DialogViewItem from '../ui/dialog/DialogItemView.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
const itemStore = useItemStore()
const { toast } = useToast()

const showForm = ref(false)
const showViewDialog = ref(false)
const selectedItem = ref<Item | null>(null)
const editingItem = ref<Item | null>(null)
const refreshing = ref(false)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

const handleViewItem = (item: Item) => {
  selectedItem.value = { ...item }
  showViewDialog.value = true
}

const handleEdit = (item: Item) => {
  editingItem.value = { ...item }
  showForm.value = true
  showViewDialog.value = false
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this item?')) {
    const deleted = await itemStore.deleteItem(id)
    if (deleted) {
      toast({
        title: 'Item Deleted',
        description: `${deleted.name} has been removed.`,
      })
    }
  }

  showViewDialog.value = false
}

const handleAddNew = () => {
  editingItem.value = null
  showForm.value = true
}

const handleFormClose = () => {
  showForm.value = false
  editingItem.value = null
}

const handleFormSubmit = async (item: Item | Omit<Item, 'id' | 'createdAt'>) => {
  if ('id' in item) {
    const updated = await itemStore.updateItem(item.id, {
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
    })

    if (updated) {
      toast({
        title: 'Item Updated',
        description: `${updated.name} has been updated.`,
      })
    }
  } else {
    const newItem = await itemStore.addItem(item)
    if (newItem) {
      toast({
        title: 'Item Added',
        description: `${newItem.name} has been added.`,
      })
    }
  }

  showForm.value = false
  editingItem.value = null
}

const handleRefresh = async () => {
  refreshing.value = true
  await itemStore.fetchItems()
  refreshing.value = false

  toast({
    title: itemStore.isUsingDummyData ? 'Using Offline Data' : 'Data Refreshed',
    description: itemStore.isUsingDummyData
      ? 'Could not connect to the API. Using local data instead.'
      : 'Successfully refreshed data from the API.',
  })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Items</h2>
      <div class="flex gap-2">
        <Button
          @click="handleRefresh"
          variant="outline"
          size="sm"
          :disabled="refreshing"
          class="gap-1"
        >
          <RefreshCw v-if="!refreshing" class="h-4 w-4" />
          <div
            v-else
            class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          ></div>
          <span>Refresh</span>
        </Button>
        <Button @click="handleAddNew" size="sm" class="gap-1">
          <Plus class="h-4 w-4" />
          <span>Add New Item</span>
        </Button>
      </div>
    </div>
    <Alert
      v-if="itemStore.isUsingDummyData"
      variant="default"
      class="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
    >
      <WifiOff class="h-4 w-4" />
      <AlertTitle>Offline Mode</AlertTitle>
      <AlertDescription>
        Could not connect to the API. You're currently viewing and editing local data. Changes will
        not be synchronized with the server until connection is restored.
      </AlertDescription>
    </Alert>

    <div v-if="itemStore.loading" class="flex justify-center p-8">
      <div
        class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"
      ></div>
    </div>

    <Table v-else>
      <TableCaption>A list of your items.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Category</TableHead>
          <TableHead class="text-right">Price</TableHead>
          <TableHead>Created</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="item in itemStore.items"
          :key="item.id"
          class="cursor-pointer hover:bg-muted/50"
          @click="handleViewItem(item)"
        >
          <TableCell class="font-medium">{{ item.name }}</TableCell>
          <TableCell>{{ item.description }}</TableCell>
          <TableCell>{{ item.category }}</TableCell>
          <TableCell class="text-right">{{ formatPrice(item.price) }}</TableCell>
          <TableCell>{{ formatDate(item.createdAt) }}</TableCell>
          <TableCell class="text-right">
            <div class="flex justify-end gap-2" @click.stop>
              <Button variant="ghost" size="icon" @click="handleEdit(item)">
                <Edit class="h-4 w-4" />
                <span class="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon" @click="handleDelete(item.id)">
                <Trash2 class="h-4 w-4" />
                <span class="sr-only">Delete</span>
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <ItemForm
      v-if="showForm"
      :open="showForm"
      :item="editingItem"
      @close="handleFormClose"
      @submit="handleFormSubmit"
    />

    <DialogViewItem
      v-if="showViewDialog"
      :open="showViewDialog"
      :item="selectedItem"
      @close="showViewDialog = false"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>
