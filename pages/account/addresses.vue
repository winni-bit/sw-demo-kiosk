<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-semibold text-gray-900">
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
        <main class="lg:col-span-3">
          <div class="bg-white rounded-2xl p-6 shadow-sm">
            <h1 class="text-2xl font-semibold text-gray-900 mb-6">{{ t.title }}</h1>
            
            <!-- Loading State -->
            <div v-if="loading" class="grid md:grid-cols-2 gap-6">
              <div v-for="i in 2" :key="i" class="animate-pulse">
                <div class="h-48 bg-gray-100 rounded-xl" />
              </div>
            </div>
            
            <!-- No Addresses -->
            <div v-else-if="!hasAnyAddress" class="text-center py-12">
              <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t.noAddresses }}</h3>
              <p class="text-gray-500">{{ t.noAddressesDescription }}</p>
            </div>
            
            <!-- Addresses -->
            <div v-else class="space-y-6">
              <!-- Default Addresses -->
              <div class="grid md:grid-cols-2 gap-6">
                <!-- Default Billing Address -->
                <div class="p-5 bg-gray-50 rounded-xl">
                  <div class="flex items-center gap-2 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-900">{{ t.billingAddress }}</h2>
                  </div>
                  
                  <div v-if="defaultBillingAddress" class="space-y-1">
                    <p class="font-medium text-gray-900">
                      {{ defaultBillingAddress.firstName }} {{ defaultBillingAddress.lastName }}
                    </p>
                    <p v-if="defaultBillingAddress.company" class="text-gray-600">
                      {{ defaultBillingAddress.company }}
                    </p>
                    <p class="text-gray-600">{{ defaultBillingAddress.street }}</p>
                    <p class="text-gray-600">
                      {{ defaultBillingAddress.zipcode }} {{ defaultBillingAddress.city }}
                    </p>
                    <p v-if="defaultBillingAddress.countryState?.name" class="text-gray-600">
                      {{ defaultBillingAddress.countryState.name }}
                    </p>
                    <p class="text-gray-600">
                      {{ defaultBillingAddress.country?.name || '' }}
                    </p>
                    <p v-if="defaultBillingAddress.phoneNumber" class="text-gray-600 mt-2">
                      <span class="text-gray-500">{{ t.phone }}:</span> {{ defaultBillingAddress.phoneNumber }}
                    </p>
                  </div>
                  <p v-else class="text-gray-500">{{ t.noAddress }}</p>
                </div>
                
                <!-- Default Shipping Address -->
                <div class="p-5 bg-gray-50 rounded-xl">
                  <div class="flex items-center gap-2 mb-4">
                    <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 class="text-lg font-semibold text-gray-900">{{ t.shippingAddress }}</h2>
                  </div>
                  
                  <div v-if="defaultShippingAddress" class="space-y-1">
                    <p class="font-medium text-gray-900">
                      {{ defaultShippingAddress.firstName }} {{ defaultShippingAddress.lastName }}
                    </p>
                    <p v-if="defaultShippingAddress.company" class="text-gray-600">
                      {{ defaultShippingAddress.company }}
                    </p>
                    <p class="text-gray-600">{{ defaultShippingAddress.street }}</p>
                    <p class="text-gray-600">
                      {{ defaultShippingAddress.zipcode }} {{ defaultShippingAddress.city }}
                    </p>
                    <p v-if="defaultShippingAddress.countryState?.name" class="text-gray-600">
                      {{ defaultShippingAddress.countryState.name }}
                    </p>
                    <p class="text-gray-600">
                      {{ defaultShippingAddress.country?.name || '' }}
                    </p>
                    <p v-if="defaultShippingAddress.phoneNumber" class="text-gray-600 mt-2">
                      <span class="text-gray-500">{{ t.phone }}:</span> {{ defaultShippingAddress.phoneNumber }}
                    </p>
                  </div>
                  <p v-else class="text-gray-500">{{ t.noAddress }}</p>
                </div>
              </div>
              
              <!-- All Addresses (if more than the defaults) -->
              <div v-if="additionalAddresses.length > 0" class="mt-8">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ t.additionalAddresses }}</h2>
                
                <div class="grid md:grid-cols-2 gap-4">
                  <div 
                    v-for="address in additionalAddresses" 
                    :key="address.id"
                    class="p-4 bg-gray-50 rounded-xl"
                  >
                    <div class="space-y-1">
                      <p class="font-medium text-gray-900">
                        {{ address.firstName }} {{ address.lastName }}
                      </p>
                      <p v-if="address.company" class="text-gray-600">
                        {{ address.company }}
                      </p>
                      <p class="text-gray-600">{{ address.street }}</p>
                      <p class="text-gray-600">
                        {{ address.zipcode }} {{ address.city }}
                      </p>
                      <p v-if="address.countryState?.name" class="text-gray-600">
                        {{ address.countryState.name }}
                      </p>
                      <p class="text-gray-600">
                        {{ address.country?.name || '' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Info Message -->
            <div class="mt-6 p-4 bg-gray-50 rounded-xl">
              <p class="text-sm text-gray-500">
                {{ t.infoMessage }}
              </p>
            </div>
          </div>
        </main>
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

// Translations
const translations = {
  de: {
    title: 'Adressen',
    billingAddress: 'Rechnungsadresse',
    shippingAddress: 'Lieferadresse',
    noAddress: 'Keine Adresse hinterlegt',
    noAddresses: 'Keine Adressen',
    noAddressesDescription: 'Sie haben noch keine Adressen in Ihrem Konto gespeichert.',
    additionalAddresses: 'Weitere Adressen',
    phone: 'Tel.',
    infoMessage: 'Die Adressverwaltung ist derzeit nur über den Desktop-Shop verfügbar. Änderungen an Ihren Adressen können Sie dort vornehmen.',
  },
  en: {
    title: 'Addresses',
    billingAddress: 'Billing Address',
    shippingAddress: 'Shipping Address',
    noAddress: 'No address saved',
    noAddresses: 'No Addresses',
    noAddressesDescription: 'You have no addresses saved in your account yet.',
    additionalAddresses: 'Additional Addresses',
    phone: 'Phone',
    infoMessage: 'Address management is currently only available via the desktop shop. You can make changes to your addresses there.',
  },
}

const t = computed(() => translations[language.value])

// Get default billing address directly from customer
const defaultBillingAddress = computed((): ShopwareAddress | null => {
  return customer.value?.defaultBillingAddress || null
})

// Get default shipping address directly from customer
const defaultShippingAddress = computed((): ShopwareAddress | null => {
  return customer.value?.defaultShippingAddress || null
})

// Check if we have any address
const hasAnyAddress = computed(() => {
  return defaultBillingAddress.value || defaultShippingAddress.value || (customer.value?.addresses && customer.value.addresses.length > 0)
})

// Get additional addresses (excluding the default ones)
const additionalAddresses = computed((): ShopwareAddress[] => {
  if (!customer.value?.addresses) return []
  
  const defaultBillingId = customer.value.defaultBillingAddressId
  const defaultShippingId = customer.value.defaultShippingAddressId
  
  return customer.value.addresses.filter(addr => 
    addr.id !== defaultBillingId && addr.id !== defaultShippingId
  )
})

// Load customer data with addresses
onMounted(async () => {
  try {
    console.log('[Addresses] Loading customer data...')
    await fetchCustomer()
    
    console.log('[Addresses] Customer loaded:', customer.value?.email)
    console.log('[Addresses] Default billing address:', defaultBillingAddress.value?.street || 'none')
    console.log('[Addresses] Default shipping address:', defaultShippingAddress.value?.street || 'none')
    console.log('[Addresses] All addresses count:', customer.value?.addresses?.length || 0)
  } catch (err) {
    console.error('[Addresses] Failed to load:', err)
  } finally {
    loading.value = false
  }
})
</script>
