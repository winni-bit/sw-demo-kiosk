<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <header class="border-b-2 border-black">
      <div class="max-w-xl mx-auto px-6 py-5 flex items-center justify-between">
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
    
    <div class="flex-1 flex flex-col items-center justify-center p-6">
      <div class="w-full max-w-xl">
        <!-- Logo -->
        <div class="text-center mb-12">
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
        
        <!-- Login Form -->
        <div class="border-2 border-black p-8">
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Error Message -->
            <div 
              v-if="error" 
              class="p-5 bg-accent/10 border-2 border-accent text-accent text-base"
            >
              {{ error }}
            </div>
            
            <!-- Email -->
            <KioskInput
              v-model="form.email"
              type="email"
              :label="t.email"
              :placeholder="t.emailPlaceholder"
              required
              autocomplete="email"
              inputmode="email"
              size="xl"
              :disabled="loading"
            />
            
            <!-- Password -->
            <KioskInput
              v-model="form.password"
              type="password"
              :label="t.password"
              :placeholder="t.passwordPlaceholder"
              required
              autocomplete="current-password"
              size="xl"
              :disabled="loading"
            />
            
            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-3 cursor-pointer touch-manipulation py-2">
                <input
                  v-model="form.rememberMe"
                  type="checkbox"
                  class="w-6 h-6 border-2 border-black bg-white text-black focus:ring-0 focus:ring-offset-0"
                />
                <span class="font-sans text-base text-black/60">{{ t.rememberMe }}</span>
              </label>
              
              <NuxtLink 
                to="/account/forgot-password" 
                class="font-mono text-sm uppercase tracking-wider text-black/50 hover:text-accent transition-colors py-2"
              >
                {{ t.forgotPassword }}
              </NuxtLink>
            </div>
            
            <!-- Submit Button -->
            <KioskButton
              type="submit"
              size="xl"
              full-width
              :loading="loading"
              :disabled="!isFormValid"
            >
              {{ loading ? t.loggingIn : t.login }}
            </KioskButton>
          </form>
        </div>
        
        <!-- Register Link -->
        <div class="text-center mt-10">
          <p class="font-sans text-lg text-black/50">
            {{ t.noAccount }}
            <NuxtLink to="/account/register" class="text-accent hover:underline font-semibold ml-1">
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
const { initAuth, isLoggedIn, login, loading, error, clearError } = useShopwareAuth()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

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
    email: 'E-Mail',
    emailPlaceholder: 'ihre@email.de',
    password: 'Passwort',
    passwordPlaceholder: 'Ihr Passwort',
    rememberMe: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    login: 'Anmelden',
    loggingIn: 'Wird angemeldet...',
    noAccount: 'Noch kein Konto?',
    registerNow: 'Jetzt registrieren',
  },
  en: {
    title: 'Sign In',
    subtitle: 'Sign in to your account',
    backToShop: 'Back to Shop',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    login: 'Sign In',
    loggingIn: 'Signing in...',
    noAccount: "Don't have an account?",
    registerNow: 'Register now',
  },
}

const t = computed(() => translations[language.value])

const isFormValid = computed(() => {
  return form.email.trim() !== '' && form.password.trim() !== ''
})

async function handleSubmit() {
  if (!isFormValid.value) return
  
  clearError()
  
  const success = await login(form.email, form.password)
  
  if (success) {
    const redirect = route.query.redirect as string || '/account'
    router.push(redirect)
  }
}

watch(() => [form.email, form.password], () => {
  if (error.value) {
    clearError()
  }
})
</script>
