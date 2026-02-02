<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-black">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-2xl font-bold text-black uppercase">
          KIOSK<span class="text-accent">.</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <AccountDropdown />
          <KioskLanguageSwitch />
        </div>
      </div>
    </header>
    
    <div class="max-w-4xl mx-auto px-6 py-12">
      <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-8"
      >
        <span>←</span>
        {{ t.backToShop }}
      </NuxtLink>
      
      <!-- Page Title -->
      <h1 class="font-display text-5xl md:text-6xl font-bold text-black uppercase mb-12">{{ t.checkout }}</h1>
      
      <!-- Loading State -->
      <div v-if="initialLoading" class="flex items-center justify-center py-20">
        <div class="w-16 h-16 border-2 border-black border-t-accent animate-spin" />
      </div>
      
      <!-- Empty Cart -->
      <div v-else-if="isEmpty" class="border border-black p-12 text-center">
        <div class="w-24 h-24 border-2 border-black/20 flex items-center justify-center mx-auto mb-6">
          <span class="font-display text-4xl text-black/20">∅</span>
        </div>
        <h2 class="font-display text-2xl font-bold text-black mb-4">{{ t.emptyCart }}</h2>
        <p class="font-sans text-black/50 mb-8">{{ t.emptyCartDescription }}</p>
        <NuxtLink 
          to="/" 
          class="inline-block px-8 py-4 bg-black text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
        >
          {{ t.continueShopping }}
        </NuxtLink>
      </div>
      
      <!-- Not Logged In -->
      <div v-else-if="!isLoggedIn" class="border border-black p-12 text-center">
        <div class="w-24 h-24 border-2 border-black/20 flex items-center justify-center mx-auto mb-6">
          <span class="font-display text-4xl text-black/20">?</span>
        </div>
        <h2 class="font-display text-2xl font-bold text-black mb-4">{{ t.loginRequired }}</h2>
        <p class="font-sans text-black/50 mb-8">{{ t.loginRequiredDescription }}</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink 
            to="/account/login" 
            class="px-8 py-4 bg-black text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent transition-colors"
          >
            {{ t.login }}
          </NuxtLink>
          <NuxtLink 
            to="/account/register" 
            class="px-8 py-4 border border-black text-black font-sans font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            {{ t.register }}
          </NuxtLink>
        </div>
      </div>
      
      <!-- Checkout Content -->
      <div v-else class="space-y-8">
        <!-- Customer Info -->
        <div class="border border-black p-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-black text-white flex items-center justify-center">
              <span class="font-mono text-xl font-bold">{{ customerInitials }}</span>
            </div>
            <div>
              <h2 class="font-display text-xl font-bold text-black">{{ customerName }}</h2>
              <p class="font-mono text-sm text-black/50">{{ customer?.email }}</p>
            </div>
          </div>
        </div>
        
        <!-- Products List -->
        <div class="border border-black">
          <div class="px-6 py-4 border-b border-black bg-gray-50">
            <h2 class="font-display text-xl font-bold text-black uppercase">{{ t.orderItems }}</h2>
            <p class="font-mono text-xs text-black/50 mt-1">{{ itemCount }} {{ itemCount === 1 ? t.item : t.items }}</p>
          </div>
          
          <div class="divide-y divide-black/10">
            <div 
              v-for="item in lineItems" 
              :key="item.id"
              class="px-6 py-5 flex items-center gap-5"
            >
              <!-- Product Image -->
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
              
              <!-- Product Info -->
              <div class="flex-1 min-w-0">
                <h3 class="font-sans font-semibold text-black truncate">{{ item.label }}</h3>
                <p class="font-mono text-xs text-black/50 mt-1">{{ t.quantity }}: {{ item.quantity }}</p>
              </div>
              
              <!-- Price -->
              <div class="text-right flex-shrink-0">
                <p class="font-mono text-xl font-bold text-accent">{{ formatPrice(item.price.totalPrice) }}</p>
                <p v-if="item.quantity > 1" class="font-mono text-xs text-black/50">
                  {{ formatPrice(item.price.unitPrice) }} {{ t.each }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cross-Selling Section -->
        <CheckoutCrossSelling
          :recommendations="crossSellingRecommendations"
          :loading="crossSellingLoading"
          @add-to-cart="handleCrossSellingAdd"
        />
        
        <!-- Budget Info -->
        <div class="border border-accent bg-accent/5 p-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-accent text-white flex items-center justify-center flex-shrink-0">
              <span class="font-mono text-lg">€</span>
            </div>
            <div>
              <h3 class="font-sans font-semibold text-accent">{{ t.budgetPayment }}</h3>
              <p class="font-sans text-sm text-accent/70 mt-1">{{ t.budgetPaymentDescription }}</p>
            </div>
          </div>
        </div>
        
        <!-- Price Summary -->
        <div class="border border-black p-6 space-y-4">
          <div class="flex justify-between font-sans text-black/60">
            <span>{{ t.subtotal }}</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          
          <div class="flex justify-between font-sans text-black/60">
            <span>{{ t.pickup }}</span>
            <span class="text-accent font-semibold">{{ t.free }}</span>
          </div>
          
          <div class="flex justify-between font-sans text-black/60">
            <span>{{ t.tax }}</span>
            <span>{{ formatPrice(taxes) }}</span>
          </div>
          
          <div class="border-t border-black pt-4">
            <div class="flex justify-between items-center">
              <span class="font-display text-xl font-bold text-black uppercase">{{ t.total }}</span>
              <span class="font-mono text-3xl font-bold text-accent">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Preparing Checkout Info -->
        <div v-if="preparingCheckout" class="p-4 bg-gray-50 border border-black flex items-center gap-4">
          <div class="w-6 h-6 border-2 border-black border-t-accent animate-spin flex-shrink-0" />
          <span class="font-sans text-black/60">{{ t.preparingCheckout }}</span>
        </div>
        
        <!-- Error Message -->
        <div 
          v-if="orderError" 
          class="p-4 bg-accent/10 border border-accent"
        >
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="font-sans font-semibold text-accent">{{ t.orderError }}</p>
              <p class="font-sans text-sm text-accent/80 mt-1">{{ orderError }}</p>
            </div>
          </div>
        </div>
        
        <!-- Place Order Button -->
        <button
          @click="submitOrder"
          :disabled="placingOrder || preparingCheckout"
          class="w-full py-5 px-6 bg-black text-white font-sans font-semibold text-xl uppercase tracking-widest hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4"
        >
          <svg 
            v-if="placingOrder" 
            class="w-6 h-6 animate-spin" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ placingOrder ? t.placingOrder : t.placeOrder }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import client from '../.frontstack/generated-client'

