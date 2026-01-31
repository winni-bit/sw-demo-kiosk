<template>
  <div class="min-h-screen bg-neutral-950">
    <!-- Header -->
    <header class="bg-neutral-900 border-b border-neutral-800">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-white">
          Kiosk Shop
        </NuxtLink>
        <div class="flex items-center gap-4">
          <AccountDropdown />
          <KioskLanguageSwitch />
        </div>
      </div>
    </header>
    
    <div class="max-w-4xl mx-auto px-6 py-8">
      <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {{ t.backToShop }}
      </NuxtLink>
      
      <!-- Page Title -->
      <h1 class="text-3xl font-bold text-white mb-8">{{ t.checkout }}</h1>
      
      <!-- Loading State -->
      <div v-if="initialLoading" class="flex items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-neutral-700 border-t-white rounded-full animate-spin" />
      </div>
      
      <!-- Empty Cart -->
      <div v-else-if="isEmpty" class="bg-neutral-900 rounded-2xl p-12 text-center">
        <div class="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">{{ t.emptyCart }}</h2>
        <p class="text-neutral-400 mb-6">{{ t.emptyCartDescription }}</p>
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
        >
          {{ t.continueShopping }}
        </NuxtLink>
      </div>
      
      <!-- Not Logged In -->
      <div v-else-if="!isLoggedIn" class="bg-neutral-900 rounded-2xl p-12 text-center">
        <div class="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">{{ t.loginRequired }}</h2>
        <p class="text-neutral-400 mb-6">{{ t.loginRequiredDescription }}</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink 
            to="/account/login" 
            class="px-8 py-4 bg-white text-neutral-900 rounded-xl font-semibold text-lg hover:bg-neutral-100 transition-colors"
          >
            {{ t.login }}
          </NuxtLink>
          <NuxtLink 
            to="/account/register" 
            class="px-8 py-4 bg-neutral-800 text-white rounded-xl font-semibold text-lg hover:bg-neutral-700 transition-colors"
          >
            {{ t.register }}
          </NuxtLink>
        </div>
      </div>
      
      <!-- Checkout Content -->
      <div v-else class="space-y-6">
        <!-- Customer Info Card -->
        <div class="bg-neutral-900 rounded-2xl p-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ customerInitials }}</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">{{ customerName }}</h2>
              <p class="text-neutral-400">{{ customer?.email }}</p>
            </div>
          </div>
        </div>
        
        <!-- Products List -->
        <div class="bg-neutral-900 rounded-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-neutral-800">
            <h2 class="text-xl font-bold text-white">{{ t.orderItems }}</h2>
            <p class="text-neutral-400 mt-1">{{ itemCount }} {{ itemCount === 1 ? t.item : t.items }}</p>
          </div>
          
          <div class="divide-y divide-neutral-800">
            <div 
              v-for="item in lineItems" 
              :key="item.id"
              class="px-6 py-5 flex items-center gap-5"
            >
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
                <h3 class="font-semibold text-white text-lg truncate">{{ item.label }}</h3>
                <p class="text-neutral-400 mt-1">{{ t.quantity }}: {{ item.quantity }}</p>
              </div>
              
              <!-- Price -->
              <div class="text-right flex-shrink-0">
                <p class="text-xl font-bold text-white">{{ formatPrice(item.price.totalPrice) }}</p>
                <p v-if="item.quantity > 1" class="text-sm text-neutral-500">
                  {{ formatPrice(item.price.unitPrice) }} {{ t.each }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Budget Info -->
        <div class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-green-400 text-lg">{{ t.budgetPayment }}</h3>
              <p class="text-green-400/70 text-sm mt-1">{{ t.budgetPaymentDescription }}</p>
            </div>
          </div>
        </div>
        
        <!-- Price Summary -->
        <div class="bg-neutral-900 rounded-2xl p-6 space-y-4">
          <div class="flex justify-between text-neutral-400">
            <span>{{ t.subtotal }}</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          
          <div class="flex justify-between text-neutral-400">
            <span>{{ t.pickup }}</span>
            <span class="text-green-400">{{ t.free }}</span>
          </div>
          
          <div class="flex justify-between text-neutral-400">
            <span>{{ t.tax }}</span>
            <span>{{ formatPrice(taxes) }}</span>
          </div>
          
          <div class="border-t border-neutral-800 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-xl font-semibold text-white">{{ t.total }}</span>
              <span class="text-3xl font-bold text-white">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Error Message -->
        <div 
          v-if="orderError" 
          class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
        >
          {{ orderError }}
        </div>
        
        <!-- Place Order Button -->
        <button
          @click="submitOrder"
          :disabled="placingOrder"
          class="w-full py-6 px-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-2xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 shadow-lg shadow-orange-500/25"
        >
          <svg 
            v-if="placingOrder" 
            class="w-8 h-8 animate-spin" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <svg v-else class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ placingOrder ? t.placingOrder : t.placeOrder }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const router = useRouter()
