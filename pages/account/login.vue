<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="border-b border-black">
      <div class="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-black/50 hover:text-black transition-colors"
        >
          <span>←</span>
          {{ t.backToShop }}
        </NuxtLink>
        <KioskLanguageSwitch />
      </div>
    </header>
    
    <div class="flex-1 flex flex-col items-center justify-center p-6">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-12">
          <NuxtLink to="/" class="inline-block">
            <h1 class="font-display text-4xl font-bold text-black uppercase">
              KIOSK<span class="text-accent">.</span>
            </h1>
          </NuxtLink>
        </div>
        
        <!-- Title -->
        <div class="text-center mb-8">
          <h2 class="font-display text-3xl font-bold text-black uppercase">{{ t.title }}</h2>
          <p class="font-sans text-black/50 mt-2">{{ t.subtitle }}</p>
        </div>
        
        <!-- Login Form -->
        <div class="border border-black p-8">
          <AccountLoginForm @success="handleLoginSuccess" />
        </div>
        
        <!-- Register Link -->
        <div class="text-center mt-8">
          <p class="font-sans text-black/50">
            {{ t.noAccount }}
            <NuxtLink to="/account/register" class="text-accent hover:underline font-semibold">
              {{ t.registerNow }}
            </NuxtLink>
          </p>
        </div>
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

onMounted(async () => {
  await initAuth()
  
  if (isLoggedIn.value) {
    const redirect = route.query.redirect as string || '/account'
    router.push(redirect)
  }
})

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

function handleLoginSuccess() {
  const redirect = route.query.redirect as string || '/account'
  router.push(redirect)
}
</script>
