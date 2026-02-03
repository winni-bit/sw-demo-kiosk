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
    
    <div class="max-w-4xl mx-auto px-6 py-10">
      <!-- No Order Data -->
      <div v-if="!orderData" class="border-2 border-black p-12 text-center">
        <div class="w-32 h-32 border-4 border-black/20 flex items-center justify-center mx-auto mb-8">
          <span class="font-display text-6xl text-black/20">?</span>
        </div>
        <h2 class="font-display text-3xl font-bold text-black mb-4">{{ t.noOrderData }}</h2>
        <p class="font-sans text-lg text-black/50 mb-10">{{ t.noOrderDataDescription }}</p>
        <KioskButton to="/" size="xl">
          {{ t.backToShop }}
        </KioskButton>
      </div>
      
      <!-- Order Confirmation -->
      <div v-else class="space-y-10">
        <!-- Success Header -->
        <div class="text-center py-10">
          <!-- Success Icon - Larger for Kiosk -->
          <div class="w-36 h-36 bg-accent text-white flex items-center justify-center mx-auto mb-10">
            <svg class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 class="font-display text-5xl md:text-6xl font-bold text-black uppercase mb-5">{{ t.orderConfirmed }}</h1>
          <p class="font-sans text-2xl text-black/60">{{ t.thankYou }}</p>
        </div>
        
        <!-- Order Number - Large and Prominent -->
        <div class="border-2 border-black p-10 text-center">
          <p class="font-mono text-sm uppercase tracking-wider text-black/50 mb-3">{{ t.orderNumber }}</p>
          <p class="font-mono text-5xl md:text-6xl font-bold text-black">{{ orderData.orderNumber }}</p>
          <p class="font-mono text-base text-black/40 mt-5">
            {{ t.orderedOn }} {{ formatDate(orderData.orderDateTime) }}
          </p>
        </div>
        
        <!-- Budget Deduction Info -->
        <div v-if="orderData.budgetDeducted && orderData.budgetDeducted > 0" class="border-2 border-accent bg-accent/5 p-8">
          <div class="flex items-center gap-5">
            <div class="w-16 h-16 bg-accent text-white flex items-center justify-center flex-shrink-0">
              <span class="font-mono text-2xl">€</span>
            </div>
            <div>
              <h3 class="font-sans font-semibold text-accent text-xl">{{ t.budgetDeducted }}</h3>
              <p class="font-mono text-3xl font-bold text-accent mt-1">-{{ formatPrice(orderData.budgetDeducted) }}</p>
              <p class="font-sans text-base text-accent/70 mt-2">{{ t.budgetDeductedDescription }}</p>
            </div>
          </div>
        </div>
        
        <!-- Pickup Info -->
        <div class="border-2 border-black bg-gray-50 p-8">
          <div class="flex items-start gap-5">
            <div class="w-16 h-16 bg-black text-white flex items-center justify-center flex-shrink-0">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-sans font-semibold text-black text-xl">{{ t.pickupReady }}</h3>
              <p class="font-sans text-lg text-black/70 mt-2">{{ t.pickupReadyDescription }}</p>
            </div>
          </div>
        </div>
        
        <!-- Order Items as Tiles -->
        <div class="border-2 border-black">
          <div class="px-6 py-5 border-b-2 border-black bg-gray-50">
            <h2 class="font-display text-2xl font-bold text-black uppercase">{{ t.orderItems }}</h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div 
                v-for="item in orderData.items" 
                :key="item.id"
                class="border-2 border-black overflow-hidden"
              >
                <!-- Product Image -->
                <div class="aspect-square bg-gray-100 relative overflow-hidden">
                  <img 
                    v-if="item.cover" 
                    :src="item.cover" 
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
                  <h3 class="font-sans font-medium text-black text-base leading-tight line-clamp-2 mb-2">
                    {{ item.label }}
                  </h3>
                  <p class="font-mono text-xl font-bold text-accent">
                    {{ formatPrice(item.price) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Total -->
          <div class="px-6 py-5 bg-gray-50 border-t-2 border-black">
            <div class="flex justify-between items-center">
              <span class="font-display text-2xl font-bold text-black uppercase">{{ t.total }}</span>
              <span class="font-mono text-4xl font-bold text-accent">{{ formatPrice(orderData.amountTotal) }}</span>
            </div>
            <p v-if="orderData.budgetDeducted && orderData.budgetDeducted > 0" class="font-mono text-sm text-accent/60 mt-2 text-right">
              {{ t.paidFromBudget }}: {{ formatPrice(orderData.budgetDeducted) }}
            </p>
          </div>
        </div>
        
        <!-- Customer Info -->
        <div class="border-2 border-black p-8">
          <h2 class="font-display text-xl font-bold text-black uppercase mb-5">{{ t.customer }}</h2>
          <div class="space-y-2">
            <p class="font-sans text-xl text-black">{{ orderData.customerName }}</p>
            <p class="font-mono text-base text-black/50">{{ orderData.customerEmail }}</p>
          </div>
        </div>
        
        <!-- Actions - Large Touch-Friendly Buttons -->
        <div class="grid sm:grid-cols-2 gap-4">
          <KioskButton to="/account/orders" size="xl" variant="outline" full-width>
            {{ t.viewOrders }}
          </KioskButton>
          <KioskButton to="/" size="xl" full-width>
            {{ t.continueShopping }}
          </KioskButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { language } = useLanguage()

interface OrderConfirmationData {
  orderId: string
  orderNumber: string
  orderDateTime: string
  amountTotal: number
  budgetDeducted?: number
  items: Array<{
    id: string
    label: string
    quantity: number
    price: number
    cover?: string
  }>
  customerName: string
  customerEmail: string
}

const orderData = ref<OrderConfirmationData | null>(null)

const translations = {
  de: {
    noOrderData: 'Keine Bestelldaten gefunden',
    noOrderDataDescription: 'Es wurden keine Bestelldaten gefunden.',
    backToShop: 'Zurück zum Shop',
    orderConfirmed: 'Bestellung Bestätigt',
    thankYou: 'Vielen Dank für Ihre Bestellung.',
    orderNumber: 'Bestellnummer',
    orderedOn: 'Bestellt am',
    budgetDeducted: 'Von Ihrem Budget abgezogen',
    budgetDeductedDescription: 'Der Betrag wurde von Ihrem verfügbaren Budget abgebucht.',
    pickupReady: 'Bereit zur Abholung',
    pickupReadyDescription: 'Ihre Bestellung wird jetzt vorbereitet und ist in Kürze am Kiosk zur Abholung bereit.',
    orderItems: 'Bestellte Artikel',
    quantity: 'Menge',
    total: 'Gesamtsumme',
    paidFromBudget: 'Bezahlt aus Budget',
    customer: 'Kunde',
    viewOrders: 'Meine Bestellungen',
    continueShopping: 'Weiter Einkaufen',
  },
  en: {
    noOrderData: 'No order data found',
    noOrderDataDescription: 'No order data was found.',
    backToShop: 'Back to Shop',
    orderConfirmed: 'Order Confirmed',
    thankYou: 'Thank you for your order.',
    orderNumber: 'Order Number',
    orderedOn: 'Ordered on',
    budgetDeducted: 'Deducted from your budget',
    budgetDeductedDescription: 'The amount has been deducted from your available budget.',
    pickupReady: 'Ready for Pickup',
    pickupReadyDescription: 'Your order is being prepared and will be ready for pickup at the kiosk shortly.',
    orderItems: 'Order Items',
    quantity: 'Qty',
    total: 'Total',
    paidFromBudget: 'Paid from budget',
    customer: 'Customer',
    viewOrders: 'My Orders',
    continueShopping: 'Continue Shopping',
  },
}

const t = computed(() => translations[language.value])

onMounted(() => {
  const storedData = sessionStorage.getItem('orderConfirmation')
  if (storedData) {
    try {
      orderData.value = JSON.parse(storedData)
      sessionStorage.removeItem('orderConfirmation')
    } catch (err) {
      console.error('[OrderConfirmation] Failed to parse order data:', err)
    }
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
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
</script>
