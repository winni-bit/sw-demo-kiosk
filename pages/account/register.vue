<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b-2 border-black">
      <div class="max-w-2xl mx-auto px-6 py-5 flex items-center justify-between">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-3 font-mono text-sm uppercase tracking-wider text-black/50 hover:text-black transition-colors py-2"
        >
          <span class="text-xl">←</span>
          {{ t.backToShop }}
        </NuxtLink>
        <KioskLanguageSwitch />
      </div>
    </header>
    
    <div class="max-w-2xl mx-auto px-6 py-10">
      <!-- Logo -->
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-block">
          <h1 class="font-display text-5xl font-bold text-black uppercase">
            KIOSK<span class="text-accent">.</span>
          </h1>
        </NuxtLink>
      </div>
      
      <!-- Title -->
      <div class="text-center mb-10">
        <h2 class="font-display text-4xl font-bold text-black uppercase">{{ t.title }}</h2>
        <p class="font-sans text-lg text-black/50 mt-3">{{ t.subtitle }}</p>
      </div>
      
      <!-- Register Form -->
      <div class="border-2 border-black p-8">
        <AccountRegisterForm @success="handleRegisterSuccess" />
      </div>
      
      <!-- Login Link -->
      <div class="text-center mt-10">
        <p class="font-sans text-lg text-black/50">
          {{ t.haveAccount }}
          <NuxtLink to="/account/login" class="text-accent hover:underline font-semibold ml-1">
            {{ t.loginNow }}
          </NuxtLink>
        </p>
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

onMounted(async () => {
  await initAuth()
  
  if (isLoggedIn.value) {
    router.push('/account')
  }
})

const translations = {
  de: {
    title: 'Konto Erstellen',
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

function handleRegisterSuccess() {
  router.push('/account')
}
</script>
