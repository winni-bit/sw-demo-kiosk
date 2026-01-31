<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-semibold text-gray-900">
          Kiosk Shop
        </NuxtLink>
        <AccountDropdown />
      </div>
    </header>
    
    <div class="max-w-6xl mx-auto px-6 py-8">
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Navigation -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-2xl p-4 shadow-sm">
            <AccountNav />
          </div>
        </aside>
        
        <!-- Main Content -->
        <main class="lg:col-span-3 space-y-6">
          <!-- Welcome Header -->
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <h1 class="text-3xl font-semibold text-gray-900 mb-3">
              {{ t.welcome }}, {{ displayName }}!
            </h1>
            <p class="text-lg text-gray-500">{{ t.welcomeSubtitle }}</p>
          </div>
          
          <!-- Statistics Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total Orders -->
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">
                <span v-if="loadingStats" class="animate-pulse">—</span>
                <span v-else>{{ stats.totalOrders }}</span>
              </p>
              <p class="text-sm text-gray-500">{{ t.totalOrders }}</p>
            </div>
            
            <!-- Total Spent -->
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">
                <span v-if="loadingStats" class="animate-pulse">—</span>
                <span v-else>{{ formatPrice(stats.totalSpent) }}</span>
              </p>
              <p class="text-sm text-gray-500">{{ t.totalSpent }}</p>
            </div>
            
            <!-- Total Items -->
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">
                <span v-if="loadingStats" class="animate-pulse">—</span>
                <span v-else>{{ stats.totalItems }}</span>
              </p>
              <p class="text-sm text-gray-500">{{ t.totalItems }}</p>
            </div>
            
            <!-- Addresses -->
            <div class="bg-white rounded-2xl p-5 shadow-sm">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">
                <span v-if="loadingStats" class="animate-pulse">—</span>
                <span v-else>{{ stats.addressCount }}</span>
              </p>
              <p class="text-sm text-gray-500">{{ t.savedAddresses }}</p>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              to="/account/orders"
              class="bg-white rounded-2xl p-6 hover:bg-gray-50 transition-colors group shadow-sm"
            >
              <div class="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mb-4 transition-colors">
                <svg class="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t.orders }}</h3>
              <p class="text-gray-500">{{ t.ordersDescription }}</p>
            </NuxtLink>
            
            <NuxtLink
              to="/account/addresses"
              class="bg-white rounded-2xl p-6 hover:bg-gray-50 transition-colors group shadow-sm"
            >
              <div class="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mb-4 transition-colors">
                <svg class="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t.addresses }}</h3>
              <p class="text-gray-500">{{ t.addressesDescription }}</p>
            </NuxtLink>
            
            <NuxtLink
              to="/"
              class="bg-white rounded-2xl p-6 hover:bg-gray-50 transition-colors group shadow-sm"
            >
              <div class="w-14 h-14 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mb-4 transition-colors">
                <svg class="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t.continueShopping }}</h3>
              <p class="text-gray-500">{{ t.continueShoppingDescription }}</p>
            </NuxtLink>
          </div>
          
          <!-- Customer Info -->
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">{{ t.accountInfo }}</h2>
            
            <div class="grid sm:grid-cols-2 gap-6">
              <!-- Email -->
              <div>
                <p class="text-sm text-gray-500 mb-1">{{ t.email }}</p>
                <p class="text-lg text-gray-900">{{ customer?.email || '-' }}</p>
              </div>
              
              <!-- Name -->
              <div>
                <p class="text-sm text-gray-500 mb-1">{{ t.name }}</p>
                <p class="text-lg text-gray-900">{{ displayName || '-' }}</p>
              </div>
              
              <!-- Billing Address -->
              <div v-if="billingAddress">
                <p class="text-sm text-gray-500 mb-1">{{ t.billingAddress }}</p>
                <p class="text-lg text-gray-900">
                  {{ billingAddress.street }}<br>
                  {{ billingAddress.zipcode }} {{ billingAddress.city }}<br>
                  {{ billingAddress.country?.name || '' }}
                </p>
              </div>
              
              <!-- Shipping Address -->
              <div v-if="shippingAddress">
                <p class="text-sm text-gray-500 mb-1">{{ t.shippingAddress }}</p>
                <p class="text-lg text-gray-900">
                  {{ shippingAddress.street }}<br>
                  {{ shippingAddress.zipcode }} {{ shippingAddress.city }}<br>
                  {{ shippingAddress.country?.name || '' }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Recent Orders -->
          <div class="bg-white rounded-2xl p-8 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">{{ t.recentOrders }}</h2>
              <NuxtLink 
                to="/account/orders" 
                class="text-gray-500 hover:text-gray-900 transition-colors"
              >
                {{ t.viewAll }}
              </NuxtLink>
            </div>
            
            <!-- Loading State -->
            <div v-if="loadingOrders" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-20 bg-gray-100 rounded-xl" />
              </div>
            </div>
            
            <!-- Orders List -->
            <div v-else-if="recentOrders.length > 0" class="space-y-4">
              <NuxtLink
                v-for="order in recentOrders"
                :key="order.id"
                :to="`/account/orders/${order.id}`"
                class="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p class="text-lg font-medium text-gray-900">{{ t.orderNumber }} {{ order.orderNumber }}</p>
                  <p class="text-gray-500">{{ formatDate(order.orderDateTime) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-semibold text-gray-900">{{ formatPrice(order.amountTotal, order.currency) }}</p>
                  <p :class="getStatusColor(order.stateMachineState?.technicalName)">
                    {{ order.stateMachineState?.name || t.statusUnknown }}
                  </p>
                </div>
              </NuxtLink>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p class="text-lg text-gray-500 mb-4">{{ t.noOrders }}</p>
              <NuxtLink 
                to="/" 
                class="inline-block px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                {{ t.startShopping }}
              </NuxtLink>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopwareOrder } from '~/types/shopware'

definePageMeta({
  middleware: 'auth',
  layout: false,
})

const { customer, billingAddress, shippingAddress, addresses, fetchOrders } = useShopwareAuth()
const { language } = useLanguage()

// State
const recentOrders = ref<ShopwareOrder[]>([])
const loadingOrders = ref(true)
const loadingStats = ref(true)

// Statistics
const stats = ref({
  totalOrders: 0,
  totalSpent: 0,
  totalItems: 0,
  addressCount: 0,
})

// Display name with fallback
const displayName = computed(() => {
  if (!customer.value) return ''
  const firstName = customer.value.firstName || ''
  const lastName = customer.value.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || customer.value.email || ''
})

// Translations
const translations = {
  de: {
    welcome: 'Willkommen',
    welcomeSubtitle: 'Verwalten Sie Ihr Konto und sehen Sie Ihre Bestellungen ein.',
    totalOrders: 'Bestellungen',
    totalSpent: 'Ausgegeben',
    totalItems: 'Artikel bestellt',
    savedAddresses: 'Adressen',
    orders: 'Bestellungen',
    ordersDescription: 'Sehen Sie Ihre Bestellhistorie ein',
    addresses: 'Adressen',
    addressesDescription: 'Verwalten Sie Ihre Adressen',
    continueShopping: 'Weiter einkaufen',
    continueShoppingDescription: 'Entdecken Sie unsere Produkte',
    accountInfo: 'Kontoinformationen',
    email: 'E-Mail',
    name: 'Name',
    billingAddress: 'Rechnungsadresse',
    shippingAddress: 'Lieferadresse',
    recentOrders: 'Letzte Bestellungen',
    viewAll: 'Alle anzeigen',
    orderNumber: 'Bestellung',
    noOrders: 'Sie haben noch keine Bestellungen.',
    startShopping: 'Jetzt einkaufen',
    statusUnknown: 'Unbekannt',
  },
  en: {
    welcome: 'Welcome',
    welcomeSubtitle: 'Manage your account and view your orders.',
    totalOrders: 'Orders',
    totalSpent: 'Total Spent',
    totalItems: 'Items Ordered',
    savedAddresses: 'Addresses',
    orders: 'Orders',
    ordersDescription: 'View your order history',
    addresses: 'Addresses',
    addressesDescription: 'Manage your addresses',
    continueShopping: 'Continue Shopping',
    continueShoppingDescription: 'Discover our products',
    accountInfo: 'Account Information',
    email: 'Email',
    name: 'Name',
    billingAddress: 'Billing Address',
    shippingAddress: 'Shipping Address',
    recentOrders: 'Recent Orders',
    viewAll: 'View all',
    orderNumber: 'Order',
    noOrders: 'You have no orders yet.',
    startShopping: 'Start shopping',
    statusUnknown: 'Unknown',
  },
}

const t = computed(() => translations[language.value])

// Load recent orders and calculate statistics
onMounted(async () => {
  try {
    // Fetch all orders to calculate statistics (up to 100)
    const response = await fetchOrders(1, 100)
    const allOrders = response.elements || []
    
    // Set recent orders (first 3)
    recentOrders.value = allOrders.slice(0, 3)
    
    // Calculate statistics
    stats.value.totalOrders = response.total || allOrders.length
    stats.value.totalSpent = allOrders.reduce((sum, order) => sum + (order.amountTotal || 0), 0)
    stats.value.totalItems = allOrders.reduce((sum, order) => {
      const itemCount = order.lineItems?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0
      return sum + itemCount
    }, 0)
    stats.value.addressCount = addresses.value?.length || 0
    
    // If no addresses from customer object, count at least the default ones
    if (stats.value.addressCount === 0) {
      if (billingAddress.value) stats.value.addressCount++
      if (shippingAddress.value && shippingAddress.value.id !== billingAddress.value?.id) {
        stats.value.addressCount++
      }
    }
    
    console.log('[Account] Statistics calculated:', stats.value)
  } catch (err) {
    console.error('[Account] Failed to load orders:', err)
  } finally {
    loadingOrders.value = false
    loadingStats.value = false
  }
})

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Format price
function formatPrice(amount: number, currency?: { isoCode?: string; symbol?: string }): string {
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  const currencyCode = currency?.isoCode || 'EUR'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

// Get status color
function getStatusColor(status?: string): string {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'text-green-600'
    case 'cancelled':
    case 'refunded':
      return 'text-red-600'
    case 'in_progress':
    case 'open':
      return 'text-yellow-600'
    default:
      return 'text-gray-500'
  }
}
</script>
