<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-semibold text-gray-900">
          Kiosk Shop
        </NuxtLink>
        <div class="flex items-center gap-4">
          <KioskLanguageSwitch />
          <AccountDropdown />
        </div>
      </div>
    </header>
    
    <div class="max-w-3xl mx-auto px-6 py-12">
      <!-- No Order Data -->
      <div v-if="!orderData" class="text-center py-12">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ t.noOrderData }}</h2>
        <p class="text-gray-500 mb-6">{{ t.noOrderDataDescription }}</p>
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          {{ t.backToShop }}
        </NuxtLink>
      </div>
      
      <!-- Order Confirmation -->
      <div v-else class="space-y-8">
        <!-- Success Header -->
        <div class="text-center">
          <!-- Success Icon -->
          <div class="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 class="text-3xl font-semibold text-gray-900 mb-3">{{ t.orderConfirmed }}</h1>
          <p class="text-lg text-gray-500">{{ t.thankYou }}</p>
        </div>
        
        <!-- Order Number -->
        <div class="bg-white rounded-2xl p-6 text-center shadow-sm">
          <p class="text-gray-500 mb-2">{{ t.orderNumber }}</p>
          <p class="text-3xl font-bold text-gray-900 font-mono">{{ orderData.orderNumber }}</p>
          <p class="text-gray-500 mt-3 text-sm">
            {{ t.orderedOn }} {{ formatDate(orderData.orderDateTime) }}
          </p>
        </div>
        
        <!-- Pickup Info -->
        <div class="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-green-800">{{ t.pickupReady }}</h3>
              <p class="text-green-700 mt-1">{{ t.pickupReadyDescription }}</p>
            </div>
          </div>
        </div>
        
        <!-- Order Items -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div class="px-6 py-5 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">{{ t.orderItems }}</h2>
          </div>
          
          <div class="divide-y divide-gray-100">
            <div 
              v-for="item in orderData.items" 
              :key="item.id"
              class="px-6 py-4 flex items-center gap-4"
            >
              <!-- Product Image -->
              <div class="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                <img 
                  v-if="item.cover" 
                  :src="item.cover" 
                  :alt="item.label"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-medium text-gray-900 truncate">{{ item.label }}</h3>
                <p class="text-sm text-gray-500 mt-1">{{ t.quantity }}: {{ item.quantity }}</p>
              </div>
              
              <!-- Price -->
              <div class="text-right">
                <p class="font-semibold text-gray-900">{{ formatPrice(item.price) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Total -->
          <div class="px-6 py-5 bg-gray-50 border-t border-gray-100">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-900">{{ t.total }}</span>
              <span class="text-2xl font-bold text-gray-900">{{ formatPrice(orderData.amountTotal) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Customer Info -->
        <div class="bg-white rounded-2xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ t.customer }}</h2>
          <div class="space-y-2">
            <p class="text-gray-900">{{ orderData.customerName }}</p>
            <p class="text-gray-500">{{ orderData.customerEmail }}</p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink 
            to="/account/orders"
            class="flex-1 py-4 px-6 bg-gray-100 text-gray-900 rounded-xl font-medium text-lg text-center hover:bg-gray-200 transition-colors"
          >
            {{ t.viewOrders }}
          </NuxtLink>
          <NuxtLink 
            to="/"
            class="flex-1 py-4 px-6 bg-gray-900 text-white rounded-xl font-medium text-lg text-center hover:bg-gray-800 transition-colors"
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

// Order data from sessionStorage
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

// Translations
const translations = {
  de: {
    noOrderData: 'Keine Bestelldaten gefunden',
    noOrderDataDescription: 'Es wurden keine Bestelldaten gefunden. Möglicherweise wurde die Seite direkt aufgerufen.',
    backToShop: 'Zurück zum Shop',
    orderConfirmed: 'Bestellung bestätigt!',
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
    continueShopping: 'Weiter einkaufen',
  },
  en: {
    noOrderData: 'No order data found',
    noOrderDataDescription: 'No order data was found. The page may have been accessed directly.',
    backToShop: 'Back to Shop',
    orderConfirmed: 'Order Confirmed!',
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

// Load order data from sessionStorage
onMounted(() => {
  const storedData = sessionStorage.getItem('orderConfirmation')
  if (storedData) {
    try {
      orderData.value = JSON.parse(storedData)
      // Clear after reading (one-time use)
      sessionStorage.removeItem('orderConfirmation')
    } catch (err) {
      console.error('[OrderConfirmation] Failed to parse order data:', err)
    }
  }
})

// Format date
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

// Format price
function formatPrice(amount: number): string {
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
</script>
