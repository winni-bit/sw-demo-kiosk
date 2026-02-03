<template>
  <div
    class="group relative bg-white border-2 border-black overflow-hidden cursor-pointer touch-manipulation"
    @click="$emit('click', product)"
  >
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
        v-if="hasImage"
        :src="imageSrc"
        :alt="product.name || product.label || 'Produkt'"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <!-- Fallback Gradient -->
      <div
        v-else
        class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center"
      >
        <span class="font-display text-4xl text-gray-300">?</span>
      </div>
      
      <!-- Quantity Badge (for cart items) -->
      <div 
        v-if="quantity && quantity > 1" 
        class="absolute top-3 right-3 bg-black text-white font-mono text-sm font-bold px-3 py-1"
      >
        {{ quantity }}×
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="p-4">
      <!-- Product Name -->
      <h3 class="font-display text-lg font-bold text-black leading-tight line-clamp-2 mb-2">
        {{ product.name || product.label || 'Produkt' }}
      </h3>
      
      <!-- Price -->
      <div class="flex items-center justify-between">
        <span class="font-mono text-xl font-bold text-accent">
          {{ formattedPrice }}
        </span>
        
        <!-- Unit Price (if quantity > 1) -->
        <span v-if="quantity && quantity > 1 && unitPrice" class="font-mono text-xs text-black/50">
          {{ formattedUnitPrice }} {{ t.each }}
        </span>
      </div>
    </div>
    
    <!-- Action Buttons (shown on hover or always on touch) -->
    <div 
      v-if="showActions"
      class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <button
        @click.stop="$emit('addToCart', product)"
        class="px-8 py-4 bg-white text-black font-sans font-semibold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors min-w-[200px] text-center"
      >
        {{ t.addToCart }}
      </button>
      
      <button
        @click.stop="$emit('buyNow', product)"
        class="px-8 py-4 bg-accent text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent-dark transition-colors min-w-[200px] text-center"
      >
        {{ t.buyNow }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ProductLike {
  name?: string
  label?: string
  cover?: {
    src?: string
    thumbnailSrc?: string
    url?: string
  }
  price?: {
    amount?: number
    precision?: number
    currency?: string
    totalPrice?: number
    unitPrice?: number
  }
}

const props = defineProps<{
  product: ProductLike
  quantity?: number
  unitPrice?: number
  showActions?: boolean
}>()

defineEmits<{
  click: [product: ProductLike]
  addToCart: [product: ProductLike]
  buyNow: [product: ProductLike]
}>()

const { language } = useLanguage()

const translations = {
  de: {
    addToCart: 'In den Warenkorb',
    buyNow: 'Jetzt Kaufen',
    each: 'pro Stück',
  },
  en: {
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    each: 'each',
  }
}

const t = computed(() => translations[language.value])

const imageSrc = computed(() => {
  const cover = props.product.cover
  if (!cover) return null
  return cover.src || cover.thumbnailSrc || cover.url || null
})

const hasImage = computed(() => {
  return imageSrc.value && imageSrc.value.trim() !== ''
})

const formattedPrice = computed(() => {
  const price = props.product.price
  if (!price) return '–'
  
  // Handle Shopware cart item price structure
  if (price.totalPrice !== undefined) {
    return formatCurrency(price.totalPrice)
  }
  
  // Handle Frontstack price structure
  const amount = price.amount ?? 0
  const precision = price.precision ?? 2
  const value = amount / Math.pow(10, precision)
  
  return formatCurrency(value, price.currency)
})

const formattedUnitPrice = computed(() => {
  if (!props.unitPrice) return null
  return formatCurrency(props.unitPrice)
})

function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(amount)
}
</script>
