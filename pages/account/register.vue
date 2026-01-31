<template>
  <div class="min-h-screen bg-gray-50 py-8 px-6">
    <div class="w-full max-w-lg mx-auto">
      <!-- Fixed Header with Back Button -->
      <div class="flex items-center justify-between mb-8">
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 px-5 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl transition-colors shadow-sm"
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
          <h1 class="text-2xl font-semibold text-gray-900">Kiosk Shop</h1>
        </NuxtLink>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ t.title }}</h2>
        <p class="text-gray-500">{{ t.subtitle }}</p>
      </div>
      
      <!-- Register Form Card -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <AccountRegisterForm @success="handleRegisterSuccess" />
      </div>
      
      <!-- Login Link -->
      <div class="text-center mt-6">
        <p class="text-gray-500">
          {{ t.haveAccount }}
          <NuxtLink to="/account/login" class="text-gray-900 hover:underline font-medium">
            {{ t.loginNow }}
          </NuxtLink>
        </p>
      </div>
      
      <!-- Back to Shop (Bottom) -->
      <div class="text-center mt-8">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
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

const router = useRouter()
const { language } = useLanguage()
const { initAuth, isLoggedIn } = useShopwareAuth()

// Initialize auth
onMounted(async () => {
  await initAuth()
  
  // Redirect if already logged in
  if (isLoggedIn.value) {
    router.push('/account')
  }
})

// Translations
const translations = {
  de: {
    title: 'Konto erstellen',
    subtitle: 'Registrieren Sie sich für ein neues Konto',
    backToShop: 'Zurück zum Shop',
    haveAccount: 'Bereits ein Konto?',
    loginNow: 'Jetzt anmelden',
  },
  en: {
    title: 'Create Account',
    subtitle: 'Register for a new account',
    backToShop: 'Back to Shop',
    haveAccount: 'Already have an account?',
    loginNow: 'Sign in now',
  },
}

const t = computed(() => translations[language.value])

// Handle successful registration
function handleRegisterSuccess() {
  router.push('/account')
}
</script>
