<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="close"
        />
        
        <!-- Modal Content -->
        <div 
          class="relative bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="close"
            class="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 transition-colors shadow-sm"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Product Image -->
          <div class="aspect-[4/3] relative overflow-hidden shrink-0 bg-gray-50">
            <img
              v-if="hasImage"
              :src="product?.cover?.src || product?.cover?.thumbnailSrc"
              :alt="product?.name || 'Produkt'"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div
              v-else
              class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
            >
              <svg class="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <!-- Product Details -->
          <div class="p-6 flex flex-col gap-4">
            <!-- Name & Price -->
            <div class="flex items-start justify-between gap-4">
              <h2 class="text-2xl font-semibold text-gray-900 leading-tight">
                {{ product?.name || 'Produkt' }}
              </h2>
              <span class="text-2xl font-bold text-gray-900 whitespace-nowrap">
                {{ formattedPrice }}
              </span>
            </div>
            
            <!-- Description -->
            <p v-if="cleanDescription" class="text-gray-600 text-base leading-relaxed">
              {{ cleanDescription }}
            </p>
            
            <!-- No Description Fallback -->
            <p v-else class="text-gray-400 text-base italic">
              {{ t.noDescription }}
            </p>
            
            <!-- Action Buttons -->
            <div class="flex gap-3 mt-2">
              <!-- Add to Cart -->
              <button
                class="flex-1 py-4 px-5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="addingToCart"
                @click="addToCart"
              >
                <svg 
                  v-if="addingToCart" 
                  class="w-5 h-5 animate-spin" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {{ t.addToCart }}
              </button>
              
              <!-- Buy Now -->
              <button
                class="flex-1 py-4 px-5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="addingToCart"
                @click="buyNow"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {{ t.buyNow }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: ProductCard | null
  isOpen: boolean
  addingToCart?: boolean
}>()

const emit = defineEmits<{
  close: []
  addToCart: [product: ProductCard]
  buyNow: [product: ProductCard]
}>()

const { language } = useLanguage()

// Translations
const translations = {
  de: {
    noDescription: 'Keine Beschreibung verfügbar.',
    addToCart: 'Warenkorb',
    buyNow: 'Kaufen',
  },
  en: {
    noDescription: 'No description available.',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
  }
}

const t = computed(() => translations[language.value])

// Check if product has a valid image
const hasImage = computed(() => {
  const src = props.product?.cover?.src
  return src && src.trim() !== ''
})

// Strip HTML tags from description
const cleanDescription = computed(() => {
  const description = props.product?.description
  if (!description) return ''
  
  // Remove HTML tags and decode HTML entities
  const stripped = description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&')  // Replace &amp; with &
    .replace(/&lt;/g, '<')   // Replace &lt; with <
    .replace(/&gt;/g, '>')   // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'")  // Replace &#39; with '
    .trim()
  
  return stripped
})

// Format price
const formattedPrice = computed(() => {
  if (!props.product?.price) return '–'
  
  const amount = props.product.price.amount ?? 0
  const precision = props.product.price.precision ?? 2
  const currency = props.product.price.currency ?? 'EUR'
  
  const value = amount / Math.pow(10, precision)
  
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value)
})

// Close modal
function close() {
  emit('close')
}

// Add to cart
function addToCart() {
  if (props.product) {
    emit('addToCart', props.product)
  }
}

// Buy now
function buyNow() {
  if (props.product) {
    emit('buyNow', props.product)
  }
}

// Close on Escape key
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
