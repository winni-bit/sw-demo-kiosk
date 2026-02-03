<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b-2 border-black">
      <div class="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-3xl font-bold text-black uppercase">
          KIOSK<span class="text-accent">.</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <KioskLanguageSwitch />
          <AccountDropdown />
        </div>
      </div>
    </header>
    
    <div class="max-w-5xl mx-auto px-6 py-10">
      <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-8 py-3"
      >
        <span class="text-xl">←</span>
        {{ t.backToShop }}
      </NuxtLink>
      
      <!-- Page Title -->
      <h1 class="font-display text-5xl md:text-6xl font-bold text-black uppercase mb-10">{{ t.cart }}</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-24">
        <div class="w-20 h-20 border-4 border-black border-t-accent animate-spin" />
      </div>
      
      <!-- Empty Cart -->
      <div v-else-if="isEmpty" class="border-2 border-black p-12 text-center">
        <div class="w-32 h-32 border-4 border-black/20 flex items-center justify-center mx-auto mb-8">
          <span class="font-display text-6xl text-black/20">∅</span>
        </div>
        <h2 class="font-display text-3xl font-bold text-black mb-4">{{ t.emptyCart }}</h2>
        <p class="font-sans text-lg text-black/50 mb-10">{{ t.emptyCartDescription }}</p>
        <KioskButton to="/" size="xl">
          {{ t.continueShopping }}
        </KioskButton>
      </div>
      
      <!-- Cart Content -->
      <div v-else class="space-y-10">
        <!-- Cart Items as Tiles -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="item in lineItems" 
            :key="item.id"
            class="border-2 border-black overflow-hidden"
          >
            <!-- Product Image -->
            <div class="aspect-square bg-gray-100 relative overflow-hidden">
              <img 
                v-if="item.cover?.url" 
                :src="item.cover.url" 
                :alt="item.label"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="font-display text-5xl text-gray-300">?</span>
              </div>
              
              <!-- Remove Button -->
              <button
                @click="removeItem(item.id)"
                :disabled="updatingItem === item.id"
                class="absolute top-3 right-3 w-12 h-12 bg-white border-2 border-black flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-colors disabled:opacity-50 touch-manipulation"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <!-- Product Info -->
            <div class="p-5">
              <h3 class="font-sans font-semibold text-black text-lg leading-tight line-clamp-2 mb-2">
                {{ item.label }}
              </h3>
              <p v-if="item.payload?.productNumber" class="font-mono text-xs text-black/40 mb-4">
                {{ t.articleNumber }}: {{ item.payload.productNumber }}
              </p>
              
              <!-- Price -->
              <div class="flex items-center justify-between mb-5">
                <p class="font-mono text-2xl font-bold text-accent">{{ formatPrice(item.price.totalPrice) }}</p>
                <p v-if="item.quantity > 1" class="font-mono text-sm text-black/40">
                  {{ formatPrice(item.price.unitPrice) }} {{ t.each }}
                </p>
              </div>
              
              <!-- Quantity Controls -->
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="decreaseQuantity(item)"
                  :disabled="updatingItem === item.id"
                  class="w-16 h-16 border-2 border-black flex items-center justify-center text-2xl font-mono font-bold hover:bg-black hover:text-white transition-colors disabled:opacity-50 touch-manipulation"
                >
                  −
                </button>
                <span class="w-20 text-center font-mono text-2xl font-bold">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item)"
                  :disabled="updatingItem === item.id"
                  class="w-16 h-16 border-2 border-black flex items-center justify-center text-2xl font-mono font-bold hover:bg-black hover:text-white transition-colors disabled:opacity-50 touch-manipulation"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cart Summary -->
        <div class="border-2 border-black p-6 lg:p-8">
          <div class="space-y-4">
            <div class="flex justify-between font-sans text-lg text-black/60">
              <span>{{ t.subtotal }}</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between font-sans text-lg text-black/60">
              <span>{{ t.shipping }}</span>
              <span class="text-accent font-semibold">{{ t.freePickup }}</span>
            </div>
            <div class="flex justify-between font-sans text-lg text-black/60">
              <span>{{ t.tax }}</span>
              <span>{{ formatPrice(taxes) }}</span>
            </div>
            <div class="border-t-2 border-black pt-5 flex justify-between items-center">
              <span class="font-display text-2xl font-bold text-black uppercase">{{ t.total }}</span>
              <span class="font-mono text-4xl font-bold text-accent">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
          
          <!-- Checkout Button -->
          <div class="mt-8">
            <KioskButton to="/checkout" size="xl" full-width>
              {{ t.checkout }}
            </KioskButton>
          </div>
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

const translations = {
  de: {
    cart: 'Warenkorb',
    backToShop: 'Zurück zum Shop',
    emptyCart: 'Warenkorb ist leer',
    emptyCartDescription: 'Fügen Sie Produkte hinzu, um zur Kasse zu gehen.',
    continueShopping: 'Weiter Einkaufen',
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
    cart: 'Cart',
    backToShop: 'Back to Shop',
    emptyCart: 'Cart is empty',
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
