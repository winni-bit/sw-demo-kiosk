<template>
  <div
    class="group relative bg-white cursor-pointer overflow-hidden touch-manipulation"
    :class="[
      featured ? 'col-span-2 row-span-2' : '',
      tall ? 'row-span-2' : ''
    ]"
    @click="handleClick"
  >
    <!-- Product Image - Full Bleed -->
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
        v-if="hasImage"
        :src="product.cover?.src || product.cover?.thumbnailSrc"
        :alt="product.name || 'Produkt'"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <!-- Fallback Gradient -->
      <div
        v-else
        class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300"
      />
      
      <!-- Desktop Hover Overlay with Actions -->
      <div class="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="flex flex-col gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <!-- Add to Cart -->
          <button
            @click.stop="$emit('addToCart', product)"
            class="px-8 py-3 bg-white text-black font-sans text-sm font-semibold uppercase tracking-widest hover:bg-accent hover:text-white transition-colors"
          >
            {{ t.addToCart }}
          </button>
          
          <!-- Buy Now -->
          <button
            @click.stop="$emit('buyNow', product)"
            class="px-8 py-3 bg-accent text-white font-sans text-sm font-semibold uppercase tracking-widest hover:bg-accent-dark transition-colors"
          >
            {{ t.buyNow }}
          </button>
        </div>
      </div>
      
      <!-- Product Number Badge -->
      <div class="absolute top-2 left-2 md:top-4 md:left-4 font-mono text-[10px] text-black/50 bg-white/80 px-2 py-1">
        № {{ productNumber }}
      </div>
    </div>
    
    <!-- Product Info - Always Visible -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent">
      <!-- Mobile Action Buttons - Always Visible -->
      <div class="md:hidden flex gap-2 px-3 pt-3 pb-2">
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
      
      <!-- Product Name & Price -->
      <div class="px-3 pb-3 md:p-4">
        <h3 class="font-display text-base md:text-xl lg:text-2xl font-bold text-black leading-tight line-clamp-2 mb-1">
          {{ product.name || 'Produkt' }}
        </h3>
        
        <span class="font-mono text-base md:text-lg font-bold text-accent">
          {{ formattedPrice }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: ProductCard
  index?: number
  featured?: boolean
  tall?: boolean
}>()

const emit = defineEmits<{
  click: [product: ProductCard]
  addToCart: [product: ProductCard]
  buyNow: [product: ProductCard]
}>()

const { language } = useLanguage()

// Translations
const translations = {
  de: {
    addToCart: 'In den Warenkorb',
    buyNow: 'Jetzt Kaufen',
    cart: 'Warenkorb',
    buy: 'Kaufen',
  },
  en: {
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    cart: 'Cart',
    buy: 'Buy',
  }
}

const t = computed(() => translations[language.value])

// Product number for display
const productNumber = computed(() => {
  return String((props.index || 0) + 1).padStart(3, '0')
})

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

// Handle click - on mobile, don't trigger if clicking buttons
function handleClick(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('button')) {
    emit('click', props.product)
  }
}
</script>
