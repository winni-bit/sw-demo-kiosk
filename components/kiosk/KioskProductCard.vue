<template>
  <div
    class="group relative bg-white border-2 border-black overflow-hidden cursor-pointer touch-manipulation"
    @click="handleClick"
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
        class="absolute top-2 right-2 md:top-3 md:right-3 bg-black text-white font-mono text-xs md:text-sm font-bold px-2 py-0.5 md:px-3 md:py-1"
      >
        {{ quantity }}×
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="p-3 md:p-4">
      <!-- Product Name -->
      <h3 class="font-display text-base md:text-lg font-bold text-black leading-tight line-clamp-2 mb-2">
        {{ product.name || product.label || 'Produkt' }}
      </h3>
      
      <!-- Price -->
      <div class="flex items-center justify-between mb-3 md:mb-0">
        <span class="font-mono text-lg md:text-xl font-bold text-accent">
          {{ formattedPrice }}
        </span>
        
        <!-- Unit Price (if quantity > 1) -->
        <span v-if="quantity && quantity > 1 && unitPrice" class="font-mono text-xs text-black/50">
          {{ formattedUnitPrice }} {{ t.each }}
        </span>
      </div>
      
      <!-- Mobile Action Buttons - Always Visible -->
      <div v-if="showActions" class="md:hidden flex gap-2 mt-3">
        <button
          @click.stop="$emit('addToCart', product)"
          class="flex-1 py-2.5 bg-black text-white font-sans text-xs font-bold uppercase tracking-wider active:bg-gray-800 transition-colors"
        >
          <span class="flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {{ t.cart }}
          </span>
        </button>
        
        <button
          @click.stop="$emit('buyNow', product)"
          class="flex-1 py-2.5 bg-accent text-white font-sans text-xs font-bold uppercase tracking-wider active:bg-accent-dark transition-colors"
        >
          <span class="flex items-center justify-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {{ t.buy }}
          </span>
        </button>
      </div>
    </div>
    
    <!-- Desktop Action Buttons (shown on hover) -->
    <div 
      v-if="showActions"
      class="hidden md:flex absolute inset-0 bg-black/80 flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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

const emit = defineEmits<{
  click: [product: ProductLike]
  addToCart: [product: ProductLike]
  buyNow: [product: ProductLike]
}>()

const { language } = useLanguage()

const translations = {
  de: {
    addToCart: 'In den Warenkorb',
    buyNow: 'Jetzt Kaufen',
    cart: 'Warenkorb',
    buy: 'Kaufen',
    each: 'pro Stück',
  },
  en: {
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    cart: 'Cart',
    buy: 'Buy',
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

// Handle click - on mobile, don't trigger if clicking buttons
function handleClick(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('button')) {
    emit('click', props.product)
  }
}
</script>
