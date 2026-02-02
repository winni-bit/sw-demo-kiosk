<template>
  <div v-if="!loading && recommendations.length > 0" class="border border-black">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-black bg-gray-50">
      <div class="flex items-center gap-3">
        <span class="font-mono text-xs text-black/40">+</span>
        <h2 class="font-display text-xl font-bold text-black uppercase">{{ t.title }}</h2>
      </div>
      <p class="font-sans text-sm text-black/50 mt-1">{{ t.subtitle }}</p>
    </div>
    
    <!-- Product Recommendations -->
    <div class="divide-y divide-black/10">
      <div 
        v-for="product in recommendations" 
        :key="product.key"
        class="px-6 py-5 flex items-center gap-5 group hover:bg-gray-50 transition-colors"
      >
        <!-- Product Image -->
        <div class="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden relative">
          <img 
            v-if="product.cover?.src" 
            :src="product.cover.src" 
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span class="font-display text-2xl text-gray-300">?</span>
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="flex-1 min-w-0">
          <h3 class="font-sans font-semibold text-black truncate">{{ product.name }}</h3>
          <p class="font-mono text-lg font-bold text-accent mt-1">{{ formatProductPrice(product.price) }}</p>
        </div>
        
        <!-- Add Button -->
        <button
          @click="handleAddToCart(product)"
          :disabled="addingProductKey === product.key"
          class="flex-shrink-0 px-5 py-3 bg-black text-white font-sans font-semibold text-sm uppercase tracking-wider hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <svg 
            v-if="addingProductKey === product.key" 
            class="w-4 h-4 animate-spin" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <svg 
            v-else-if="addedProductKeys.includes(product.key)"
            class="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg 
            v-else
            class="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>{{ addedProductKeys.includes(product.key) ? t.added : t.add }}</span>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Loading State -->
  <div v-else-if="loading" class="border border-black p-6">
    <div class="flex items-center gap-4">
      <div class="w-6 h-6 border-2 border-black border-t-accent animate-spin flex-shrink-0" />
      <span class="font-sans text-black/50">{{ t.loading }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  recommendations: Array<{
    id: string
    key: string
    name: string
    price: Price | undefined
    cover: Media | undefined
    categoryIds: string[]
  }>
  loading: boolean
}>()

const emit = defineEmits<{
  addToCart: [product: typeof props.recommendations[0]]
}>()

const { language } = useLanguage()
const { addToCart, fetchCart } = useShopwareCart()

const addingProductKey = ref<string | null>(null)
const addedProductKeys = ref<string[]>([])

const translations = {
  de: {
    title: 'Dazu passend',
    subtitle: 'Kunden kauften auch',
    add: 'Hinzufügen',
    added: 'Hinzugefügt',
    loading: 'Empfehlungen werden geladen...',
  },
  en: {
    title: 'You might also like',
    subtitle: 'Customers also bought',
    add: 'Add',
    added: 'Added',
    loading: 'Loading recommendations...',
  },
}

const t = computed(() => translations[language.value])

function formatProductPrice(price: Price | undefined): string {
  if (!price || price.amount === undefined) return ''
  
  const amount = price.amount / Math.pow(10, price.precision || 2)
  const currency = price.currency || 'EUR'
  
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency
  }).format(amount)
}

async function handleAddToCart(product: typeof props.recommendations[0]) {
  if (addingProductKey.value || addedProductKeys.value.includes(product.key)) return
  
  addingProductKey.value = product.key
  
  try {
    // Verwende die Produkt-ID für Shopware
    const productId = product.id || product.key
    const success = await addToCart(productId, 1)
    
    if (success) {
      addedProductKeys.value.push(product.key)
      emit('addToCart', product)
      
      // Aktualisiere den Warenkorb
      await fetchCart()
    }
  } catch (err) {
    console.error('[CrossSelling] Failed to add product:', err)
  } finally {
    addingProductKey.value = null
  }
}
</script>
