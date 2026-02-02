<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Error Message -->
    <div 
      v-if="error" 
      class="p-4 bg-accent/10 border border-accent text-accent text-sm"
    >
      {{ error }}
    </div>
    
    <!-- Email -->
    <div>
      <label for="email" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
        {{ t.email }} *
      </label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        autocomplete="email"
        :placeholder="t.emailPlaceholder"
        class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
        :disabled="loading"
      />
    </div>
    
    <!-- Password -->
    <div>
      <label for="password" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
        {{ t.password }} *
      </label>
      <div class="relative">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="current-password"
          :placeholder="t.passwordPlaceholder"
          class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all pr-12"
          :disabled="loading"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors"
        >
          <svg v-if="showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Remember Me & Forgot Password -->
    <div class="flex items-center justify-between">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          v-model="form.rememberMe"
          type="checkbox"
          class="w-4 h-4 border-black bg-white text-black focus:ring-0 focus:ring-offset-0"
        />
        <span class="font-sans text-sm text-black/60">{{ t.rememberMe }}</span>
      </label>
      
      <NuxtLink 
        to="/account/forgot-password" 
        class="font-mono text-xs uppercase tracking-wider text-black/50 hover:text-accent transition-colors"
      >
        {{ t.forgotPassword }}
      </NuxtLink>
    </div>
    
    <!-- Submit Button -->
    <button
      type="submit"
      :disabled="loading || !isFormValid"
      class="w-full py-4 px-6 bg-black text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
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
      {{ loading ? t.loggingIn : t.login }}
    </button>
    
    <!-- Register Link -->
    <p class="text-center font-sans text-black/50 text-sm">
      {{ t.noAccount }}
      <NuxtLink to="/account/register" class="text-accent hover:underline font-semibold">
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

const showPassword = ref(false)

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
