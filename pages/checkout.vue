<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b-2 border-black">
      <div class="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-3xl font-bold text-black uppercase">
          KIOSK<span class="text-accent">.</span>
        </NuxtLink>
        <div class="flex items-center gap-4">
          <AccountDropdown />
          <KioskLanguageSwitch />
        </div>
      </div>
    </header>
    
    <div class="max-w-5xl mx-auto px-6 py-10">
      <!-- Back Link -->
      <NuxtLink 
        to="/" 
        class="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-wider text-black/50 hover:text-black transition-colors mb-8 py-3"
      >
        <span class="text-xl">←</span>
        {{ t.backToShop }}
      </NuxtLink>
      
      <!-- Page Title -->
      <h1 class="font-display text-5xl md:text-6xl font-bold text-black uppercase mb-10">{{ t.checkout }}</h1>
      
      <!-- Loading State -->
      <div v-if="initialLoading" class="flex items-center justify-center py-24">
        <div class="w-20 h-20 border-4 border-black border-t-accent animate-spin" />
      </div>
      
      <!-- Empty Cart -->
      <div v-else-if="isEmpty" class="border-2 border-black p-12 text-center">
        <div class="w-32 h-32 border-4 border-black/20 flex items-center justify-center mx-auto mb-8">
          <span class="font-display text-6xl text-black/20">∅</span>
        </div>
        <h2 class="font-display text-3xl font-bold text-black mb-4">{{ t.emptyCart }}</h2>
        <p class="font-sans text-lg text-black/50 mb-10">{{ t.emptyCartDescription }}</p>
        <KioskButton to="/" size="xl">
          {{ t.continueShopping }}
        </KioskButton>
      </div>
      
      <!-- Not Logged In -->
      <div v-else-if="!isLoggedIn" class="border-2 border-black p-12 text-center">
        <div class="w-32 h-32 border-4 border-black/20 flex items-center justify-center mx-auto mb-8">
          <span class="font-display text-6xl text-black/20">?</span>
        </div>
        <h2 class="font-display text-3xl font-bold text-black mb-4">{{ t.loginRequired }}</h2>
        <p class="font-sans text-lg text-black/50 mb-10">{{ t.loginRequiredDescription }}</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <KioskButton to="/account/login" size="xl">
            {{ t.login }}
          </KioskButton>
          <KioskButton to="/account/register" size="xl" variant="outline">
            {{ t.register }}
          </KioskButton>
        </div>
      </div>
      
      <!-- Checkout Content -->
      <div v-else class="space-y-10">
        <!-- Customer Info -->
        <div class="border-2 border-black p-6">
          <div class="flex items-center gap-5">
            <div class="w-20 h-20 bg-black text-white flex items-center justify-center flex-shrink-0">
              <span class="font-mono text-2xl font-bold">{{ customerInitials }}</span>
            </div>
            <div>
              <h2 class="font-display text-2xl font-bold text-black">{{ customerName }}</h2>
              <p class="font-mono text-base text-black/50 mt-1">{{ customer?.email }}</p>
            </div>
          </div>
        </div>
        
        <!-- Budget Info - Prominent Display -->
        <div class="border-2 border-accent bg-accent/5 p-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 bg-accent text-white flex items-center justify-center flex-shrink-0">
                <span class="font-mono text-xl">€</span>
              </div>
              <div>
                <h3 class="font-sans font-semibold text-accent text-xl">{{ t.yourBudget }}</h3>
                <p class="font-mono text-3xl font-bold text-accent mt-1">{{ formatPrice(customerBudget) }}</p>
              </div>
            </div>
            <div class="md:text-right">
              <p class="font-sans text-base text-accent/70">
                {{ t.budgetDeductionInfo }}
              </p>
              <p class="font-mono text-xl font-bold text-accent mt-1">
                -{{ formatPrice(budgetDeduction) }}
              </p>
              <p v-if="remainingAfterOrder > 0" class="font-mono text-sm text-accent/60 mt-1">
                {{ t.remainingBudget }}: {{ formatPrice(remainingAfterOrder) }}
              </p>
              <p v-else class="font-mono text-sm text-accent/60 mt-1">
                {{ t.budgetExhausted }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Products Grid (Kachel-Darstellung) -->
        <div class="border-2 border-black">
          <div class="px-6 py-5 border-b-2 border-black bg-gray-50">
            <h2 class="font-display text-2xl font-bold text-black uppercase">{{ t.orderItems }}</h2>
            <p class="font-mono text-sm text-black/50 mt-1">{{ itemCount }} {{ itemCount === 1 ? t.item : t.items }}</p>
          </div>
          
          <!-- Product Tiles Grid -->
          <div class="p-6">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="item in lineItems" 
                :key="item.id"
                class="border-2 border-black overflow-hidden"
              >
                <!-- Product Image -->
                <div class="aspect-square bg-gray-100 relative overflow-hidden">
                  <img 
                    v-if="item.cover?.url" 
                    :src="item.cover.url" 
                    :alt="item.label"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <span class="font-display text-4xl text-gray-300">?</span>
                  </div>
                  
                  <!-- Quantity Badge -->
                  <div 
                    v-if="item.quantity > 1" 
                    class="absolute top-3 right-3 bg-black text-white font-mono text-sm font-bold px-3 py-1.5"
                  >
                    {{ item.quantity }}×
                  </div>
                </div>
                
                <!-- Product Info -->
                <div class="p-4">
                  <h3 class="font-sans font-semibold text-black text-base leading-tight line-clamp-2 mb-2">
                    {{ item.label }}
                  </h3>
                  <p class="font-mono text-xl font-bold text-accent">
                    {{ formatPrice(item.price.totalPrice) }}
                  </p>
                  <p v-if="item.quantity > 1" class="font-mono text-xs text-black/50 mt-1">
                    {{ formatPrice(item.price.unitPrice) }} {{ t.each }}
                  </p>
                </div>
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
        
        <!-- Price Summary -->
        <div class="border-2 border-black p-6 space-y-5">
          <div class="flex justify-between font-sans text-lg text-black/60">
            <span>{{ t.subtotal }}</span>
            <span>{{ formatPrice(subtotal) }}</span>
          </div>
          
          <div class="flex justify-between font-sans text-lg text-black/60">
            <span>{{ t.pickup }}</span>
            <span class="text-accent font-semibold">{{ t.free }}</span>
          </div>
          
          <div class="flex justify-between font-sans text-lg text-black/60">
            <span>{{ t.tax }}</span>
            <span>{{ formatPrice(taxes) }}</span>
          </div>
          
          <!-- Budget Deduction -->
          <div class="flex justify-between font-sans text-lg text-accent">
            <span>{{ t.fromBudget }}</span>
            <span>-{{ formatPrice(budgetDeduction) }}</span>
          </div>
          
          <div class="border-t-2 border-black pt-5">
            <div class="flex justify-between items-center">
              <span class="font-display text-2xl font-bold text-black uppercase">{{ t.total }}</span>
              <span class="font-mono text-4xl font-bold text-accent">{{ formatPrice(totalPrice) }}</span>
            </div>
            <p v-if="budgetDeduction > 0" class="font-mono text-sm text-accent/60 mt-2 text-right">
              {{ t.paidFromBudget }}: {{ formatPrice(budgetDeduction) }}
            </p>
          </div>
        </div>
        
        <!-- Preparing Checkout Info -->
        <div v-if="preparingCheckout" class="p-5 bg-gray-50 border-2 border-black flex items-center gap-5">
          <div class="w-8 h-8 border-4 border-black border-t-accent animate-spin flex-shrink-0" />
          <span class="font-sans text-lg text-black/60">{{ t.preparingCheckout }}</span>
        </div>
        
        <!-- Error Message -->
        <div 
          v-if="orderError" 
          class="p-5 bg-accent/10 border-2 border-accent"
        >
          <div class="flex items-start gap-4">
            <svg class="w-7 h-7 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="font-sans font-semibold text-accent text-lg">{{ t.orderError }}</p>
              <p class="font-sans text-base text-accent/80 mt-1">{{ orderError }}</p>
            </div>
          </div>
        </div>
        
        <!-- Place Order Button -->
        <KioskButton
          size="xl"
          :loading="placingOrder"
          :disabled="preparingCheckout"
          full-width
          @click="submitOrder"
        >
          {{ placingOrder ? t.placingOrder : t.placeOrder }}
        </KioskButton>
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
const { isLoggedIn, customer, customerName, fetchCustomer, customerBudget, deductBudget, calculateBudgetDeduction } = useShopwareAuth()
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

// Calculate budget deduction (minimum of budget and total price)
const budgetDeduction = computed(() => {
  return calculateBudgetDeduction(totalPrice.value)
})

// Calculate remaining budget after order
const remainingAfterOrder = computed(() => {
  return Math.max(0, customerBudget.value - totalPrice.value)
})

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
    yourBudget: 'Ihr Budget',
    budgetDeductionInfo: 'Wird abgezogen',
    remainingBudget: 'Verbleibendes Budget',
    budgetExhausted: 'Budget wird aufgebraucht',
    orderItems: 'Ihre Bestellung',
    item: 'Artikel',
    items: 'Artikel',
    quantity: 'Menge',
    each: 'pro Stück',
    subtotal: 'Zwischensumme',
    pickup: 'Abholung am Kiosk',
    free: 'Kostenlos',
    tax: 'inkl. MwSt.',
    fromBudget: 'Von Budget',
    paidFromBudget: 'Bezahlt aus Budget',
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
    yourBudget: 'Your Budget',
    budgetDeductionInfo: 'Will be deducted',
    remainingBudget: 'Remaining budget',
    budgetExhausted: 'Budget will be exhausted',
    orderItems: 'Your Order',
    item: 'item',
    items: 'items',
    quantity: 'Quantity',
    each: 'each',
    subtotal: 'Subtotal',
    pickup: 'Kiosk Pickup',
    free: 'Free',
    tax: 'incl. VAT',
    fromBudget: 'From Budget',
    paidFromBudget: 'Paid from budget',
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
  
  await loadCartProductCategories()
  
  await getRecommendations(
    cartProductKeys.value,
    cartProductsWithCategories.value,
    2
  )
}

