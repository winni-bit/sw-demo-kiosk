<template>
  <nav class="space-y-1">
    <NuxtLink
      to="/account"
      class="flex items-center gap-4 px-4 py-3 transition-all border-l-2"
      :class="[
        route.path === '/account'
          ? 'bg-black text-white border-accent' 
          : 'text-black hover:bg-black hover:text-white border-transparent'
      ]"
    >
      <span class="font-mono text-xs opacity-50">01</span>
      <span class="font-sans text-sm uppercase tracking-wider font-medium">{{ t.dashboard }}</span>
    </NuxtLink>
    
    <NuxtLink
      to="/account/orders"
      class="flex items-center gap-4 px-4 py-3 transition-all border-l-2"
      :class="[
        route.path.startsWith('/account/orders')
          ? 'bg-black text-white border-accent' 
          : 'text-black hover:bg-black hover:text-white border-transparent'
      ]"
    >
      <span class="font-mono text-xs opacity-50">02</span>
      <span class="font-sans text-sm uppercase tracking-wider font-medium">{{ t.orders }}</span>
    </NuxtLink>
    
    <NuxtLink
      to="/account/addresses"
      class="flex items-center gap-4 px-4 py-3 transition-all border-l-2"
      :class="[
        route.path === '/account/addresses'
          ? 'bg-black text-white border-accent' 
          : 'text-black hover:bg-black hover:text-white border-transparent'
      ]"
    >
      <span class="font-mono text-xs opacity-50">03</span>
      <span class="font-sans text-sm uppercase tracking-wider font-medium">{{ t.addresses }}</span>
    </NuxtLink>
    
    <!-- Divider -->
    <div class="h-px bg-black/10 my-4" />
    
    <!-- Logout Button -->
    <button
      @click="handleLogout"
      :disabled="loading"
      class="w-full flex items-center gap-4 px-4 py-3 text-accent hover:bg-accent hover:text-white transition-all border-l-2 border-transparent"
    >
      <span class="font-mono text-xs opacity-50">→</span>
      <span class="font-sans text-sm uppercase tracking-wider font-medium">{{ t.logout }}</span>
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

async function handleLogout() {
  await logout()
  router.push('/')
}
</script>
