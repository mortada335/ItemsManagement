<script setup lang="ts">
import { ref, onMounted, watch, watchEffect } from 'vue'
import {
  Sun,
  Moon,
  WifiOff,
  Home,
  Package,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
} from 'lucide-vue-next'
import ItemList from '@/components/items/ItemList.vue'
import ToastProvider from '@/components/ui/toast/ToastProvider.vue'
import { Button } from '@/components/ui/button'
import { useItemStore } from '@/stores/item-store'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const itemStore = useItemStore()

const theme = ref(localStorage.getItem('theme') || 'light')
const isSidebarOpen = ref(window.innerWidth >= 1024)
const isMobileMenuOpen = ref(false)

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

watchEffect(() => {
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

// Handle window resize for responsive sidebar
const handleResize = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  itemStore.initializeStore()
  window.addEventListener('resize', handleResize)
  if (!localStorage.getItem('theme')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = prefersDark ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }
})

// Navigation items
const navItems = [
  { name: 'Dashboard', icon: Home, path: '/', active: false },
  { name: 'Items', icon: Package, path: '/items', active: true },
  { name: 'Users', icon: Users, path: '/users', active: false },
  { name: 'Analytics', icon: BarChart3, path: '/analytics', active: false },
  { name: 'Settings', icon: Settings, path: '/settings', active: false },
]
</script>

<template>
  <div class="h-full bg-background text-foreground">
    <ToastProvider />

    <!-- Mobile menu overlay -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
      @click="isMobileMenuOpen = false"
    ></div>

    <!-- Mobile menu -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r transform transition-transform duration-200 ease-in-out lg:hidden"
      :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-16 items-center justify-between px-4 border-b">
        <h1 class="text-xl font-bold">shadcn-vue CRUD</h1>
        <Button variant="ghost" size="icon" @click="toggleMobileMenu">
          <X class="h-5 w-5" />
        </Button>
      </div>

      <div class="py-4">
        <nav class="space-y-1 px-2">
          <a
            v-for="item in navItems"
            :key="item.name"
            href="#"
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              item.active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            "
          >
            <component :is="item.icon" class="mr-3 h-5 w-5" />
            {{ item.name }}
          </a>
        </nav>
      </div>
    </div>

    <!-- Desktop sidebar -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:border-r lg:bg-background"
      :class="isSidebarOpen ? 'lg:w-64' : 'lg:w-16'"
    >
      <div class="flex h-16 items-center justify-between px-4 border-b">
        <h1
          class="text-xl font-bold transition-opacity duration-200"
          :class="isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'"
        >
          Task Management
        </h1>
        <Button variant="ghost" size="icon" @click="toggleSidebar">
          <Menu class="h-5 w-5" />
        </Button>
      </div>

      <div class="flex flex-1 flex-col overflow-y-auto">
        <nav class="flex-1 space-y-1 px-2 py-4">
          <a
            v-for="item in navItems"
            :key="item.name"
            href="#"
            class="flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="
              item.active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            "
          >
            <component :is="item.icon" class="h-5 w-5" :class="isSidebarOpen ? 'mr-3' : ''" />
            <span :class="isSidebarOpen ? '' : 'hidden'">{{ item.name }}</span>
          </a>
        </nav>
      </div>

      <div class="border-t p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3" :class="isSidebarOpen ? '' : 'hidden'">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm font-medium">Mortada Ahmad</p>
              <p class="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <LogOut class="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col min-h-screen" :class="isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16'">
      <!-- Header -->
      <header class="sticky top-0 z-10 bg-background border-b">
        <div class="flex h-16 items-center justify-between px-4">
          <div class="flex items-center lg:hidden">
            <Button variant="ghost" size="icon" @click="toggleMobileMenu">
              <Menu class="h-5 w-5" />
            </Button>
          </div>

          <div class="flex items-center gap-4">
            <Badge
              v-if="itemStore.isUsingDummyData"
              variant="outline"
              class="flex items-center gap-1"
            >
              <WifiOff class="h-3 w-3" />
              <span>Offline Mode</span>
            </Badge>
          </div>

          <div class="flex items-center gap-3">
            <Button variant="outline" size="icon" @click="toggleTheme">
              <Sun v-if="theme === 'dark'" class="h-[1.2rem] w-[1.2rem]" />
              <Moon v-else class="h-[1.2rem] w-[1.2rem]" />
              <span class="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" class="rounded-full">
                  <Avatar class="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <!-- Main content area -->
      <main class="flex-1 p-4 md:p-6">
        <div class="mx-auto max-w-7xl">
          <!-- <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold">Task Management</h1>
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm">Export</Button>
              <Button size="sm">Add New</Button>
            </div>
          </div> -->

          <!-- Item list component -->
          <ItemList />
        </div>
      </main>

      <!-- Footer -->
      <footer class="border-t py-4 px-6">
        <div class="text-center text-sm text-muted-foreground">
          &copy; 2023 shadcn-vue CRUD App. All rights reserved.
        </div>
      </footer>
    </div>
  </div>
</template>
