<template>
  <nav class="space-y-2">
    <NuxtLink
      to="/account"
      class="flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-lg"
      :class="[
        route.path === '/account'
          ? 'bg-white text-neutral-900 font-semibold' 
          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
      ]"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      <span>{{ t.dashboard }}</span>
    </NuxtLink>
    
    <NuxtLink
      to="/account/orders"
      class="flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-lg"
      :class="[
        route.path.startsWith('/account/orders')
          ? 'bg-white text-neutral-900 font-semibold' 
          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
      ]"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <span>{{ t.orders }}</span>
    </NuxtLink>
    
    <NuxtLink
      to="/account/addresses"
      class="flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-lg"
      :class="[
        route.path === '/account/addresses'
          ? 'bg-white text-neutral-900 font-semibold' 
          : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
      ]"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>{{ t.addresses }}</span>
    </NuxtLink>
    
    <!-- Logout Button -->
    <button
      @click="handleLogout"
      :disabled="loading"
      class="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
    >
      <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>{{ t.logout }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { logout, loading } = useShopwareAuth()
const { language } = useLanguage()

// Translations
const translations = {
  de: {
    dashboard: 'Übersicht',
    orders: 'Bestellungen',
    addresses: 'Adressen',
    logout: 'Abmelden',
  },
  en: {
    dashboard: 'Dashboard',
    orders: 'Orders',
    addresses: 'Addresses',
    logout: 'Sign Out',
  },
}

const t = computed(() => translations[language.value])

// Handle logout
async function handleLogout() {
  await logout()
  router.push('/')
}
</script>