definePageMeta({
  layout: false,
})

const router = useRouter()
const { language, getContextKey } = useLanguage()
const { isLoggedIn, customer, customerName, fetchCustomer } = useShopwareAuth()
const { 
  isEmpty, 
  lineItems,
  itemCount,
  subtotal,
  totalPrice,
  taxes,
  fetchCart, 
  placeOrder,
  prepareCheckout,
  formatPrice,
  error: cartError,
} = useShopwareCart()
const { 
  recommendations: crossSellingRecommendations, 
  loading: crossSellingLoading, 
  getRecommendations 
} = useCrossSelling()

const initialLoading = ref(true)
const placingOrder = ref(false)
const preparingCheckout = ref(false)
const orderError = ref<string | null>(null)

const translations = {
  de: {
    checkout: 'Kasse',
    backToShop: 'Zurück zum Shop',
    emptyCart: 'Warenkorb ist leer',
    emptyCartDescription: 'Fügen Sie Produkte hinzu, um zur Kasse zu gehen.',
    continueShopping: 'Weiter Einkaufen',
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
    placeOrder: 'Jetzt Bestellen',
    placingOrder: 'Bestellung wird aufgegeben...',
    preparingCheckout: 'Checkout wird vorbereitet...',
    orderError: 'Bestellung fehlgeschlagen',
  },
  en: {
    checkout: 'Checkout',
    backToShop: 'Back to Shop',
    emptyCart: 'Cart is empty',
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
    preparingCheckout: 'Preparing checkout...',
    orderError: 'Order failed',
  },
}

