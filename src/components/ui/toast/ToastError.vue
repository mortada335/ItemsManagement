<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'

const { toast } = useToast()

const showSuccessToast = () => {
  toast({
    title: 'Success!',
    description: 'Your action was completed successfully.',
  })
}

const showErrorToast = () => {
  toast({
    title: 'Error!',
    description: 'Something went wrong.',
    variant: 'destructive',
  })
}
</script>

<template>
  <div class="space-y-4">
    <Button @click="showSuccessToast">Show Success Toast</Button>
    <Button @click="showErrorToast" variant="destructive">Show Error Toast</Button>
  </div>
</template>
