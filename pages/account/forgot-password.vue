<template>
  <div class="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block mb-6">
          <h1 class="text-2xl font-bold text-white">Kiosk Shop</h1>
        </NuxtLink>
        <h2 class="text-xl font-semibold text-white mb-2">{{ t.title }}</h2>
        <p class="text-neutral-400">{{ t.subtitle }}</p>
      </div>
      
      <!-- Form Card -->
      <div class="bg-neutral-900 rounded-2xl p-6 sm:p-8">
        <!-- Success Message -->
        <div 
          v-if="success" 
          class="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm mb-6"
        >
          {{ t.successMessage }}
        </div>
        
        <!-- Error Message -->
        <div 
          v-if="error" 
          class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6"
        >
          {{ error }}
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-neutral-300 mb-2">
              {{ t.email }} *
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              :placeholder="t.emailPlaceholder"
              class="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
              :disabled="loading || success"
            />
          </div>
          
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || success || !email"
            class="w-full py-4 px-6 bg-white text-neutral-900 rounded-xl font-semibold text-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <svg 
              v-if="loading" 
              class="w-5 h-5 animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ loading ? t.sending : t.submit }}
          </button>
        </form>
        
        <!-- Back to Login -->
        <p class="text-center text-neutral-400 text-sm mt-6">
          <NuxtLink to="/account/login" class="text-white hover:underline">
            {{ t.backToLogin }}
          </NuxtLink>
        </p>
      </div>
      
      <!-- Back to Shop -->
      <div class="text-center mt-6">
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

const { language } = useLanguage()

// State
const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

// Translations
const translations = {
  de: {
    title: 'Passwort vergessen',
    subtitle: 'Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurückzusetzen.',
    email: 'E-Mail-Adresse',
    emailPlaceholder: 'ihre@email.de',
    submit: 'Link senden',
    sending: 'Wird gesendet...',
    successMessage: 'Falls ein Konto mit dieser E-Mail existiert, erhalten Sie in Kürze eine E-Mail mit weiteren Anweisungen.',
    backToLogin: 'Zurück zur Anmeldung',
    backToShop: 'Zurück zum Shop',
    errorGeneric: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
  },
  en: {
    title: 'Forgot Password',
    subtitle: 'Enter your email address to reset your password.',
    email: 'Email Address',
    emailPlaceholder: 'your@email.com',
    submit: 'Send Reset Link',
    sending: 'Sending...',
    successMessage: 'If an account with this email exists, you will receive an email with further instructions shortly.',
    backToLogin: 'Back to Sign In',
    backToShop: 'Back to Shop',
    errorGeneric: 'An error occurred. Please try again.',
  },
}

const t = computed(() => translations[language.value])

// Handle form submission
async function handleSubmit() {
  if (!email.value || loading.value) return
  
  loading.value = true
  error.value = null
  
  try {
    // Call Shopware password recovery endpoint
    await $fetch('/api/shopware/account/recovery-password', {
      method: 'POST',
      body: {
        email: email.value,
        storefrontUrl: window.location.origin,
      },
    })
    
    success.value = true
  } catch (err: any) {
    console.error('[ForgotPassword] Error:', err)
    // Always show success to prevent email enumeration
    success.value = true
  } finally {
    loading.value = false
  }
}
</script>
