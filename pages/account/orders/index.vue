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
          <div class="bg-neutral-900 rounded-2xl p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-2xl font-bold text-white">{{ t.title }}</h1>
              <p class="text-neutral-400">{{ total }} {{ t.ordersCount }}</p>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 5" :key="i" class="animate-pulse">
                <div class="h-24 bg-neutral-800 rounded-xl" />
              </div>
            </div>
            
            <!-- Orders List -->
            <div v-else-if="orders.length > 0" class="space-y-4">
              <NuxtLink
                v-for="order in orders"
                :key="order.id"
                :to="`/account/orders/${order.id}`"
                class="block p-5 bg-neutral-800 rounded-xl hover:bg-neutral-700 transition-colors"
              >
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <!-- Order Info -->
                  <div class="space-y-1">
                    <p class="font-semibold text-white text-lg">
                      {{ t.orderNumber }} {{ order.orderNumber }}
                    </p>
                    <p class="text-sm text-neutral-400">
                      {{ formatDate(order.orderDateTime) }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <span 
                        class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        :class="getStatusClasses(order.stateMachineState?.technicalName)"
                      >
                        {{ order.stateMachineState?.name || t.statusUnknown }}
                      </span>
                      <span class="text-neutral-500 text-sm">
                        {{ getItemCount(order) }} {{ t.items }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Price & Arrow -->
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <p class="text-xl font-bold text-white">
                        {{ formatPrice(order.amountTotal, order.currency) }}
                      </p>
                    </div>
                    <svg class="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <!-- Order Items Preview -->
                <div v-if="order.lineItems && order.lineItems.length > 0" class="mt-4 flex items-center gap-2">
                  <div 
                    v-for="(item, index) in order.lineItems.slice(0, 4)" 
                    :key="item.id"
                    class="w-12 h-12 rounded-lg bg-neutral-700 overflow-hidden flex-shrink-0"
                  >
                    <img 
                      v-if="item.cover?.url" 
                      :src="item.cover.url" 
                      :alt="item.label"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <span v-if="order.lineItems.length > 4" class="text-sm text-neutral-500">
                    +{{ order.lineItems.length - 4 }} {{ t.more }}
                  </span>
                </div>
              </NuxtLink>
              
              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
                <button
                  @click="loadPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="loadPage(page)"
                    class="w-10 h-10 rounded-lg font-medium transition-colors"
                    :class="page === currentPage 
                      ? 'bg-white text-neutral-900' 
                      : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <button
                  @click="loadPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">{{ t.noOrders }}</h3>
              <p class="text-neutral-400 mb-6">{{ t.noOrdersDescription }}</p>
              <NuxtLink 
                to="/" 
                class="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
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

const { fetchOrders } = useShopwareAuth()
const { language } = useLanguage()

// State
const orders = ref<ShopwareOrder[]>([])
const loading = ref(true)
const currentPage = ref(1)
const total = ref(0)
const limit = 10

// Translations
const translations = {
  de: {
    title: 'Bestellungen',
    ordersCount: 'Bestellungen',
    orderNumber: 'Bestellung',
    items: 'Artikel',
    more: 'weitere',
    noOrders: 'Keine Bestellungen',
    noOrdersDescription: 'Sie haben noch keine Bestellungen aufgegeben.',
    startShopping: 'Jetzt einkaufen',
    statusUnknown: 'Unbekannt',
  },
  en: {
    title: 'Orders',
    ordersCount: 'orders',
    orderNumber: 'Order',
    items: 'items',
    more: 'more',
    noOrders: 'No Orders',
    noOrdersDescription: 'You have not placed any orders yet.',
    startShopping: 'Start Shopping',
    statusUnknown: 'Unknown',
  },
}

const t = computed(() => translations[language.value])

// Computed
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / limit)))

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Get item count from order
function getItemCount(order: ShopwareOrder): number {
  if (!order.lineItems) return 0
  return order.lineItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
}

// Load orders
async function loadPage(page: number) {
  if (page < 1 || (totalPages.value > 0 && page > totalPages.value)) return
  
  loading.value = true
  currentPage.value = page
  
  try {
    console.log('[Orders] Loading page:', page)
    const response = await fetchOrders(page, limit)
    orders.value = response.elements || []
    total.value = response.total || 0
    console.log('[Orders] Loaded:', orders.value.length, 'orders, total:', total.value)
  } catch (err) {
    console.error('[Orders] Failed to load:', err)
  } finally {
    loading.value = false
  }
}

// Initial load
onMounted(() => {
  loadPage(1)
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
function formatPrice(amount: number, currency?: { isoCode?: string; symbol?: string }): string {
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  const currencyCode = currency?.isoCode || 'EUR'
  
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
