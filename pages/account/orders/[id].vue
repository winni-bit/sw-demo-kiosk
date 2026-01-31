<template>
  <div class="min-h-screen bg-neutral-950">
    <!-- Header -->
    <header class="bg-neutral-900 border-b border-neutral-800">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-white">
          Kiosk Shop
        </NuxtLink>
        <AccountDropdown />
      </div>
    </header>
    
    <div class="max-w-6xl mx-auto px-6 py-8">
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <aside class="lg:col-span-1">
          <div class="bg-neutral-900 rounded-2xl p-4">
            <AccountNav />
          </div>
        </aside>
        
        <!-- Main Content -->
        <main class="lg:col-span-3">
          <!-- Back Link -->
          <NuxtLink 
            to="/account/orders" 
            class="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ t.backToOrders }}
          </NuxtLink>
          
          <!-- Loading State -->
          <div v-if="loading" class="space-y-6">
            <div class="bg-neutral-900 rounded-2xl p-6 animate-pulse">
              <div class="h-8 bg-neutral-800 rounded w-1/3 mb-4" />
              <div class="h-4 bg-neutral-800 rounded w-1/4" />
            </div>
            <div class="bg-neutral-900 rounded-2xl p-6 animate-pulse">
              <div class="space-y-4">
                <div class="h-20 bg-neutral-800 rounded-xl" />
                <div class="h-20 bg-neutral-800 rounded-xl" />
              </div>
            </div>
          </div>
          
          <!-- Order Not Found -->
          <div v-else-if="!order" class="bg-neutral-900 rounded-2xl p-12 text-center">
            <div class="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-white mb-2">{{ t.orderNotFound }}</h2>
            <p class="text-neutral-400 mb-6">{{ t.orderNotFoundDescription }}</p>
            <NuxtLink 
              to="/account/orders" 
              class="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
            >
              {{ t.viewAllOrders }}
            </NuxtLink>
          </div>
          
          <!-- Order Details -->
          <div v-else class="space-y-6">
            <!-- Order Header -->
            <div class="bg-neutral-900 rounded-2xl p-6">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 class="text-2xl font-bold text-white mb-2">
                    {{ t.orderNumber }} {{ order.orderNumber }}
                  </h1>
                  <p class="text-neutral-400">
                    {{ t.orderedOn }} {{ formatDate(order.orderDateTime) }}
                  </p>
                </div>
                <div class="text-right">
                  <span 
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
                    :class="getStatusClasses(order.stateMachineState?.technicalName)"
                  >
                    {{ order.stateMachineState?.name || t.statusUnknown }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Order Items -->
            <div class="bg-neutral-900 rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4">{{ t.items }}</h2>
              
              <div class="space-y-4">
                <div 
                  v-for="item in order.lineItems" 
                  :key="item.id"
                  class="flex gap-4 p-4 bg-neutral-800 rounded-xl"
                >
                  <!-- Item Image -->
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
                  
                  <!-- Item Info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-white truncate">{{ item.label }}</h3>
                    <p v-if="item.payload?.productNumber" class="text-sm text-neutral-500">
                      {{ t.articleNumber }}: {{ item.payload.productNumber }}
                    </p>
                    <p class="text-sm text-neutral-400 mt-1">
                      {{ t.quantity }}: {{ item.quantity }}
                    </p>
                  </div>
                  
                  <!-- Item Price -->
                  <div class="text-right flex-shrink-0">
                    <p class="font-semibold text-white">{{ formatPrice(item.totalPrice) }}</p>
                    <p v-if="item.quantity > 1" class="text-sm text-neutral-500">
                      {{ formatPrice(item.unitPrice) }} {{ t.perItem }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Addresses & Payment -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Billing Address -->
              <div class="bg-neutral-900 rounded-2xl p-6">
                <h2 class="text-lg font-semibold text-white mb-4">{{ t.billingAddress }}</h2>
                <CustomerAddressDisplay 
                  v-if="order.billingAddress" 
                  :address="order.billingAddress" 
                />
                <p v-else class="text-neutral-500">{{ t.noAddress }}</p>
              </div>
              
              <!-- Shipping Address -->
              <div class="bg-neutral-900 rounded-2xl p-6">
                <h2 class="text-lg font-semibold text-white mb-4">{{ t.shippingAddress }}</h2>
                <CustomerAddressDisplay 
                  v-if="shippingAddress" 
                  :address="shippingAddress" 
                />
                <p v-else class="text-neutral-500">{{ t.noAddress }}</p>
              </div>
            </div>
            
            <!-- Payment & Shipping Method -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Payment Method -->
              <div class="bg-neutral-900 rounded-2xl p-6">
                <h2 class="text-lg font-semibold text-white mb-4">{{ t.paymentMethod }}</h2>
                <div v-if="paymentMethod">
                  <p class="text-white font-medium">{{ paymentMethod.name }}</p>
                  <p v-if="paymentStatus" class="text-sm mt-1" :class="getStatusClasses(paymentStatus.technicalName)">
                    {{ paymentStatus.name }}
                  </p>
                </div>
                <p v-else class="text-neutral-500">{{ t.noPaymentMethod }}</p>
              </div>
              
              <!-- Shipping Method -->
              <div class="bg-neutral-900 rounded-2xl p-6">
                <h2 class="text-lg font-semibold text-white mb-4">{{ t.shippingMethod }}</h2>
                <div v-if="shippingMethod">
                  <p class="text-white font-medium">{{ shippingMethod.name }}</p>
                  <p v-if="trackingCodes.length > 0" class="text-sm text-neutral-400 mt-1">
                    {{ t.tracking }}: {{ trackingCodes.join(', ') }}
                  </p>
                </div>
                <p v-else class="text-neutral-500">{{ t.noShippingMethod }}</p>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="bg-neutral-900 rounded-2xl p-6">
              <h2 class="text-lg font-semibold text-white mb-4">{{ t.orderSummary }}</h2>
              
              <div class="space-y-3">
                <div class="flex justify-between text-neutral-400">
                  <span>{{ t.subtotal }}</span>
                  <span>{{ formatPrice(order.amountNet) }}</span>
                </div>
                <div class="flex justify-between text-neutral-400">
                  <span>{{ t.shipping }}</span>
                  <span>{{ formatPrice(order.shippingTotal) }}</span>
                </div>
                <div class="flex justify-between text-neutral-400">
                  <span>{{ t.tax }}</span>
                  <span>{{ formatPrice(order.amountTotal - order.amountNet) }}</span>
                </div>
                <div class="border-t border-neutral-800 pt-3 flex justify-between">
                  <span class="text-lg font-semibold text-white">{{ t.total }}</span>
                  <span class="text-lg font-bold text-white">{{ formatPrice(order.amountTotal) }}</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopwareOrder, ShopwareAddress } from '~/types/shopware'

definePageMeta({
  middleware: 'auth',
  layout: false,
})

const route = useRoute()
const { fetchOrder } = useShopwareAuth()
const { language } = useLanguage()

// State
const order = ref<ShopwareOrder | null>(null)
const loading = ref(true)

// Translations
const translations = {
  de: {
    backToOrders: 'Zurück zu Bestellungen',
    orderNumber: 'Bestellung',
    orderedOn: 'Bestellt am',
    statusUnknown: 'Unbekannt',
    items: 'Artikel',
    articleNumber: 'Art.-Nr.',
    quantity: 'Menge',
    perItem: 'pro Stück',
    billingAddress: 'Rechnungsadresse',
    shippingAddress: 'Lieferadresse',
    noAddress: 'Keine Adresse verfügbar',
    paymentMethod: 'Zahlungsart',
    noPaymentMethod: 'Keine Zahlungsart',
    shippingMethod: 'Versandart',
    noShippingMethod: 'Keine Versandart',
    tracking: 'Sendungsnummer',
    orderSummary: 'Bestellübersicht',
    subtotal: 'Zwischensumme',
    shipping: 'Versand',
    tax: 'MwSt.',
    total: 'Gesamtsumme',
    orderNotFound: 'Bestellung nicht gefunden',
    orderNotFoundDescription: 'Die angeforderte Bestellung konnte nicht gefunden werden.',
    viewAllOrders: 'Alle Bestellungen anzeigen',
  },
  en: {
    backToOrders: 'Back to Orders',
    orderNumber: 'Order',
    orderedOn: 'Ordered on',
    statusUnknown: 'Unknown',
    items: 'Items',
    articleNumber: 'SKU',
    quantity: 'Quantity',
    perItem: 'each',
    billingAddress: 'Billing Address',
    shippingAddress: 'Shipping Address',
    noAddress: 'No address available',
    paymentMethod: 'Payment Method',
    noPaymentMethod: 'No payment method',
    shippingMethod: 'Shipping Method',
    noShippingMethod: 'No shipping method',
    tracking: 'Tracking',
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    total: 'Total',
    orderNotFound: 'Order Not Found',
    orderNotFoundDescription: 'The requested order could not be found.',
    viewAllOrders: 'View All Orders',
  },
}

const t = computed(() => translations[language.value])

// Computed
const shippingAddress = computed((): ShopwareAddress | null => {
  if (!order.value?.deliveries || order.value.deliveries.length === 0) return null
  return order.value.deliveries[0].shippingOrderAddress || null
})

const shippingMethod = computed(() => {
  if (!order.value?.deliveries || order.value.deliveries.length === 0) return null
  return order.value.deliveries[0].shippingMethod || null
})

const trackingCodes = computed((): string[] => {
  if (!order.value?.deliveries || order.value.deliveries.length === 0) return []
  return order.value.deliveries[0].trackingCodes || []
})

const paymentMethod = computed(() => {
  if (!order.value?.transactions || order.value.transactions.length === 0) return null
  return order.value.transactions[0].paymentMethod || null
})

const paymentStatus = computed(() => {
  if (!order.value?.transactions || order.value.transactions.length === 0) return null
  return order.value.transactions[0].stateMachineState || null
})

// Load order
onMounted(async () => {
  const orderId = route.params.id as string
  
  try {
    order.value = await fetchOrder(orderId)
  } catch (err) {
    console.error('[Order] Failed to load:', err)
  } finally {
    loading.value = false
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
  const currencyCode = order.value?.currency?.isoCode || 'EUR'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

// Get status classes
function getStatusClasses(status?: string): string {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'bg-green-500/20 text-green-400'
    case 'cancelled':
    case 'refunded':
      return 'bg-red-500/20 text-red-400'
    case 'in_progress':
    case 'open':
      return 'bg-yellow-500/20 text-yellow-400'
    default:
      return 'bg-neutral-700 text-neutral-400'
  }
}
</script>
