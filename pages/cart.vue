<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-semibold text-gray-900">
          Kiosk Shop
        </NuxtLink>
        <div class="flex items-center gap-4">
          <KioskLanguageSwitch />
          <AccountDropdown />
        </div>
      </div>
    </header>
    
    <div class="max-w-3xl mx-auto px-6 py-10">
      <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ t.backToShop }}
      </NuxtLink>
      
      <!-- Page Title -->
      <h1 class="text-3xl font-semibold text-gray-900 mb-10">{{ t.cart }}</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
      
      <!-- Empty Cart -->
      <div v-else-if="isEmpty" class="bg-white rounded-2xl p-12 text-center shadow-sm">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 class="text-xl font-medium text-gray-900 mb-2">{{ t.emptyCart }}</h2>
        <p class="text-gray-500 mb-6">{{ t.emptyCartDescription }}</p>
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          {{ t.continueShopping }}
        </NuxtLink>
      </div>
      
      <!-- Cart Content -->
      <div v-else class="space-y-6">
        <!-- Cart Items -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div 
            v-for="item in lineItems" 
            :key="item.id"
            class="p-6 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex gap-6">
              <!-- Product Image -->
              <div class="w-24 h-24 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                <img 
                  v-if="item.cover?.url" 
                  :src="item.cover.url" 
                  :alt="item.label"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900">{{ item.label }}</h3>
                <p v-if="item.payload?.productNumber" class="text-sm text-gray-400 mt-1">
                  {{ t.articleNumber }}: {{ item.payload.productNumber }}
                </p>
                
                <!-- Quantity Controls -->
                <div class="flex items-center gap-4 mt-4">
                  <div class="flex items-center gap-2">
                    <button
                      @click="decreaseQuantity(item)"
                      :disabled="updatingItem === item.id"
                      class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="w-12 text-center text-gray-900 font-medium text-lg">{{ item.quantity }}</span>
                    <button
                      @click="increaseQuantity(item)"
                      :disabled="updatingItem === item.id"
                      class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <!-- Remove Button -->
                  <button
                    @click="removeItem(item.id)"
                    :disabled="updatingItem === item.id"
                    class="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {{ t.remove }}
                  </button>
                </div>
              </div>
              
              <!-- Price -->
              <div class="text-right">
                <p class="text-xl font-semibold text-gray-900">{{ formatPrice(item.price.totalPrice) }}</p>
                <p v-if="item.quantity > 1" class="text-sm text-gray-400 mt-1">
                  {{ formatPrice(item.price.unitPrice) }} {{ t.each }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cart Summary -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <div class="space-y-3">
            <div class="flex justify-between text-gray-500">
              <span>{{ t.subtotal }}</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>{{ t.shipping }}</span>
              <span class="text-emerald-600">{{ t.freePickup }}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>{{ t.tax }}</span>
              <span>{{ formatPrice(taxes) }}</span>
            </div>
            <div class="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span class="text-lg font-medium text-gray-900">{{ t.total }}</span>
              <span class="text-2xl font-bold text-gray-900">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
          
          <!-- Checkout Button -->
          <NuxtLink
            to="/checkout"
            class="block w-full mt-6 py-4 px-6 bg-gray-900 text-white rounded-xl font-semibold text-lg text-center hover:bg-gray-800 transition-colors"
          >
            {{ t.checkout }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopwareCartLineItem } from '~/types/shopware'

definePageMeta({
  layout: false,
})

const { language } = useLanguage()
const { 
  isEmpty, 
  lineItems, 
  subtotal, 
  totalPrice, 
  taxes,
  loading,
  updateQuantity,
  removeFromCart,
  formatPrice,
  initCart,
} = useShopwareCart()

const updatingItem = ref<string | null>(null)

// Translations
const translations = {
  de: {
    cart: 'Warenkorb',
    backToShop: 'Zurück zum Shop',
    emptyCart: 'Ihr Warenkorb ist leer',
    emptyCartDescription: 'Fügen Sie Produkte hinzu, um zur Kasse zu gehen.',
    continueShopping: 'Weiter einkaufen',
    articleNumber: 'Art.-Nr.',
    remove: 'Entfernen',
    each: 'pro Stück',
    subtotal: 'Zwischensumme',
    shipping: 'Abholung',
    freePickup: 'Kostenlos',
    tax: 'inkl. MwSt.',
    total: 'Gesamtsumme',
    checkout: 'Zur Kasse',
  },
  en: {
    cart: 'Shopping Cart',
    backToShop: 'Back to Shop',
    emptyCart: 'Your cart is empty',
    emptyCartDescription: 'Add products to proceed to checkout.',
    continueShopping: 'Continue Shopping',
    articleNumber: 'SKU',
    remove: 'Remove',
    each: 'each',
    subtotal: 'Subtotal',
    shipping: 'Pickup',
    freePickup: 'Free',
    tax: 'incl. VAT',
    total: 'Total',
    checkout: 'Checkout',
  },
}

const t = computed(() => translations[language.value])

// Initialize cart
onMounted(async () => {
  await initCart()
})

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