function handleCrossSellingAdd(product: any) {
  console.log('[Checkout] Cross-selling product added:', product.name)
}

onMounted(async () => {
  await nextTick()
  try {
    await fetchCart()
    
    if (isLoggedIn.value && !isEmpty.value) {
      preparingCheckout.value = true
      
      const checkoutResult = await prepareCheckout()
      if (!checkoutResult.success && checkoutResult.error) {
        console.warn('[Checkout] Preparation warning:', checkoutResult.error)
      }
      
      preparingCheckout.value = false
      
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
    console.log('[Checkout] Verifying customer login status before order...')
    const customerData = await fetchCustomer()
    
    if (!customerData || customerData.guest) {
      orderError.value = language.value === 'de'
        ? 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.'
        : 'Your session has expired. Please log in again.'
      return
    }
    
    // Store the budget deduction amount before placing order
    const deductionAmount = budgetDeduction.value
    
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
      console.log('[Checkout] Order placed successfully:', order.orderNumber)
      
      // Deduct budget after successful order
      if (deductionAmount > 0) {
        console.log('[Checkout] Deducting budget:', deductionAmount)
        const budgetUpdated = await deductBudget(deductionAmount)
        if (budgetUpdated) {
          console.log('[Checkout] Budget deducted successfully')
        } else {
          console.warn('[Checkout] Failed to deduct budget, but order was placed')
        }
      }
      
      const confirmationData = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        orderDateTime: order.orderDateTime,
        amountTotal: order.amountTotal,
        budgetDeducted: deductionAmount,
        items: orderData.items,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
      }
      
      sessionStorage.setItem('orderConfirmation', JSON.stringify(confirmationData))
      router.push('/order-confirmation')
    } else {
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
