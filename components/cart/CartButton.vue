<template>
  <button
    @click="toggleCart"
    class="relative flex items-center gap-2 px-4 py-3 bg-neutral-800 text-white rounded-2xl font-semibold hover:bg-neutral-700 transition-all"
  >
    <!-- Cart Icon -->
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
    
    <!-- Item Count Badge -->
    <span 
      v-if="itemCount > 0"
      class="absolute -top-1 -right-1 w-6 h-6 bg-white text-neutral-900 rounded-full text-sm font-bold flex items-center justify-center"
    >
      {{ itemCount > 99 ? '99+' : itemCount }}
    </span>
    
    <!-- Price (optional, hidden on mobile) -->
    <span v-if="showPrice && totalPrice > 0" class="hidden sm:inline">
      {{ formatPrice(totalPrice) }}
    </span>
  </button>
  
  <!-- Mini Cart Dropdown -->
  <ClientOnly>
    <Teleport to="body">
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
          class="fixed inset-0 bg-black/60 z-[9998]"
          @click="closeCart"
        />
      </Transition>
      
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
          class="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-900 shadow-2xl z-[9999] flex flex-col"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
            <h2 class="text-xl font-bold text-white">{{ t.cart }}</h2>
            <button
              @click="closeCart"
              class="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
            >
              <svg class="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Loading -->
          <div v-if="loading" class="flex-1 flex items-center justify-center">
            <div class="w-10 h-10 border-4 border-neutral-700 border-t-white rounded-full animate-spin" />
          </div>
          
          <!-- Empty Cart -->
          <div v-else-if="isEmpty" class="flex-1 flex flex-col items-center justify-center px-6">
            <div class="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
              <svg class="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p class="text-lg text-neutral-400 text-center">{{ t.emptyCart }}</p>
          </div>
          
          <!-- Cart Items -->
          <div v-else class="flex-1 overflow-y-auto">
            <div class="p-6 space-y-4">
              <div 
                v-for="item in lineItems" 
                :key="item.id"
                class="flex gap-4 p-4 bg-neutral-800 rounded-xl"
              >
                <!-- Product Image -->
                <div class="w-20 h-20 rounded-lg bg-neutral-700 overflow-hidden flex-shrink-0">
                  <img 
                    v-if="item.cover?.url" 
                    :src="item.cover.url" 
                    :alt="item.label"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                <!-- Product Info -->
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-white truncate">{{ item.label }}</h3>
                  <p class="text-lg font-semibold text-white mt-1">{{ formatPrice(item.price.totalPrice) }}</p>
                  
                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-2 mt-2">
                    <button
                      @click="decreaseQuantity(item)"
                      :disabled="updatingItem === item.id"
                      class="w-8 h-8 rounded-lg bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-8 text-center text-white font-medium">{{ item.quantity }}</span>
                    <button
                      @click="increaseQuantity(item)"
                      :disabled="updatingItem === item.id"
                      class="w-8 h-8 rounded-lg bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    
                    <!-- Remove Button -->
                    <button
                      @click="removeItem(item.id)"
                      :disabled="updatingItem === item.id"
                      class="ml-auto w-8 h-8 rounded-lg bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div v-if="!isEmpty && !loading" class="border-t border-neutral-800 p-6 space-y-4">
            <!-- Subtotal -->
            <div class="flex justify-between text-neutral-400">
              <span>{{ t.subtotal }}</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            
            <!-- Total -->
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-white">{{ t.total }}</span>
              <span class="text-2xl font-bold text-white">{{ formatPrice(totalPrice) }}</span>
            </div>
            
            <!-- Checkout Button -->
            <NuxtLink
              to="/checkout"
              @click="closeCart"
              class="block w-full py-4 px-6 bg-white text-neutral-900 rounded-xl font-bold text-lg text-center hover:bg-neutral-100 transition-colors"
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

interface Props {
  showPrice?: boolean
}

withDefaults(defineProps<Props>(), {
  showPrice: false,
})

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
  initCart,
} = useShopwareCart()

const isCartOpen = ref(false)
const updatingItem = ref<string | null>(null)

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

// Initialize cart on mount
onMounted(async () => {
  await initCart()
})

function toggleCart() {
  isCartOpen.value = !isCartOpen.value
}

function closeCart() {
  isCartOpen.value = false
}

async function increaseQuantity(item: ShopwareCartLineItem) {
  updatingItem.value = item.id
  await updateQuantity(item.id, item.quantity + 1)
  updatingItem.value = null
}

async function decreaseQuantity(item: ShopwareCartLineItem) {
  updatingItem.value = item.id
  if (item.quantity > 1) {
    await updateQuantity(item.id, item.quantity - 1)
  } else {
    await removeFromCart(item.id)
  }
  updatingItem.value = null
}

async function removeItem(itemId: string) {
  updatingItem.value = itemId
  await removeFromCart(itemId)
  updatingItem.value = null
}
</script>