const { language } = useLanguage()
const { isLoggedIn, customer, customerName } = useShopwareAuth()
const { 
  isEmpty, 
  lineItems,
  itemCount,
  subtotal,
  totalPrice,
  taxes,
  fetchCart, 
  placeOrder,
  formatPrice,
  getContextToken,
} = useShopwareCart()

// State
const initialLoading = ref(true)
const placingOrder = ref(false)
const orderError = ref<string | null>(null)

// Translations
const translations = {
  de: {
    checkout: 'Kasse',
    backToShop: 'Zurück zum Shop',
    emptyCart: 'Ihr Warenkorb ist leer',
    emptyCartDescription: 'Fügen Sie Produkte hinzu, um zur Kasse zu gehen.',
    continueShopping: 'Weiter einkaufen',
    loginRequired: 'Anmeldung erforderlich',
    loginRequiredDescription: 'Bitte melden Sie sich an, um Ihre Bestellung abzuschließen.',
    login: 'Anmelden',
    register: 'Registrieren',
    orderItems: 'Ihre Bestellung',
    item: 'Artikel',
    items: 'Artikel',
    quantity: 'Menge',
    each: 'pro Stück',
    budgetPayment: 'Zahlung über Budget',
    budgetPaymentDescription: 'Der Betrag wird von Ihrem verfügbaren Guthaben abgezogen.',
    subtotal: 'Zwischensumme',
    pickup: 'Abholung am Kiosk',
    free: 'Kostenlos',
    tax: 'inkl. MwSt.',
    total: 'Gesamtsumme',
    placeOrder: 'Jetzt bestellen',
    placingOrder: 'Bestellung wird aufgegeben...',
  },
  en: {
    checkout: 'Checkout',
    backToShop: 'Back to Shop',
    emptyCart: 'Your cart is empty',
    emptyCartDescription: 'Add products to proceed to checkout.',
    continueShopping: 'Continue Shopping',
    loginRequired: 'Login Required',
    loginRequiredDescription: 'Please log in to complete your order.',
    login: 'Sign In',
    register: 'Register',
    orderItems: 'Your Order',
    item: 'item',
    items: 'items',
    quantity: 'Quantity',
    each: 'each',
    budgetPayment: 'Budget Payment',
    budgetPaymentDescription: 'The amount will be deducted from your available balance.',
    subtotal: 'Subtotal',
    pickup: 'Kiosk Pickup',
    free: 'Free',
    tax: 'incl. VAT',
    total: 'Total',
    placeOrder: 'Place Order',
    placingOrder: 'Placing order...',
  },
}

const t = computed(() => translations[language.value])

// Customer initials
const customerInitials = computed(() => {
  if (!customer.value) return '?'
  const firstName = customer.value.firstName || ''
  const lastName = customer.value.lastName || ''
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) return firstName[0].toUpperCase()
  return '?'
})

// Initialize checkout
onMounted(async () => {
  await nextTick()
  
  try {
    console.log('[Checkout] Initializing...')
    console.log('[Checkout] Current context token:', getContextToken() ? 'exists' : 'none')
    
    await fetchCart()
    
    console.log('[Checkout] Cart fetched, isEmpty:', isEmpty.value, 'items:', lineItems.value.length)
  } catch (err) {
    console.error('[Checkout] Init error:', err)
  } finally {
    initialLoading.value = false
  }
})

// Submit order
async function submitOrder() {
  placingOrder.value = true
  orderError.value = null
  
  try {
    const orderData = {
      items: lineItems.value.map(item => ({
        id: item.id,
        label: item.label,
        quantity: item.quantity,
        price: item.price.totalPrice,
        cover: item.cover?.url,
      })),
      total: totalPrice.value,
      customerName: customerName.value,
      customerEmail: customer.value?.email,
    }
    
    const order = await placeOrder()
    
    if (order) {
      const confirmationData = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderDateTime: order.orderDateTime,
        amountTotal: order.amountTotal,
        items: orderData.items,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
      }
      
      sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmationData))
      router.push('/order-confirmation')
    } else {
      orderError.value = language.value === 'de' 
        ? 'Fehler beim Aufgeben der Bestellung. Bitte versuchen Sie es erneut.'
        : 'Failed to place order. Please try again.'
    }
  } catch (err: any) {
    console.error('[Checkout] Order error:', err)
    orderError.value = err.message || (language.value === 'de' 
      ? 'Ein unerwarteter Fehler ist aufgetreten.'
      : 'An unexpected error occurred.')
  } finally {
    placingOrder.value = false
  }
}
</script>
