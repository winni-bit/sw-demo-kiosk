<template>
  <div
    class="group relative bg-white cursor-pointer overflow-hidden"
    :class="[
      featured ? 'col-span-2 row-span-2' : '',
      tall ? 'row-span-2' : ''
    ]"
    @click="$emit('click', product)"
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
      
      <!-- Hover Overlay with Actions -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
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
      <div class="absolute top-4 left-4 font-mono text-[10px] text-black/50 bg-white/80 px-2 py-1">
        № {{ productNumber }}
      </div>
    </div>
    
    <!-- Product Info - Revealed on Hover or Always Visible -->
    <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
      <!-- Product Name - Bold Serif -->
      <h3 class="font-display text-xl md:text-2xl font-bold text-black leading-tight line-clamp-2 mb-1">
        {{ product.name || 'Produkt' }}
      </h3>
      
      <!-- Price - Monospace -->
      <span class="font-mono text-lg font-bold text-accent">
        {{ formattedPrice }}
      </span>
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

defineEmits<{
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
  },
  en: {
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
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
</script>
