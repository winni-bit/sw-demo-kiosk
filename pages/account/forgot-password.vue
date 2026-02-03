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
        
        <!-- Form Card -->
        <div class="border-2 border-black p-8">
          <!-- Success Message -->
          <div 
            v-if="success" 
            class="p-5 bg-green-50 border-2 border-green-500 text-green-700 text-base mb-8"
          >
            {{ t.successMessage }}
          </div>
          
          <!-- Error Message -->
          <div 
            v-if="error" 
            class="p-5 bg-accent/10 border-2 border-accent text-accent text-base mb-8"
          >
            {{ error }}
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-8">
            <!-- Email -->
            <KioskInput
              v-model="email"
              type="email"
              :label="t.email"
              :placeholder="t.emailPlaceholder"
              required
              autocomplete="email"
              inputmode="email"
              size="xl"
              :disabled="loading || success"
            />
            
            <!-- Submit Button -->
            <KioskButton
              type="submit"
              size="xl"
              full-width
              :loading="loading"
              :disabled="success || !email"
            >
              {{ loading ? t.sending : t.submit }}
            </KioskButton>
          </form>
          
          <!-- Back to Login -->
          <p class="text-center font-sans text-lg text-black/50 mt-8">
            <NuxtLink to="/account/login" class="text-accent hover:underline font-semibold">
              {{ t.backToLogin }}
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
