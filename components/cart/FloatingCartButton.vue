<template>
  <!-- Only show when cart has items -->
  <ClientOnly>
    <Teleport to="body">
      <!-- Floating Cart Button - Bottom Right -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="scale-0 opacity-0"
        enter-to-class="scale-100 opacity-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="scale-100 opacity-100"
        leave-to-class="scale-0 opacity-0"
      >
        <button
          v-if="itemCount > 0"
          @click="openCart"
          class="fixed bottom-8 right-8 z-[9990] w-20 h-20 rounded-full bg-gray-900 flex flex-col items-center justify-center gap-0.5 hover:bg-gray-800 hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl"
          :class="[
            isPulsing ? 'animate-cart-pulse' : ''
          ]"
        >
          <!-- Cart Icon -->
          <svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          
          <!-- Item Count Badge -->
          <span class="text-sm font-bold text-white">
            {{ itemCount > 99 ? '99+' : itemCount }}
          </span>
        </button>
      </Transition>
      
      <!-- Cart Overlay Background -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isCartOpen" 
          class="fixed inset-0 bg-black/40 z-[9998]"
          @click="closeCart"
        />
      </Transition>
      
      <!-- Cart Slide-in Panel -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div 
          v-if="isCartOpen"
          class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">{{ t.cart }}</h2>
            <button
              @click="closeCart"
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Loading -->
          <div v-if="loading || isUpdating" class="flex-1 flex items-center justify-center">
            <div class="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
          
          <!-- Empty Cart -->
          <div v-else-if="isEmpty" class="flex-1 flex flex-col items-center justify-center px-6">
            <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p class="text-lg text-gray-500 text-center">{{ t.emptyCart }}</p>
          </div>
          
          <!-- Cart Items -->
          <div v-else class="flex-1 overflow-y-auto">
            <div class="p-6 space-y-4">
              <div 
                v-for="item in lineItems" 
                :key="item.id"
                class="flex gap-4 p-4 bg-gray-50 rounded-xl relative"
                :class="{ 'opacity-50': updatingItem === item.id }"
              >
                <!-- Loading overlay for item -->
                <div 
                  v-if="updatingItem === item.id" 
                  class="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl z-10"
                >
                  <div class="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                </div>
                
                <!-- Product Image -->
                <div class="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  <img 
                    v-if="item.cover?.url" 
                    :src="item.cover.url" 
                    :alt="item.label"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 truncate">{{ item.label }}</h3>
                  <p class="text-lg font-semibold text-gray-900 mt-1">{{ formatPrice(item.price.totalPrice) }}</p>
                  
                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-2 mt-2">
                    <button
                      @click="handleDecreaseQuantity(item)"
                      :disabled="updatingItem === item.id || isUpdating"
                      class="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-8 text-center text-gray-900 font-medium">{{ item.quantity }}</span>
                    <button
                      @click="handleIncreaseQuantity(item)"
                      :disabled="updatingItem === item.id || isUpdating"
                      class="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    
                    <!-- Remove Button -->
                    <button
                      @click="handleRemoveItem(item.id)"
                      :disabled="updatingItem === item.id || isUpdating"
                      class="ml-auto w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Error Message -->
          <div 
            v-if="errorMessage" 
            class="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
          >
            {{ errorMessage }}
            <button @click="errorMessage = null" class="ml-2 text-red-400 hover:text-red-600">×</button>
          </div>
          
          <!-- Footer -->
          <div v-if="!isEmpty && !loading && !isUpdating" class="border-t border-gray-200 p-6 space-y-4">
            <!-- Subtotal -->
            <div class="flex justify-between text-gray-600">
              <span>{{ t.subtotal }}</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            
            <!-- Total -->
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">{{ t.total }}</span>
              <span class="text-2xl font-bold text-gray-900">{{ formatPrice(totalPrice) }}</span>
            </div>
            
            <!-- Checkout Button -->
            <NuxtLink
              to="/checkout"
              @click="closeCart"
              class="block w-full py-4 px-6 bg-gray-900 text-white rounded-xl font-semibold text-lg text-center hover:bg-gray-800 transition-all"
            >
              {{ t.checkout }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { ShopwareCartLineItem } from '~/types/shopware'

const { language } = useLanguage()
const { 
  isEmpty, 
  itemCount, 
  lineItems, 
  subtotal, 
  totalPrice, 
  loading,
  updateQuantity,
  removeFromCart,
  formatPrice,
  error: cartError,
  fetchCart,
  getContextToken,
} = useShopwareCart()

const isCartOpen = ref(false)
const updatingItem = ref<string | null>(null)
const isPulsing = ref(false)
const isUpdating = ref(false)
const errorMessage = ref<string | null>(null)

// Watch for item count changes to trigger pulse animation
watch(itemCount, (newCount, oldCount) => {
  // Only pulse when items are added (count increases)
  if (newCount > oldCount) {
    triggerPulse()
  }
})

// Watch for cart errors
watch(cartError, (newError) => {
  if (newError) {
    errorMessage.value = newError
  }
})

// Trigger pulse animation
function triggerPulse() {
  isPulsing.value = true
  setTimeout(() => {
    isPulsing.value = false
  }, 800)
}

// Expose pulse function for external triggering
defineExpose({
  triggerPulse
})

// Translations
const translations = {
  de: {
    cart: 'Warenkorb',
    emptyCart: 'Ihr Warenkorb ist leer',
    subtotal: 'Zwischensumme',
    total: 'Gesamt',
    checkout: 'Zur Kasse',
  },
  en: {
    cart: 'Cart',
    emptyCart: 'Your cart is empty',
    subtotal: 'Subtotal',
    total: 'Total',
    checkout: 'Checkout',
  },
}

const t = computed(() => translations[language.value])

async function openCart() {
  console.log('[FloatingCart] Opening cart')
  console.log('[FloatingCart] Context token:', getContextToken() ? 'exists' : 'none')
  isCartOpen.value = true
  errorMessage.value = null
  
  // Refresh cart when opening to ensure we have latest data
  isUpdating.value = true
  try {
    await fetchCart()
  } catch (err) {
    console.error('[FloatingCart] Error refreshing cart:', err)
  } finally {
    isUpdating.value = false
  }
}

function closeCart() {
  isCartOpen.value = false
  errorMessage.value = null
}

async function handleIncreaseQuantity(item: ShopwareCartLineItem) {
  console.log('[FloatingCart] Increase quantity for:', item.label, 'id:', item.id, 'current qty:', item.quantity)
  
  updatingItem.value = item.id
  errorMessage.value = null
  
  const success = await updateQuantity(item.id, item.quantity + 1)
  
  if (!success) {
    errorMessage.value = cartError.value || 'Fehler beim Aktualisieren'
  }
  
  updatingItem.value = null
}

async function handleDecreaseQuantity(item: ShopwareCartLineItem) {
  console.log('[FloatingCart] Decrease quantity for:', item.label, 'id:', item.id, 'current qty:', item.quantity)
  
  updatingItem.value = item.id
  errorMessage.value = null
  
  let success: boolean
  if (item.quantity > 1) {
    success = await updateQuantity(item.id, item.quantity - 1)
  } else {
    success = await removeFromCart(item.id)
  }
  
  if (!success) {
    errorMessage.value = cartError.value || 'Fehler beim Aktualisieren'
  }
  
  updatingItem.value = null
}

async function handleRemoveItem(itemId: string) {
  console.log('[FloatingCart] Remove item:', itemId)
  
  updatingItem.value = itemId
  errorMessage.value = null
  
  const success = await removeFromCart(itemId)
  
  if (!success) {
    errorMessage.value = cartError.value || 'Fehler beim Entfernen'
  }
  
  updatingItem.value = null
}
</script>

<style scoped>
@keyframes cart-pulse {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.15);
  }
  50% {
    transform: scale(1.05);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-cart-pulse {
  animation: cart-pulse 0.6s ease-in-out;
}
</style>
