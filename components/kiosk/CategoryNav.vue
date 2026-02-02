<template>
  <header class="bg-white fixed top-0 left-0 right-0 z-50">
    <!-- Top Bar with Logo and Actions -->
    <div class="flex items-center justify-between px-8 py-4 border-b border-black">
      <!-- Logo - Bold Typography -->
      <NuxtLink to="/" class="group">
        <h1 class="font-display text-3xl md:text-4xl font-bold tracking-tight text-black uppercase">
          KIOSK<span class="text-accent">.</span>
        </h1>
      </NuxtLink>
      
      <!-- Right Side Actions -->
      <div class="flex items-center gap-4">
        <AccountDropdown />
        <KioskLanguageSwitch @change="$emit('languageChange', $event)" />
      </div>
    </div>
    
    <!-- Category Strip - Horizontal Scroll -->
    <div class="border-b border-black overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center gap-0 animate-pulse">
        <div
          v-for="i in 6"
          :key="i"
          class="h-16 w-40 bg-gray-100 border-r border-black flex-shrink-0"
        />
      </div>
      
      <!-- Categories -->
      <div v-else class="flex items-stretch overflow-x-auto scrollbar-hide">
        <button
          v-for="(category, index) in categories"
          :key="category.key"
          @click="$emit('select', category.key)"
          class="group relative flex-shrink-0 h-16 px-8 border-r border-black transition-all duration-200 flex items-center justify-center"
          :class="[
            activeKey === category.key
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          ]"
        >
          <!-- Category Number -->
          <span 
            class="absolute top-2 left-3 text-[10px] font-mono opacity-50"
            :class="activeKey === category.key ? 'text-white' : 'text-black group-hover:text-white'"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          
          <!-- Category Name -->
          <span class="font-sans text-sm font-semibold uppercase tracking-widest whitespace-nowrap">
            {{ getCategoryName(category) }}
          </span>
        </button>
      </div>
    </div>
  </header>
  
  <!-- Spacer for fixed header -->
  <div class="h-[120px]" />
</template>

<script setup lang="ts">
const { t } = useLanguage()

defineProps<{
  categories: CategoryCard[]
  activeKey: string | null
  loading?: boolean
}>()

defineEmits<{
  select: [key: string]
  languageChange: [language: 'de' | 'en']
}>()

function getCategoryName(category: CategoryCard): string {
  if (category.breadcrumb && category.breadcrumb.length > 0) {
    return category.breadcrumb[category.breadcrumb.length - 1]
  }
  return category.title || 'Kategorie'
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
