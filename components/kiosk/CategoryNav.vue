<template>
  <header class="bg-neutral-900 border-b border-neutral-800 px-6 py-5 shrink-0">
    <div class="flex items-center gap-6">
      <!-- Shop Name -->
      <div class="flex-shrink-0">
        <NuxtLink to="/" class="text-2xl font-bold text-white tracking-tight hover:text-neutral-200 transition-colors">
          {{ t.shopName }}
        </NuxtLink>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center gap-4 flex-1">
        <div
          v-for="i in 4"
          :key="i"
          class="w-28 h-28 rounded-2xl bg-neutral-800 animate-pulse flex-shrink-0"
        />
      </div>
      
      <!-- Categories -->
      <div v-else class="flex items-center gap-4 overflow-x-auto scrollbar-hide flex-1">
        <button
          v-for="(category, index) in categories"
          :key="category.key"
          @click="$emit('select', category.key)"
          class="group flex-shrink-0 transition-all duration-200"
        >
          <div
            class="relative w-28 h-28 rounded-2xl overflow-hidden transition-all duration-200 hover:scale-102"
            :class="[
              activeKey === category.key
                ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-105'
                : 'opacity-70 hover:opacity-100'
            ]"
          >
            <!-- Category Image -->
            <div
              v-if="category.cover?.src"
              class="absolute inset-0 bg-cover bg-center"
              :style="{ backgroundImage: `url(${category.cover.thumbnailSrc || category.cover.src})` }"
            />
            <!-- Fallback with category color -->
            <div
              v-else
              class="absolute inset-0"
              :style="{ background: getCategoryColor(index) }"
            />
            
            <!-- Overlay -->
            <div 
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            />
            
            <!-- Color indicator stripe at bottom -->
            <div 
              class="absolute bottom-0 left-0 right-0 h-1.5"
              :style="{ background: getCategoryColor(index) }"
            />
            
            <!-- Title -->
            <div class="absolute inset-0 flex items-end p-3 pb-4">
              <span 
                class="text-white text-sm font-medium leading-tight line-clamp-2"
                :class="{ 'font-semibold': activeKey === category.key }"
              >
                {{ getCategoryName(category) }}
              </span>
            </div>
          </div>
        </button>
      </div>
      
      <!-- Right Side Actions -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <!-- Account Dropdown -->
        <AccountDropdown />
        
        <!-- Language Switch -->
        <KioskLanguageSwitch @change="$emit('languageChange', $event)" />
      </div>
    </div>
  </header>
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

// Category colors
const categoryColors = [
  'linear-gradient(135deg, #f59e0b, #ea580c)',
  'linear-gradient(135deg, #10b981, #0891b2)',
  'linear-gradient(135deg, #8b5cf6, #d946ef)',
  'linear-gradient(135deg, #f43f5e, #ec4899)',
  'linear-gradient(135deg, #0ea5e9, #6366f1)',
  'linear-gradient(135deg, #84cc16, #22c55e)',
  'linear-gradient(135deg, #f97316, #ef4444)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
]

function getCategoryName(category: CategoryCard): string {
  if (category.breadcrumb && category.breadcrumb.length > 0) {
    return category.breadcrumb[category.breadcrumb.length - 1]
  }
  return category.title || 'Kategorie'
}

function getCategoryColor(index: number): string {
  return categoryColors[index % categoryColors.length]
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
.scale-102 {
  transform: scale(1.02);
}
</style>
