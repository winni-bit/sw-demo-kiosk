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
      <!-- Back Link -->
      <NuxtLink 
        to="/account" 
        class="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-8 py-3"
      >
        <span class="text-xl">←</span>
        {{ t.backToAccount }}
      </NuxtLink>
      
      <div class="border-2 border-black">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b-2 border-black">
          <h1 class="font-display text-3xl font-bold text-black uppercase">{{ t.title }}</h1>
          <p class="font-mono text-base text-black/50">{{ total }} {{ t.ordersCount }}</p>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="p-6">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="h-56 bg-gray-100 animate-pulse" />
          </div>
        </div>
        
        <!-- Orders as Tiles -->
        <div v-else-if="orders.length > 0" class="p-6">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink
              v-for="order in orders"
              :key="order.id"
              :to="`/account/orders/${order.id}`"
              class="border-2 border-black p-6 hover:bg-gray-50 transition-colors touch-manipulation"
            >
              <p class="font-mono text-xs text-black/40 uppercase">{{ t.orderNumber }}</p>
              <p class="font-sans text-2xl font-bold text-black mt-1">{{ order.orderNumber }}</p>
              <p class="font-mono text-sm text-black/50 mt-3">{{ formatDate(order.orderDateTime) }}</p>
              
              <!-- Order Items Preview -->
              <div v-if="order.lineItems && order.lineItems.length > 0" class="mt-4 flex items-center gap-2">
                <div 
                  v-for="(item, index) in order.lineItems.slice(0, 3)" 
                  :key="item.id"
                  class="w-12 h-12 bg-gray-100 overflow-hidden flex-shrink-0 border border-black/10"
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
                <span v-if="order.lineItems.length > 3" class="font-mono text-xs text-black/40">
                  +{{ order.lineItems.length - 3 }}
                </span>
              </div>
              
              <div class="flex items-center justify-between mt-5 pt-4 border-t border-black/10">
                <span 
                  class="inline-flex items-center px-3 py-1.5 text-xs font-mono uppercase tracking-wider"
                  :class="getStatusClasses(order.stateMachineState?.technicalName)"
                >
                  {{ order.stateMachineState?.name || t.statusUnknown }}
                </span>
                <p class="font-mono text-2xl font-bold text-accent">
                  {{ formatPrice(order.amountTotal, order.currency) }}
                </p>
              </div>
            </NuxtLink>
          </div>
          
          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-8 pt-6 border-t-2 border-black">
            <button
              @click="loadPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="w-14 h-14 border-2 border-black flex items-center justify-center text-xl hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors touch-manipulation"
            >
              ←
            </button>
            
            <div class="flex items-center gap-2">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="loadPage(page)"
                class="w-14 h-14 font-mono text-lg font-bold transition-colors touch-manipulation"
                :class="page === currentPage 
                  ? 'bg-black text-white' 
                  : 'border-2 border-black text-black hover:bg-black hover:text-white'"
              >
                {{ page }}
              </button>
            </div>
            
            <button
              @click="loadPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="w-14 h-14 border-2 border-black flex items-center justify-center text-xl hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors touch-manipulation"
            >
              →
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-20 px-6">
          <div class="w-24 h-24 border-4 border-black/20 flex items-center justify-center mx-auto mb-8">
            <span class="font-display text-5xl text-black/20">∅</span>
          </div>
          <h3 class="font-display text-3xl font-bold text-black uppercase mb-4">{{ t.noOrders }}</h3>
          <p class="font-sans text-lg text-black/50 mb-10">{{ t.noOrdersDescription }}</p>
          <KioskButton to="/" size="xl">
            {{ t.startShopping }}
          </KioskButton>
        </div>
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
const limit = 9

const translations = {
  de: {
    title: 'Bestellungen',
    backToAccount: 'Zurück zum Konto',
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
    backToAccount: 'Back to Account',
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
