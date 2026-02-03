<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b-2 border-black">
      <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-3xl font-bold text-black uppercase">
          KIOSK<span class="text-accent">.</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <KioskLanguageSwitch />
          <AccountDropdown />
        </div>
      </div>
    </header>
    
    <div class="max-w-6xl mx-auto px-6 py-10">
      <!-- Welcome Header -->
      <div class="border-2 border-black p-8 mb-10">
        <h1 class="font-display text-4xl md:text-5xl font-bold text-black uppercase mb-4">
          {{ t.welcome }},
        </h1>
        <p class="font-display text-3xl md:text-4xl font-bold text-accent">{{ displayName }}</p>
        <p class="font-sans text-lg text-black/50 mt-4">{{ t.welcomeSubtitle }}</p>
      </div>
      
      <!-- Budget Card - Prominent Display -->
      <div class="border-2 border-accent bg-accent/5 p-8 mb-10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div class="flex items-center gap-4 mb-3">
              <div class="w-14 h-14 bg-accent text-white flex items-center justify-center flex-shrink-0">
                <span class="font-mono text-2xl">€</span>
              </div>
              <span class="font-mono text-sm text-accent uppercase tracking-wider">{{ t.availableBudget }}</span>
            </div>
            <p class="font-mono text-6xl md:text-7xl font-bold text-accent">
              {{ formatPrice(customerBudget) }}
            </p>
          </div>
          <div class="md:text-right">
            <p class="font-sans text-base text-accent/70">{{ t.budgetDescription }}</p>
          </div>
        </div>
      </div>
      
      <!-- Statistics Cards - Large Kiosk Tiles -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <!-- Total Orders -->
        <div class="border-2 border-black p-6">
          <span class="font-mono text-sm text-black/40 uppercase tracking-wider">{{ t.totalOrders }}</span>
          <p class="font-mono text-5xl font-bold text-black mt-3">
            <span v-if="loadingStats" class="animate-pulse">—</span>
            <span v-else>{{ stats.totalOrders }}</span>
          </p>
        </div>
        
        <!-- Total Spent -->
        <div class="border-2 border-black p-6">
          <span class="font-mono text-sm text-black/40 uppercase tracking-wider">{{ t.totalSpent }}</span>
          <p class="font-mono text-5xl font-bold text-black mt-3">
            <span v-if="loadingStats" class="animate-pulse">—</span>
            <span v-else>{{ formatPrice(stats.totalSpent) }}</span>
          </p>
        </div>
        
        <!-- Total Items -->
        <div class="border-2 border-black p-6">
          <span class="font-mono text-sm text-black/40 uppercase tracking-wider">{{ t.totalItems }}</span>
          <p class="font-mono text-5xl font-bold text-black mt-3">
            <span v-if="loadingStats" class="animate-pulse">—</span>
            <span v-else>{{ stats.totalItems }}</span>
          </p>
        </div>
        
        <!-- Addresses -->
        <div class="border-2 border-black p-6">
          <span class="font-mono text-sm text-black/40 uppercase tracking-wider">{{ t.savedAddresses }}</span>
          <p class="font-mono text-5xl font-bold text-black mt-3">
            <span v-if="loadingStats" class="animate-pulse">—</span>
            <span v-else>{{ stats.addressCount }}</span>
          </p>
        </div>
      </div>
      
      <!-- Quick Actions - Large Touch-Friendly Tiles -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <NuxtLink
          to="/account/orders"
          class="border-2 border-black p-8 hover:bg-black hover:text-white transition-colors group touch-manipulation"
        >
          <span class="font-mono text-sm text-black/40 group-hover:text-white/40">01</span>
          <h3 class="font-display text-3xl font-bold uppercase mt-3">{{ t.orders }}</h3>
          <p class="font-sans text-base text-black/50 group-hover:text-white/50 mt-3">{{ t.ordersDescription }}</p>
        </NuxtLink>
        
        <NuxtLink
          to="/account/addresses"
          class="border-2 border-black p-8 hover:bg-black hover:text-white transition-colors group touch-manipulation"
        >
          <span class="font-mono text-sm text-black/40 group-hover:text-white/40">02</span>
          <h3 class="font-display text-3xl font-bold uppercase mt-3">{{ t.addresses }}</h3>
          <p class="font-sans text-base text-black/50 group-hover:text-white/50 mt-3">{{ t.addressesDescription }}</p>
        </NuxtLink>
        
        <NuxtLink
          to="/"
          class="border-2 border-black p-8 hover:bg-accent hover:text-white transition-colors group touch-manipulation"
        >
          <span class="font-mono text-sm text-black/40 group-hover:text-white/40">03</span>
          <h3 class="font-display text-3xl font-bold uppercase mt-3">{{ t.continueShopping }}</h3>
          <p class="font-sans text-base text-black/50 group-hover:text-white/50 mt-3">{{ t.continueShoppingDescription }}</p>
        </NuxtLink>
      </div>
      
      <!-- Customer Info -->
      <div class="border-2 border-black p-8 mb-10">
        <h2 class="font-display text-2xl font-bold text-black uppercase mb-8">{{ t.accountInfo }}</h2>
        
        <div class="grid sm:grid-cols-2 gap-8">
          <div>
            <p class="font-mono text-sm text-black/40 uppercase tracking-wider mb-2">{{ t.email }}</p>
            <p class="font-sans text-xl text-black">{{ customer?.email || '-' }}</p>
          </div>
          
          <div>
            <p class="font-mono text-sm text-black/40 uppercase tracking-wider mb-2">{{ t.name }}</p>
            <p class="font-sans text-xl text-black">{{ displayName || '-' }}</p>
          </div>
          
          <div v-if="billingAddress">
            <p class="font-mono text-sm text-black/40 uppercase tracking-wider mb-2">{{ t.billingAddress }}</p>
            <p class="font-sans text-lg text-black">
              {{ billingAddress.street }}<br>
              {{ billingAddress.zipcode }} {{ billingAddress.city }}<br>
              {{ billingAddress.country?.name || '' }}
            </p>
          </div>
          
          <div v-if="shippingAddress">
            <p class="font-mono text-sm text-black/40 uppercase tracking-wider mb-2">{{ t.shippingAddress }}</p>
            <p class="font-sans text-lg text-black">
              {{ shippingAddress.street }}<br>
              {{ shippingAddress.zipcode }} {{ shippingAddress.city }}<br>
              {{ shippingAddress.country?.name || '' }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Recent Orders as Tiles -->
      <div class="border-2 border-black">
        <div class="flex items-center justify-between px-6 py-5 border-b-2 border-black">
          <h2 class="font-display text-2xl font-bold text-black uppercase">{{ t.recentOrders }}</h2>
          <NuxtLink 
            to="/account/orders" 
            class="font-mono text-sm uppercase tracking-wider text-black/50 hover:text-accent transition-colors py-2"
          >
            {{ t.viewAll }} →
          </NuxtLink>
        </div>
        
        <!-- Loading State -->
        <div v-if="loadingOrders" class="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="h-48 bg-gray-100 animate-pulse" />
        </div>
        
        <!-- Orders Grid -->
        <div v-else-if="recentOrders.length > 0" class="p-6">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              v-for="order in recentOrders"
              :key="order.id"
              :to="`/account/orders/${order.id}`"
              class="border-2 border-black p-6 hover:bg-gray-50 transition-colors touch-manipulation"
            >
              <p class="font-mono text-xs text-black/40 uppercase">{{ t.orderNumber }}</p>
              <p class="font-sans text-xl font-bold text-black mt-1">{{ order.orderNumber }}</p>
              <p class="font-mono text-sm text-black/50 mt-3">{{ formatDate(order.orderDateTime) }}</p>
              <div class="flex items-center justify-between mt-4">
                <p class="font-mono text-2xl font-bold text-accent">{{ formatPrice(order.amountTotal, order.currency) }}</p>
                <span :class="getStatusColor(order.stateMachineState?.technicalName)" class="font-mono text-xs uppercase">
                  {{ order.stateMachineState?.name || t.statusUnknown }}
                </span>
              </div>
            </NuxtLink>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-16 px-6">
          <div class="w-20 h-20 border-4 border-black/20 flex items-center justify-center mx-auto mb-6">
            <span class="font-display text-4xl text-black/20">∅</span>
          </div>
          <p class="font-sans text-lg text-black/50 mb-8">{{ t.noOrders }}</p>
          <KioskButton to="/" size="lg">
            {{ t.startShopping }}
          </KioskButton>
        </div>
      </div>
      
      <!-- Logout Button -->
      <div class="mt-10">
        <KioskButton 
          variant="outline" 
          size="lg" 
          full-width 
          @click="handleLogout"
        >
          {{ t.logout }}
        </KioskButton>
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

const router = useRouter()
const { customer, billingAddress, shippingAddress, addresses, fetchOrders, logout, customerBudget } = useShopwareAuth()
const { language } = useLanguage()

const recentOrders = ref<ShopwareOrder[]>([])
const loadingOrders = ref(true)
const loadingStats = ref(true)

const stats = ref({
  totalOrders: 0,
  totalSpent: 0,
  totalItems: 0,
  addressCount: 0,
})

const displayName = computed(() => {
  if (!customer.value) return ''
  const firstName = customer.value.firstName || ''
  const lastName = customer.value.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || customer.value.email || ''
})

const translations = {
  de: {
    welcome: 'Willkommen',
    welcomeSubtitle: 'Verwalten Sie Ihr Konto und sehen Sie Ihre Bestellungen ein.',
    availableBudget: 'Verfügbares Budget',
    budgetDescription: 'Dieses Budget wird für Ihre Bestellungen am Kiosk verwendet.',
    totalOrders: 'Bestellungen',
    totalSpent: 'Ausgegeben',
    totalItems: 'Artikel',
    savedAddresses: 'Adressen',
    orders: 'Bestellungen',
    ordersDescription: 'Bestellhistorie einsehen',
    addresses: 'Adressen',
    addressesDescription: 'Adressen verwalten',
    continueShopping: 'Einkaufen',
    continueShoppingDescription: 'Produkte entdecken',
    accountInfo: 'Kontoinformationen',
    email: 'E-Mail',
    name: 'Name',
    billingAddress: 'Rechnungsadresse',
    shippingAddress: 'Lieferadresse',
    recentOrders: 'Letzte Bestellungen',
    viewAll: 'Alle anzeigen',
    orderNumber: 'Bestellung',
    noOrders: 'Noch keine Bestellungen.',
    startShopping: 'Jetzt Einkaufen',
    statusUnknown: 'Unbekannt',
    logout: 'Abmelden',
  },
  en: {
    welcome: 'Welcome',
    welcomeSubtitle: 'Manage your account and view your orders.',
    availableBudget: 'Available Budget',
    budgetDescription: 'This budget will be used for your orders at the kiosk.',
    totalOrders: 'Orders',
    totalSpent: 'Spent',
    totalItems: 'Items',
    savedAddresses: 'Addresses',
    orders: 'Orders',
    ordersDescription: 'View order history',
    addresses: 'Addresses',
    addressesDescription: 'Manage addresses',
    continueShopping: 'Shop',
    continueShoppingDescription: 'Discover products',
    accountInfo: 'Account Information',
    email: 'Email',
    name: 'Name',
    billingAddress: 'Billing Address',
    shippingAddress: 'Shipping Address',
    recentOrders: 'Recent Orders',
    viewAll: 'View all',
    orderNumber: 'Order',
    noOrders: 'No orders yet.',
    startShopping: 'Start Shopping',
    statusUnknown: 'Unknown',
    logout: 'Sign Out',
  },
}

const t = computed(() => translations[language.value])

onMounted(async () => {
  try {
    const response = await fetchOrders(1, 100)
    const allOrders = response.elements || []
    
    recentOrders.value = allOrders.slice(0, 3)
    
    stats.value.totalOrders = response.total || allOrders.length
    stats.value.totalSpent = allOrders.reduce((sum, order) => sum + (order.amountTotal || 0), 0)
    stats.value.totalItems = allOrders.reduce((sum, order) => {
      const itemCount = order.lineItems?.reduce((itemSum, item) => itemSum + (item.quantity || 0), 0) || 0
      return sum + itemCount
    }, 0)
    stats.value.addressCount = addresses.value?.length || 0
    
    if (stats.value.addressCount === 0) {
      if (billingAddress.value) stats.value.addressCount++
      if (shippingAddress.value && shippingAddress.value.id !== billingAddress.value?.id) {
        stats.value.addressCount++
      }
    }
  } catch (err) {
    console.error('[Account] Failed to load orders:', err)
  } finally {
    loadingOrders.value = false
    loadingStats.value = false
  }
})

async function handleLogout() {
  await logout()
  router.push('/')
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatPrice(amount: number, currency?: { isoCode?: string; symbol?: string }): string {
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  const currencyCode = currency?.isoCode || 'EUR'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount)
}

function getStatusColor(status?: string): string {
  switch (status) {
    case 'completed':
    case 'paid':
      return 'text-green-600'
    case 'cancelled':
    case 'refunded':
      return 'text-accent'
    case 'in_progress':
    case 'open':
      return 'text-yellow-600'
    default:
      return 'text-black/50'
  }
}
</script>
