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
        <div class="px-6 py-5 border-b-2 border-black">
          <h1 class="font-display text-3xl font-bold text-black uppercase">{{ t.title }}</h1>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="p-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div v-for="i in 2" :key="i" class="h-56 bg-gray-100 animate-pulse" />
          </div>
        </div>
        
        <!-- No Addresses -->
        <div v-else-if="!hasAnyAddress" class="text-center py-20 px-6">
          <div class="w-24 h-24 border-4 border-black/20 flex items-center justify-center mx-auto mb-8">
            <span class="font-display text-5xl text-black/20">∅</span>
          </div>
          <h3 class="font-display text-3xl font-bold text-black uppercase mb-4">{{ t.noAddresses }}</h3>
          <p class="font-sans text-lg text-black/50">{{ t.noAddressesDescription }}</p>
        </div>
        
        <!-- Addresses as Tiles -->
        <div v-else class="p-6 space-y-8">
          <!-- Default Addresses -->
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Default Billing Address -->
            <div class="border-2 border-black p-6">
              <div class="flex items-center gap-4 mb-5">
                <span class="font-mono text-sm text-black/40">01</span>
                <h2 class="font-display text-xl font-bold text-black uppercase">{{ t.billingAddress }}</h2>
              </div>
              
              <div v-if="defaultBillingAddress" class="space-y-2 font-sans text-lg text-black">
                <p class="font-semibold text-xl">
                  {{ defaultBillingAddress.firstName }} {{ defaultBillingAddress.lastName }}
                </p>
                <p v-if="defaultBillingAddress.company" class="text-black/70">
                  {{ defaultBillingAddress.company }}
                </p>
                <p class="text-black/70">{{ defaultBillingAddress.street }}</p>
                <p class="text-black/70">
                  {{ defaultBillingAddress.zipcode }} {{ defaultBillingAddress.city }}
                </p>
                <p v-if="defaultBillingAddress.countryState?.name" class="text-black/70">
                  {{ defaultBillingAddress.countryState.name }}
                </p>
                <p class="text-black/70">
                  {{ defaultBillingAddress.country?.name || '' }}
                </p>
                <p v-if="defaultBillingAddress.phoneNumber" class="text-black/50 mt-3 font-mono text-base">
                  {{ t.phone }}: {{ defaultBillingAddress.phoneNumber }}
                </p>
              </div>
              <p v-else class="font-sans text-lg text-black/40">{{ t.noAddress }}</p>
            </div>
            
            <!-- Default Shipping Address -->
            <div class="border-2 border-black p-6">
              <div class="flex items-center gap-4 mb-5">
                <span class="font-mono text-sm text-black/40">02</span>
                <h2 class="font-display text-xl font-bold text-black uppercase">{{ t.shippingAddress }}</h2>
              </div>
              
              <div v-if="defaultShippingAddress" class="space-y-2 font-sans text-lg text-black">
                <p class="font-semibold text-xl">
                  {{ defaultShippingAddress.firstName }} {{ defaultShippingAddress.lastName }}
                </p>
                <p v-if="defaultShippingAddress.company" class="text-black/70">
                  {{ defaultShippingAddress.company }}
                </p>
                <p class="text-black/70">{{ defaultShippingAddress.street }}</p>
                <p class="text-black/70">
                  {{ defaultShippingAddress.zipcode }} {{ defaultShippingAddress.city }}
                </p>
                <p v-if="defaultShippingAddress.countryState?.name" class="text-black/70">
                  {{ defaultShippingAddress.countryState.name }}
                </p>
                <p class="text-black/70">
                  {{ defaultShippingAddress.country?.name || '' }}
                </p>
                <p v-if="defaultShippingAddress.phoneNumber" class="text-black/50 mt-3 font-mono text-base">
                  {{ t.phone }}: {{ defaultShippingAddress.phoneNumber }}
                </p>
              </div>
              <p v-else class="font-sans text-lg text-black/40">{{ t.noAddress }}</p>
            </div>
          </div>
          
          <!-- All Addresses (if more than the defaults) -->
          <div v-if="additionalAddresses.length > 0">
            <h2 class="font-display text-xl font-bold text-black uppercase mb-5">{{ t.additionalAddresses }}</h2>
            
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(address, index) in additionalAddresses" 
                :key="address.id"
                class="border-2 border-black/50 p-5"
              >
                <span class="font-mono text-sm text-black/40 mb-3 block">{{ String(index + 3).padStart(2, '0') }}</span>
                <div class="space-y-1 font-sans text-base text-black/80">
                  <p class="font-semibold text-lg">
                    {{ address.firstName }} {{ address.lastName }}
                  </p>
                  <p v-if="address.company">
                    {{ address.company }}
                  </p>
                  <p>{{ address.street }}</p>
                  <p>
                    {{ address.zipcode }} {{ address.city }}
                  </p>
                  <p v-if="address.countryState?.name">
                    {{ address.countryState.name }}
                  </p>
                  <p>
                    {{ address.country?.name || '' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Info Message -->
          <div class="border-2 border-black/20 bg-gray-50 p-5">
            <p class="font-mono text-sm text-black/50 uppercase tracking-wider">
              {{ t.infoMessage }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Back Button -->
      <div class="mt-10">
        <KioskButton to="/account" variant="outline" size="lg" full-width>
          {{ t.backToAccount }}
        </KioskButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopwareAddress } from '~/types/shopware'

definePageMeta({
  middleware: 'auth',
  layout: false,
})

const { customer, fetchCustomer } = useShopwareAuth()
const { language } = useLanguage()

const loading = ref(true)

const translations = {
  de: {
    title: 'Adressen',
    backToAccount: 'Zurück zum Konto',
    billingAddress: 'Rechnungsadresse',
    shippingAddress: 'Lieferadresse',
    noAddress: 'Keine Adresse hinterlegt',
    noAddresses: 'Keine Adressen',
    noAddressesDescription: 'Sie haben noch keine Adressen gespeichert.',
    additionalAddresses: 'Weitere Adressen',
    phone: 'Tel.',
    infoMessage: 'Die Adressverwaltung ist derzeit nur über den Desktop-Shop verfügbar.',
  },
  en: {
    title: 'Addresses',
    backToAccount: 'Back to Account',
    billingAddress: 'Billing Address',
    shippingAddress: 'Shipping Address',
    noAddress: 'No address saved',
    noAddresses: 'No Addresses',
    noAddressesDescription: 'You have no addresses saved yet.',
    additionalAddresses: 'Additional Addresses',
    phone: 'Phone',
    infoMessage: 'Address management is currently only available via the desktop shop.',
  },
}

const t = computed(() => translations[language.value])

const defaultBillingAddress = computed((): ShopwareAddress | null => {
  return customer.value?.defaultBillingAddress || null
})

const defaultShippingAddress = computed((): ShopwareAddress | null => {
  return customer.value?.defaultShippingAddress || null
})

const hasAnyAddress = computed(() => {
  return defaultBillingAddress.value || defaultShippingAddress.value || (customer.value?.addresses && customer.value.addresses.length > 0)
})

const additionalAddresses = computed((): ShopwareAddress[] => {
  if (!customer.value?.addresses) return []
  
  const defaultBillingId = customer.value.defaultBillingAddressId
  const defaultShippingId = customer.value.defaultShippingAddressId
  
  return customer.value.addresses.filter(addr => 
    addr.id !== defaultBillingId && addr.id !== defaultShippingId
  )
})

onMounted(async () => {
  try {
    await fetchCustomer()
  } catch (err) {
    console.error('[Addresses] Failed to load:', err)
  } finally {
    loading.value = false
  }
})
</script>
