<template>
  <div class="space-y-1">
    <!-- Name -->
    <p class="font-medium text-white">
      {{ fullName }}
    </p>
    
    <!-- Company -->
    <p v-if="address.company" class="text-neutral-400">
      {{ address.company }}
    </p>
    
    <!-- Street -->
    <p class="text-neutral-400">
      {{ address.street }}
    </p>
    
    <!-- Additional Address Lines -->
    <p v-if="address.additionalAddressLine1" class="text-neutral-400">
      {{ address.additionalAddressLine1 }}
    </p>
    <p v-if="address.additionalAddressLine2" class="text-neutral-400">
      {{ address.additionalAddressLine2 }}
    </p>
    
    <!-- City & ZIP -->
    <p class="text-neutral-400">
      {{ address.zipcode }} {{ address.city }}
    </p>
    
    <!-- State -->
    <p v-if="stateName" class="text-neutral-400">
      {{ stateName }}
    </p>
    
    <!-- Country -->
    <p class="text-neutral-400">
      {{ countryName }}
    </p>
    
    <!-- Phone -->
    <p v-if="address.phoneNumber" class="text-neutral-400 mt-2">
      <span class="text-neutral-500">{{ t.phone }}:</span> {{ address.phoneNumber }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ShopwareAddress } from '~/types/shopware'

const props = defineProps<{
  address: ShopwareAddress
}>()

const { language } = useLanguage()

// Translations
const translations = {
  de: {
    phone: 'Tel.',
  },
  en: {
    phone: 'Phone',
  },
}

const t = computed(() => translations[language.value])

// Computed
const fullName = computed(() => {
  const salutation = props.address.salutation?.displayName || ''
  const firstName = props.address.firstName || ''
  const lastName = props.address.lastName || ''
  
  return [salutation, firstName, lastName].filter(Boolean).join(' ')
})

const countryName = computed(() => {
  return props.address.country?.name || ''
})

const stateName = computed(() => {
  return props.address.countryState?.name || ''
})
</script>
