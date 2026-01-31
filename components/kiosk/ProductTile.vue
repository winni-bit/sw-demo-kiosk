<template>
  <div
    class="group bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg flex flex-col"
  >
    <!-- Clickable Area for Details -->
    <button
      @click="$emit('click', product)"
      class="cursor-pointer text-left"
    >
      <!-- Product Image -->
      <div class="aspect-square relative overflow-hidden bg-gray-50">
        <img
          v-if="hasImage"
          :src="product.cover?.thumbnailSrc || product.cover?.src"
          :alt="product.name || 'Produkt'"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <!-- Fallback Gradient -->
        <div
          v-else
          class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
        >
          <svg class="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="p-4 flex flex-col gap-1">
        <h3 class="text-gray-900 text-base font-medium leading-snug line-clamp-2">
          {{ product.name || 'Produkt' }}
        </h3>
        
        <span class="text-xl font-semibold text-gray-900">
          {{ formattedPrice }}
        </span>
      </div>
    </button>
    
    <!-- Action Buttons -->
    <div class="px-4 pb-4 flex gap-2 mt-auto">
      <!-- Add to Cart -->
      <button
        @click.stop="$emit('addToCart', product)"
        class="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {{ t.addToCart }}
      </button>
      
      <!-- Buy Now -->
      <button
        @click.stop="$emit('buyNow', product)"
        class="flex-1 py-2.5 px-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {{ t.buyNow }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: ProductCard
}>()

defineEmits<{
  click: [product: ProductCard]
  addToCart: [product: ProductCard]
  buyNow: [product: ProductCard]
}>()

const { language } = useLanguage()

// Translations
const translations = {
  de: {
    addToCart: 'Warenkorb',
    buyNow: 'Kaufen',
  },
  en: {
    addToCart: 'Add',
    buyNow: 'Buy',
  }
}

const t = computed(() => translations[language.value])

// Check if product has a valid image
const hasImage = computed(() => {
  const src = props.product.cover?.src
  return src && src.trim() !== ''
})

const formattedPrice = computed(() => {
  if (!props.product.price) return '–'
  
  const amount = props.product.price.amount ?? 0
  const precision = props.product.price.precision ?? 2
  const currency = props.product.price.currency ?? 'EUR'
  
  const value = amount / Math.pow(10, precision)
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(value)
})
</script>
