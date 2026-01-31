<template>
  <div class="bg-neutral-900 rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-neutral-800">
      <h2 class="text-xl font-bold text-white">{{ t.title }}</h2>
      <p class="text-neutral-400 mt-1">{{ itemCount }} {{ itemCount === 1 ? t.item : t.items }}</p>
    </div>
    
    <!-- Line Items -->
    <div class="max-h-[400px] overflow-y-auto">
      <div 
        v-for="item in lineItems" 
        :key="item.id"
        class="px-6 py-4 border-b border-neutral-800 last:border-b-0"
      >
        <div class="flex gap-4">
          <!-- Product Image -->
          <div class="w-20 h-20 rounded-xl bg-neutral-800 overflow-hidden flex-shrink-0">
            <img 
              v-if="item.cover?.url" 
              :src="item.cover.url" 
              :alt="item.label"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-8 h-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-white truncate">{{ item.label }}</h3>
            <p v-if="item.payload?.productNumber" class="text-sm text-neutral-500 mt-1">
              {{ t.articleNumber }}: {{ item.payload.productNumber }}
            </p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-sm text-neutral-400">{{ t.quantity }}: {{ item.quantity }}</span>
              <span class="font-semibold text-white">{{ formatPrice(item.price.totalPrice) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty Cart -->
    <div v-if="lineItems.length === 0" class="px-6 py-12 text-center">
      <div class="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <p class="text-neutral-400">{{ t.emptyCart }}</p>
    </div>
    
    <!-- Price Summary -->
    <div v-if="lineItems.length > 0" class="px-6 py-5 bg-neutral-800/50 space-y-3">
      <!-- Subtotal -->
      <div class="flex justify-between text-neutral-400">
        <span>{{ t.subtotal }}</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      
      <!-- Shipping (Kiosk: Free pickup) -->
      <div class="flex justify-between text-neutral-400">
        <span>{{ t.shipping }}</span>
        <span class="text-green-400">{{ t.freePickup }}</span>
      </div>
      
      <!-- Tax -->
      <div class="flex justify-between text-neutral-400">
        <span>{{ t.tax }}</span>
        <span>{{ formatPrice(taxes) }}</span>
      </div>
      
      <!-- Divider -->
      <div class="border-t border-neutral-700 pt-3">
        <!-- Total -->
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-white">{{ t.total }}</span>
          <span class="text-2xl font-bold text-white">{{ formatPrice(totalPrice) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { lineItems, itemCount, subtotal, totalPrice, taxes, formatPrice } = useShopwareCart()
const { language } = useLanguage()

const translations = {
  de: {
    title: 'Ihre Bestellung',
    item: 'Artikel',
    items: 'Artikel',
    articleNumber: 'Art.-Nr.',
    quantity: 'Menge',
    emptyCart: 'Ihr Warenkorb ist leer',
    subtotal: 'Zwischensumme',
    shipping: 'Abholung',
    freePickup: 'Kostenlos',
    tax: 'inkl. MwSt.',
    total: 'Gesamtsumme',
  },
  en: {
    title: 'Your Order',
    item: 'item',
    items: 'items',
    articleNumber: 'SKU',
    quantity: 'Qty',
    emptyCart: 'Your cart is empty',
    subtotal: 'Subtotal',
    shipping: 'Pickup',
    freePickup: 'Free',
    tax: 'incl. VAT',
    total: 'Total',
  },
}

const t = computed(() => translations[language.value])
</script>
