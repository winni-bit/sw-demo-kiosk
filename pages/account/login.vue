<template>
  <div class="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Fixed Header with Back Button -->
      <div class="flex items-center justify-between mb-8">
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span class="font-medium">{{ t.backToShop }}</span>
        </NuxtLink>
        
        <!-- Language Switch -->
        <KioskLanguageSwitch />
      </div>
      
      <!-- Header -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block mb-6">
          <h1 class="text-2xl font-bold text-white">Kiosk Shop</h1>
        </NuxtLink>
        <h2 class="text-xl font-semibold text-white mb-2">{{ t.title }}</h2>
        <p class="text-neutral-400">{{ t.subtitle }}</p>
      </div>
      
      <!-- Login Form Card -->
      <div class="bg-neutral-900 rounded-2xl p-6 sm:p-8">
        <AccountLoginForm @success="handleLoginSuccess" />
      </div>
      
      <!-- Register Link -->
      <div class="text-center mt-6">
        <p class="text-neutral-400">
          {{ t.noAccount }}
          <NuxtLink to="/account/register" class="text-white hover:underline font-medium">
            {{ t.registerNow }}
          </NuxtLink>
        </p>
      </div>
      
      <!-- Back to Shop (Bottom) -->
      <div class="text-center mt-8">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 rounded-xl font-semibold hover:bg-neutral-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ t.backToShop }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const router = useRouter()
const { language } = useLanguage()
const { initAuth, isLoggedIn } = useShopwareAuth()

// Initialize auth
onMounted(async () => {
  await initAuth()
  
  // Redirect if already logged in
  if (isLoggedIn.value) {
    const redirect = route.query.redirect as string || '/account'
    router.push(redirect)
  }
})

// Translations
const translations = {
  de: {
    title: 'Anmelden',
    subtitle: 'Melden Sie sich bei Ihrem Konto an',
    backToShop: 'Zurück zum Shop',
    noAccount: 'Noch kein Konto?',
    registerNow: 'Jetzt registrieren',
  },
  en: {
    title: 'Sign In',
    subtitle: 'Sign in to your account',
    backToShop: 'Back to Shop',
    noAccount: "Don't have an account?",
    registerNow: 'Register now',
  },
}

const t = computed(() => translations[language.value])

// Handle successful login
function handleLoginSuccess() {
  const redirect = route.query.redirect as string || '/account'
  router.push(redirect)
}
</script>
