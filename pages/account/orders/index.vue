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
          <div class="border border-black">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-black">
              <h1 class="font-display text-2xl font-bold text-black uppercase">{{ t.title }}</h1>
              <p class="font-mono text-xs text-black/50">{{ total }} {{ t.ordersCount }}</p>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading" class="p-6 space-y-4">
              <div v-for="i in 5" :key="i" class="h-24 bg-gray-100 animate-pulse" />
            </div>
            
            <!-- Orders List -->
            <div v-else-if="orders.length > 0" class="divide-y divide-black/10">
              <NuxtLink
                v-for="order in orders"
                :key="order.id"
                :to="`/account/orders/${order.id}`"
                class="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <!-- Order Info -->
                  <div class="space-y-1">
                    <p class="font-sans font-semibold text-black text-lg">
                      {{ t.orderNumber }} {{ order.orderNumber }}
                    </p>
                    <p class="font-mono text-xs text-black/50">
                      {{ formatDate(order.orderDateTime) }}
                    </p>
                    <div class="flex items-center gap-3 mt-2">
                      <span 
                        class="inline-flex items-center px-3 py-1 text-xs font-mono uppercase tracking-wider"
                        :class="getStatusClasses(order.stateMachineState?.technicalName)"
                      >
                        {{ order.stateMachineState?.name || t.statusUnknown }}
                      </span>
                      <span class="font-mono text-xs text-black/40">
                        {{ getItemCount(order) }} {{ t.items }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Price & Arrow -->
                  <div class="flex items-center gap-4">
                    <p class="font-mono text-xl font-bold text-accent">
                      {{ formatPrice(order.amountTotal, order.currency) }}
                    </p>
                    <span class="font-mono text-black/30">→</span>
                  </div>
                </div>
                
                <!-- Order Items Preview -->
                <div v-if="order.lineItems && order.lineItems.length > 0" class="mt-4 flex items-center gap-2">
                  <div 
                    v-for="(item, index) in order.lineItems.slice(0, 4)" 
                    :key="item.id"
                    class="w-12 h-12 bg-gray-100 overflow-hidden flex-shrink-0"
                  >
                    <img 
                      v-if="item.cover?.url" 
                      :src="item.cover.url" 
                      :alt="item.label"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <span class="font-display text-lg text-gray-300">?</span>
                    </div>
                  </div>
                  <span v-if="order.lineItems.length > 4" class="font-mono text-xs text-black/40">
                    +{{ order.lineItems.length - 4 }} {{ t.more }}
                  </span>
                </div>
              </NuxtLink>
              
              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 p-6 border-t border-black">
                <button
                  @click="loadPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="font-mono">←</span>
                </button>
                
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="loadPage(page)"
                    class="w-10 h-10 font-mono font-bold transition-colors"
                    :class="page === currentPage 
                      ? 'bg-black text-white' 
                      : 'border border-black text-black hover:bg-black hover:text-white'"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <button
                  @click="loadPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="font-mono">→</span>
                </button>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-16 px-6">
              <div class="w-20 h-20 border-2 border-black/20 flex items-center justify-center mx-auto mb-6">
                <span class="font-display text-3xl text-black/20">∅</span>
              </div>
              <h3 class="font-display text-2xl font-bold text-black uppercase mb-4">{{ t.noOrders }}</h3>
              <p class="font-sans text-black/50 mb-8">{{ t.noOrdersDescription }}</p>
              <NuxtLink 
                to="/" 
                class="inline-block px-8 py-4 bg-black text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
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

const orders = ref<ShopwareOrder[]>([])
const loading = ref(true)
const currentPage = ref(1)
const total = ref(0)
const limit = 10

const translations = {
  de: {
    title: 'Bestellungen',
    ordersCount: 'Bestellungen',
    orderNumber: 'Bestellung',
    items: 'Artikel',
    more: 'weitere',
    noOrders: 'Keine Bestellungen',
    noOrdersDescription: 'Sie haben noch keine Bestellungen aufgegeben.',
    startShopping: 'Jetzt Einkaufen',
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

function getItemCount(order: ShopwareOrder): number {
  if (!order.lineItems) return 0
  return order.lineItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
}

async function loadPage(page: number) {
  if (page < 1 || (totalPages.value > 0 && page > totalPages.value)) return
  
  loading.value = true
  currentPage.value = page
  
  try {
    const response = await fetchOrders(page, limit)
    orders.value = response.elements || []
    total.value = response.total || 0
  } catch (err) {
    console.error('[Orders] Failed to load:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPage(1)
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

function formatPrice(amount: number, currency?: { isoCode?: string; symbol?: string }): string {
  const locale = language.value === 'de' ? 'de-DE' : 'en-GB'
  const currencyCode = currency?.isoCode || 'EUR'
  
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
