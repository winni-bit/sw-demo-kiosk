<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-black">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
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
      <!-- No Order Data -->
      <div v-if="!orderData" class="border border-black p-12 text-center">
        <div class="w-24 h-24 border-2 border-black/20 flex items-center justify-center mx-auto mb-6">
          <span class="font-display text-4xl text-black/20">?</span>
        </div>
        <h2 class="font-display text-2xl font-bold text-black mb-4">{{ t.noOrderData }}</h2>
        <p class="font-sans text-black/50 mb-8">{{ t.noOrderDataDescription }}</p>
        <NuxtLink 
          to="/" 
          class="inline-block px-8 py-4 bg-black text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
        >
          {{ t.backToShop }}
        </NuxtLink>
      </div>
      
      <!-- Order Confirmation -->
      <div v-else class="space-y-8">
        <!-- Success Header -->
        <div class="text-center py-8">
          <!-- Success Icon -->
          <div class="w-24 h-24 bg-accent text-white flex items-center justify-center mx-auto mb-8">
            <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 class="font-display text-4xl md:text-5xl font-bold text-black uppercase mb-4">{{ t.orderConfirmed }}</h1>
          <p class="font-sans text-xl text-black/60">{{ t.thankYou }}</p>
        </div>
        
        <!-- Order Number -->
        <div class="border border-black p-8 text-center">
          <p class="font-mono text-xs uppercase tracking-wider text-black/50 mb-2">{{ t.orderNumber }}</p>
          <p class="font-mono text-4xl font-bold text-black">{{ orderData.orderNumber }}</p>
          <p class="font-mono text-xs text-black/40 mt-4">
            {{ t.orderedOn }} {{ formatDate(orderData.orderDateTime) }}
          </p>
        </div>
        
        <!-- Pickup Info -->
        <div class="border border-accent bg-accent/5 p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-accent text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-sans font-semibold text-accent text-lg">{{ t.pickupReady }}</h3>
              <p class="font-sans text-accent/70 mt-1">{{ t.pickupReadyDescription }}</p>
            </div>
          </div>
        </div>
        
        <!-- Order Items -->
        <div class="border border-black">
          <div class="px-6 py-4 border-b border-black bg-gray-50">
            <h2 class="font-display text-lg font-bold text-black uppercase">{{ t.orderItems }}</h2>
          </div>
          
          <div class="divide-y divide-black/10">
            <div 
              v-for="item in orderData.items" 
              :key="item.id"
              class="px-6 py-4 flex items-center gap-4"
            >
              <!-- Product Image -->
              <div class="w-16 h-16 bg-gray-100 flex-shrink-0 overflow-hidden">
                <img 
                  v-if="item.cover" 
                  :src="item.cover" 
                  :alt="item.label"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="font-display text-xl text-gray-300">?</span>
                </div>
              </div>
              
              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-sans font-medium text-black truncate">{{ item.label }}</h3>
                <p class="font-mono text-xs text-black/50 mt-1">{{ t.quantity }}: {{ item.quantity }}</p>
              </div>
              
              <!-- Price -->
              <div class="text-right">
                <p class="font-mono font-bold text-accent">{{ formatPrice(item.price) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Total -->
          <div class="px-6 py-4 bg-gray-50 border-t border-black">
            <div class="flex justify-between items-center">
              <span class="font-display font-bold text-black uppercase">{{ t.total }}</span>
              <span class="font-mono text-2xl font-bold text-accent">{{ formatPrice(orderData.amountTotal) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Customer Info -->
        <div class="border border-black p-6">
          <h2 class="font-display text-lg font-bold text-black uppercase mb-4">{{ t.customer }}</h2>
          <div class="space-y-1">
            <p class="font-sans text-black">{{ orderData.customerName }}</p>
            <p class="font-mono text-sm text-black/50">{{ orderData.customerEmail }}</p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink 
            to="/account/orders"
            class="flex-1 py-4 px-6 border border-black text-black font-sans font-semibold uppercase tracking-widest text-center hover:bg-black hover:text-white transition-colors"
          >
            {{ t.viewOrders }}
          </NuxtLink>
          <NuxtLink 
            to="/"
            class="flex-1 py-4 px-6 bg-black text-white font-sans font-semibold uppercase tracking-widest text-center hover:bg-accent transition-colors"
          >
            {{ t.continueShopping }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { language } = useLanguage()

interface OrderConfirmationData {
  orderId: string
  orderNumber: string
  orderDateTime: string
  amountTotal: number
  items: Array<{
    id: string
    label: string
    quantity: number
    price: number
    cover?: string
  }>
  customerName: string
  customerEmail: string
}

const orderData = ref<OrderConfirmationData | null>(null)

const translations = {
  de: {
    noOrderData: 'Keine Bestelldaten gefunden',
    noOrderDataDescription: 'Es wurden keine Bestelldaten gefunden.',
    backToShop: 'Zurück zum Shop',
    orderConfirmed: 'Bestellung Bestätigt',
    thankYou: 'Vielen Dank für Ihre Bestellung.',
    orderNumber: 'Bestellnummer',
    orderedOn: 'Bestellt am',
    pickupReady: 'Bereit zur Abholung',
    pickupReadyDescription: 'Ihre Bestellung wird jetzt vorbereitet und ist in Kürze am Kiosk zur Abholung bereit.',
    orderItems: 'Bestellte Artikel',
    quantity: 'Menge',
    total: 'Gesamtsumme',
    customer: 'Kunde',
    viewOrders: 'Meine Bestellungen',
    continueShopping: 'Weiter Einkaufen',
  },
  en: {
    noOrderData: 'No order data found',
    noOrderDataDescription: 'No order data was found.',
    backToShop: 'Back to Shop',
    orderConfirmed: 'Order Confirmed',
    thankYou: 'Thank you for your order.',
    orderNumber: 'Order Number',
    orderedOn: 'Ordered on',
    pickupReady: 'Ready for Pickup',
    pickupReadyDescription: 'Your order is being prepared and will be ready for pickup at the kiosk shortly.',
    orderItems: 'Order Items',
    quantity: 'Qty',
    total: 'Total',
    customer: 'Customer',
    viewOrders: 'My Orders',
    continueShopping: 'Continue Shopping',
  },
}

const t = computed(() => translations[language.value])

onMounted(() => {
  const storedData = sessionStorage.getItem('orderConfirmation')
  if (storedData) {
    try {
      orderData.value = JSON.parse(storedData)
      sessionStorage.removeItem('orderConfirmation')
    } catch (err) {
      console.error('[OrderConfirmation] Failed to parse order data:', err)
    }
  }
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(amount: number): string {
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
</script>
