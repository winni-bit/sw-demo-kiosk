<template>
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
    
    <!-- Register Link -->
    <p class="text-center font-sans text-lg text-black/50">
      {{ t.noAccount }}
      <NuxtLink to="/account/register" class="text-accent hover:underline font-semibold ml-1">
        {{ t.registerNow }}
      </NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  success: []
}>()

const { login, loading, error, clearError } = useShopwareAuth()
const { language } = useLanguage()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const translations = {
  de: {
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
    emit('success')
  }
}

watch(() => [form.email, form.password], () => {
  if (error.value) {
    clearError()
  }
})
</script>
