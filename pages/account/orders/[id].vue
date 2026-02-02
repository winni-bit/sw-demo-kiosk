<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-black">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-2xl font-bold text-black uppercase">
          KIOSK<span class="text-accent">.</span>
        </NuxtLink>
        <AccountDropdown />
      </div>
    </header>
    
    <div class="max-w-6xl mx-auto px-6 py-8">
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <aside class="lg:col-span-1">
          <div class="border border-black p-4">
            <AccountNav />
          </div>
        </aside>
        
        <!-- Main Content -->
        <main class="lg:col-span-3">
          <!-- Back Link -->
          <NuxtLink 
            to="/account/orders" 
            class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-6"
          >
            <span>←</span>
            {{ t.backToOrders }}
          </NuxtLink>
          
          <!-- Loading State -->
          <div v-if="loading" class="space-y-6">
            <div class="border border-black p-6">
              <div class="h-8 bg-gray-100 animate-pulse w-1/3 mb-4" />
              <div class="h-4 bg-gray-100 animate-pulse w-1/4" />
            </div>
            <div class="border border-black p-6">
              <div class="space-y-4">
                <div class="h-20 bg-gray-100 animate-pulse" />
                <div class="h-20 bg-gray-100 animate-pulse" />
              </div>
            </div>
          </div>
          
          <!-- Order Not Found -->
          <div v-else-if="!order" class="border border-black p-12 text-center">
            <div class="w-20 h-20 border-2 border-black/20 flex items-center justify-center mx-auto mb-6">
              <span class="font-display text-3xl text-black/20">?</span>
            </div>
            <h2 class="font-display text-2xl font-bold text-black uppercase mb-4">{{ t.orderNotFound }}</h2>
            <p class="font-sans text-black/50 mb-8">{{ t.orderNotFoundDescription }}</p>
            <NuxtLink 
              to="/account/orders" 
              class="inline-block px-8 py-4 bg-black text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
            >
              {{ t.viewAllOrders }}
            </NuxtLink>
          </div>
          
          <!-- Order Details -->
          <div v-else class="space-y-6">
            <!-- Order Header -->
            <div class="border border-black p-6">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 class="font-display text-3xl font-bold text-black uppercase mb-2">
                    {{ t.orderNumber }} {{ order.orderNumber }}
                  </h1>
                  <p class="font-mono text-sm text-black/50">
                    {{ t.orderedOn }} {{ formatDate(order.orderDateTime) }}
                  </p>
                </div>
                <span 
                  class="inline-flex items-center px-4 py-2 text-sm font-mono uppercase tracking-wider"
                  :class="getStatusClasses(order.stateMachineState?.technicalName)"
                >
                  {{ order.stateMachineState?.name || t.statusUnknown }}
                </span>
              </div>
            </div>
            
            <!-- Order Items -->
            <div class="border border-black">
              <div class="px-6 py-4 border-b border-black bg-gray-50">
                <h2 class="font-display text-lg font-bold text-black uppercase">{{ t.items }}</h2>
              </div>
              
              <div class="divide-y divide-black/10">
                <div 
                  v-for="item in order.lineItems" 
                  :key="item.id"
                  class="p-6 flex gap-4"
                >
                  <!-- Item Image -->
                  <div class="w-20 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
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
                  
                  <!-- Item Info -->
                  <div class="flex-1 min-w-0">
                    <h3 class="font-sans font-semibold text-black truncate">{{ item.label }}</h3>
                    <p v-if="item.payload?.productNumber" class="font-mono text-xs text-black/40">
                      {{ t.articleNumber }}: {{ item.payload.productNumber }}
                    </p>
                    <p class="font-mono text-xs text-black/50 mt-1">
                      {{ t.quantity }}: {{ item.quantity }}
                    </p>
                  </div>
                  
                  <!-- Item Price -->
                  <div class="text-right flex-shrink-0">
                    <p class="font-mono font-bold text-accent">{{ formatPrice(item.totalPrice) }}</p>
                    <p v-if="item.quantity > 1" class="font-mono text-xs text-black/40">
                      {{ formatPrice(item.unitPrice) }} {{ t.perItem }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Addresses & Payment -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Billing Address -->
              <div class="border border-black p-6">
                <h2 class="font-display text-lg font-bold text-black uppercase mb-4">{{ t.billingAddress }}</h2>
                <AccountCustomerAddressDisplay 
                  v-if="order.billingAddress" 
                  :address="order.billingAddress" 
                />
                <p v-else class="font-sans text-black/40">{{ t.noAddress }}</p>
              </div>
              
              <!-- Shipping Address -->
              <div class="border border-black p-6">
                <h2 class="font-display text-lg font-bold text-black uppercase mb-4">{{ t.shippingAddress }}</h2>
                <AccountCustomerAddressDisplay 
                  v-if="shippingAddress" 
                  :address="shippingAddress" 
                />
                <p v-else class="font-sans text-black/40">{{ t.noAddress }}</p>
              </div>
            </div>
            
            <!-- Payment & Shipping Method -->
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Payment Method -->
              <div class="border border-black p-6">
                <h2 class="font-display text-lg font-bold text-black uppercase mb-4">{{ t.paymentMethod }}</h2>
                <div v-if="paymentMethod">
                  <p class="font-sans font-semibold text-black">{{ paymentMethod.name }}</p>
                  <p v-if="paymentStatus" class="font-mono text-xs mt-1" :class="getStatusClasses(paymentStatus.technicalName)">
                    {{ paymentStatus.name }}
                  </p>
                </div>
                <p v-else class="font-sans text-black/40">{{ t.noPaymentMethod }}</p>
              </div>
              
              <!-- Shipping Method -->
              <div class="border border-black p-6">
                <h2 class="font-display text-lg font-bold text-black uppercase mb-4">{{ t.shippingMethod }}</h2>
                <div v-if="shippingMethod">
                  <p class="font-sans font-semibold text-black">{{ shippingMethod.name }}</p>
                  <p v-if="trackingCodes.length > 0" class="font-mono text-xs text-black/50 mt-1">
                    {{ t.tracking }}: {{ trackingCodes.join(', ') }}
                  </p>
                </div>
                <p v-else class="font-sans text-black/40">{{ t.noShippingMethod }}</p>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div class="border border-black p-6">
              <h2 class="font-display text-lg font-bold text-black uppercase mb-4">{{ t.orderSummary }}</h2>
              
              <div class="space-y-3">
                <div class="flex justify-between font-sans text-black/60">
                  <span>{{ t.subtotal }}</span>
                  <span>{{ formatPrice(order.amountNet) }}</span>
                </div>
                <div class="flex justify-between font-sans text-black/60">
                  <span>{{ t.shipping }}</span>
                  <span>{{ formatPrice(order.shippingTotal) }}</span>
                </div>
                <div class="flex justify-between font-sans text-black/60">
                  <span>{{ t.tax }}</span>
                  <span>{{ formatPrice(order.amountTotal - order.amountNet) }}</span>
                </div>
                <div class="border-t border-black pt-4 flex justify-between">
                  <span class="font-display font-bold text-black uppercase">{{ t.total }}</span>
                  <span class="font-mono text-2xl font-bold text-accent">{{ formatPrice(order.amountTotal) }}</span>
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

const order = ref<ShopwareOrder | null>(null)
const loading = ref(true)

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
    viewAllOrders: 'Alle Bestellungen',
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
  const currencyCode = order.value?.currency?.isoCode || 'EUR'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

function getStatusClasses(status?: string): string {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'bg-green-100 text-green-800 border border-green-300'
    case 'cancelled':
    case 'refunded':
      return 'bg-accent/10 text-accent border border-accent'
    case 'in_progress':
    case 'open':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300'
    default:
      return 'bg-gray-100 text-black/60 border border-black/20'
  }
}
</script>