const t = computed(() => translations[language.value])

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

// Extrahiere Produkt-Keys aus dem Warenkorb für Cross-Selling
const cartProductKeys = computed(() => {
  return lineItems.value.map(item => item.referencedId || item.id)
})

// Extrahiere Kategorie-Informationen für Cross-Selling
// Da wir die categoryIds nicht direkt im Warenkorb haben, 
// müssen wir sie aus Frontstack laden
const cartProductsWithCategories = ref<{ categoryIds?: string[] }[]>([])

async function loadCartProductCategories() {
  if (lineItems.value.length === 0) return
  
  const contextKey = getContextKey()
  const products: { categoryIds?: string[] }[] = []
  
  for (const item of lineItems.value) {
    try {
      const productKey = item.referencedId || item.id
      const product = await client.block('ProductCard', productKey, { contextKey })
      if (product) {
        products.push({ categoryIds: product.categoryIds || [] })
      }
    } catch (err) {
      console.warn('[Checkout] Failed to load product categories for:', item.label)
    }
  }
  
  cartProductsWithCategories.value = products
}

async function loadCrossSellingRecommendations() {
  if (!isLoggedIn.value || isEmpty.value) return
  
  // Lade Kategorie-Informationen für Warenkorb-Produkte
  await loadCartProductCategories()
  
  // Hole Cross-Selling Empfehlungen
  await getRecommendations(
    cartProductKeys.value,
    cartProductsWithCategories.value,
    2 // Maximal 2 Empfehlungen
  )
}

function handleCrossSellingAdd(product: any) {
  console.log('[Checkout] Cross-selling product added:', product.name)
  // Der Warenkorb wird automatisch in der Komponente aktualisiert
}

onMounted(async () => {
  await nextTick()
  try {
    // 1. Zuerst Warenkorb laden
    await fetchCart()
    
    // 2. Prüfen ob eingeloggt und Warenkorb nicht leer
    if (isLoggedIn.value && !isEmpty.value) {
      preparingCheckout.value = true
      
      // 3. Checkout vorbereiten (Versand-/Zahlungsmethoden)
      const checkoutResult = await prepareCheckout()
      if (!checkoutResult.success && checkoutResult.error) {
        console.warn('[Checkout] Preparation warning:', checkoutResult.error)
      }
      
      preparingCheckout.value = false
      
      // 4. Cross-Selling NACH dem Checkout-Prepare laden (um Token-Probleme zu vermeiden)
      // Dies läuft im Hintergrund und blockiert nicht die Seite
      loadCrossSellingRecommendations().catch(err => {
        console.warn('[Checkout] Cross-selling load failed (non-critical):', err)
      })
    }
  } catch (err) {
    console.error('[Checkout] Init error:', err)
  } finally {
    initialLoading.value = false
  }
})

async function submitOrder() {
  placingOrder.value = true
  orderError.value = null
  
  try {
    // Vor dem Bestellen nochmal den Kunden-Status prüfen
    console.log('[Checkout] Verifying customer login status before order...')
    const customerData = await fetchCustomer()
    
    if (!customerData || customerData.guest) {
      orderError.value = language.value === 'de'
        ? 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
        : 'Your session has expired. Please log in again.'
      return
    }
    
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
      // Use the error from the cart composable
      orderError.value = cartError.value || (language.value === 'de' 
        ? 'Fehler beim Aufgeben der Bestellung. Bitte versuchen Sie es erneut.'
        : 'Failed to place order. Please try again.')
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
