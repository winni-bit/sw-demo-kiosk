<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/80"
          @click="close"
        />
        
        <!-- Modal Content - Editorial Style -->
        <div 
          class="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
          @click.stop
        >
          <!-- Close Button -->
          <button
            @click="close"
            class="absolute top-4 right-4 z-10 w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-accent transition-colors"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Product Image - Left Side -->
          <div class="w-full md:w-1/2 aspect-square md:aspect-auto md:h-auto relative bg-gray-100 flex-shrink-0">
            <img
              v-if="hasImage"
              :src="product?.cover?.src || product?.cover?.thumbnailSrc"
              :alt="product?.name || 'Produkt'"
              class="absolute inset-0 w-full h-full object-cover"
            />
            <div
              v-else
              class="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center"
            >
              <span class="font-display text-6xl text-gray-300">?</span>
            </div>
          </div>
          
          <!-- Product Details - Right Side -->
          <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
            <!-- Product Number -->
            <span class="font-mono text-xs text-black/40 mb-4">
              ARTIKEL № {{ product?.key?.slice(0, 8).toUpperCase() || '000' }}
            </span>
            
            <!-- Product Name - Large Serif -->
            <h2 class="font-display text-3xl md:text-4xl font-bold text-black leading-tight mb-4">
              {{ product?.name || 'Produkt' }}
            </h2>
            
            <!-- Price - Bold Accent -->
            <div class="mb-6">
              <span class="font-mono text-3xl font-bold text-accent">
                {{ formattedPrice }}
              </span>
            </div>
            
            <!-- Divider -->
            <div class="w-16 h-px bg-black mb-6" />
            
            <!-- Description -->
            <div v-if="cleanDescription" class="mb-8 flex-1">
              <p class="font-sans text-base text-black/70 leading-relaxed">
                {{ cleanDescription }}
              </p>
            </div>
            
            <!-- No Description Fallback -->
            <p v-else class="text-black/40 text-sm italic mb-8 flex-1">
              {{ t.noDescription }}
            </p>
            
            <!-- Action Buttons -->
            <div class="flex flex-col gap-3 mt-auto">
              <!-- Add to Cart -->
              <button
                class="w-full py-4 px-6 bg-white border-2 border-black text-black font-sans font-semibold uppercase tracking-widest hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
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
                {{ t.addToCart }}
              </button>
              
              <!-- Buy Now -->
              <button
                class="w-full py-4 px-6 bg-accent text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                :disabled="addingToCart"
                @click="buyNow"
              >
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
    addToCart: 'In den Warenkorb',
    buyNow: 'Jetzt Kaufen',
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
  
  const stripped = description
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
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
  transition: all 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95) translateY(20px);
}
</style>
