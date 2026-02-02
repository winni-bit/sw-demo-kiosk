<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-black">
      <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-2xl font-bold text-black uppercase">
          KIOSK<span class="text-accent">.</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <KioskLanguageSwitch />
          <AccountDropdown />
        </div>
      </div>
    </header>
    
    <div class="max-w-3xl mx-auto px-6 py-12">
      <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-8"
      >
        <span>←</span>
        {{ t.backToShop }}
      </NuxtLink>
      
      <!-- Page Title -->
      <h1 class="font-display text-5xl md:text-6xl font-bold text-black uppercase mb-12">{{ t.cart }}</h1>
      
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-16 h-16 border-2 border-black border-t-accent animate-spin" />
      </div>
      
      <!-- Empty Cart -->
      <div v-else-if="isEmpty" class="border border-black p-12 text-center">
        <div class="w-24 h-24 border-2 border-black/20 flex items-center justify-center mx-auto mb-6">
          <span class="font-display text-4xl text-black/20">∅</span>
        </div>
        <h2 class="font-display text-2xl font-bold text-black mb-4">{{ t.emptyCart }}</h2>
        <p class="font-sans text-black/50 mb-8">{{ t.emptyCartDescription }}</p>
        <NuxtLink 
          to="/" 
          class="inline-block px-8 py-4 bg-black text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
        >
          {{ t.continueShopping }}
        </NuxtLink>
      </div>
      
      <!-- Cart Content -->
      <div v-else class="space-y-8">
        <!-- Cart Items -->
        <div class="border border-black divide-y divide-black">
          <div 
            v-for="item in lineItems" 
            :key="item.id"
            class="p-6"
          >
            <div class="flex gap-6">
              <!-- Product Image -->
              <div class="w-24 h-24 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img 
                  v-if="item.cover?.url" 
                  :src="item.cover.url" 
                  :alt="item.label"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="font-display text-2xl text-gray-300">?</span>
                </div>
              </div>
              
              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-sans font-semibold text-black text-lg">{{ item.label }}</h3>
                <p v-if="item.payload?.productNumber" class="font-mono text-xs text-black/40 mt-1">
                  {{ t.articleNumber }}: {{ item.payload.productNumber }}
                </p>
                
                <!-- Quantity Controls -->
                <div class="flex items-center gap-4 mt-4">
                  <div class="flex items-center">
                    <button
                      @click="decreaseQuantity(item)"
                      :disabled="updatingItem === item.id"
                      class="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span class="font-mono">−</span>
                    </button>
                    <span class="w-14 text-center font-mono font-bold text-lg">{{ item.quantity }}</span>
                    <button
                      @click="increaseQuantity(item)"
                      :disabled="updatingItem === item.id"
                      class="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span class="font-mono">+</span>
                    </button>
                  </div>
                  
                  <!-- Remove Button -->
                  <button
                    @click="removeItem(item.id)"
                    :disabled="updatingItem === item.id"
                    class="font-mono text-xs uppercase tracking-wider text-accent hover:underline disabled:opacity-50"
                  >
                    {{ t.remove }}
                  </button>
                </div>
              </div>
              
              <!-- Price -->
              <div class="text-right">
                <p class="font-mono text-xl font-bold text-accent">{{ formatPrice(item.price.totalPrice) }}</p>
                <p v-if="item.quantity > 1" class="font-mono text-xs text-black/40 mt-1">
                  {{ formatPrice(item.price.unitPrice) }} {{ t.each }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cart Summary -->
        <div class="border border-black p-6">
          <div class="space-y-3">
            <div class="flex justify-between font-sans text-black/60">
              <span>{{ t.subtotal }}</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between font-sans text-black/60">
              <span>{{ t.shipping }}</span>
              <span class="text-accent font-semibold">{{ t.freePickup }}</span>
            </div>
            <div class="flex justify-between font-sans text-black/60">
              <span>{{ t.tax }}</span>
              <span>{{ formatPrice(taxes) }}</span>
            </div>
            <div class="border-t border-black pt-4 flex justify-between items-center">
              <span class="font-display text-xl font-bold text-black uppercase">{{ t.total }}</span>
              <span class="font-mono text-3xl font-bold text-accent">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
          
          <!-- Checkout Button -->
          <NuxtLink
            to="/checkout"
            class="block w-full mt-6 py-4 px-6 bg-black text-white font-sans font-semibold text-lg uppercase tracking-widest text-center hover:bg-accent transition-colors"
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
