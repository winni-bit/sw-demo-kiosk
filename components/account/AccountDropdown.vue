<template>
  <div class="relative" ref="dropdownRef">
    <!-- Logged In: Show Account Button with Dropdown -->
    <template v-if="isLoggedIn">
      <button
        @click="isDropdownOpen = !isDropdownOpen"
        class="flex items-center gap-3 px-4 py-2 border border-black hover:bg-black hover:text-white transition-all"
      >
        <!-- User Initials -->
        <div class="w-8 h-8 bg-black text-white flex items-center justify-center">
          <span class="font-mono text-xs font-bold">{{ customerInitials }}</span>
        </div>
        <!-- Chevron -->
        <svg 
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': isDropdownOpen }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 -translate-y-2"
        enter-to-class="transform opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 translate-y-0"
        leave-to-class="transform opacity-0 -translate-y-2"
      >
        <div 
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-72 bg-white border border-black z-50"
        >
          <!-- Customer Info -->
          <div class="px-5 py-4 border-b border-black bg-gray-50">
            <p class="font-sans font-semibold text-black truncate">{{ displayName }}</p>
            <p class="font-mono text-xs text-black/50 truncate">{{ customerEmail }}</p>
          </div>
          
          <!-- Menu Items -->
          <div class="py-2">
            <NuxtLink
              to="/account"
              @click="isDropdownOpen = false"
              class="flex items-center gap-4 px-5 py-3 text-black hover:bg-black hover:text-white transition-colors"
            >
              <span class="font-mono text-xs">01</span>
              <span class="font-sans text-sm uppercase tracking-wider">{{ t.dashboard }}</span>
            </NuxtLink>
            
            <NuxtLink
              to="/account/orders"
              @click="isDropdownOpen = false"
              class="flex items-center gap-4 px-5 py-3 text-black hover:bg-black hover:text-white transition-colors"
            >
              <span class="font-mono text-xs">02</span>
              <span class="font-sans text-sm uppercase tracking-wider">{{ t.orders }}</span>
            </NuxtLink>
          </div>
          
          <!-- Logout -->
          <div class="border-t border-black p-3">
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-3 px-5 py-3 bg-accent text-white hover:bg-accent-dark transition-colors font-sans text-sm uppercase tracking-wider font-semibold"
            >
              {{ t.logout }}
            </button>
          </div>
        </div>
      </Transition>
    </template>
    
    <!-- Logged Out: Show Login Button -->
    <template v-else>
      <button
        @click="openLoginModal"
        class="flex items-center gap-2 px-6 py-2 bg-black text-white font-sans text-sm uppercase tracking-wider font-semibold hover:bg-accent transition-all"
      >
        {{ t.login }}
      </button>
    </template>
    
    <!-- Login Modal -->
    <ClientOnly>
      <Teleport to="body">
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="isLoginModalOpen" 
            class="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-6"
            @click.self="closeLoginModal"
          >
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div 
                v-if="isLoginModalOpen"
                class="w-full max-w-md bg-white border border-black"
                @click.stop
              >
                <!-- Modal Header -->
                <div class="flex items-center justify-between px-8 py-6 border-b border-black">
                  <h2 class="font-display text-2xl font-bold text-black uppercase">{{ t.loginTitle }}</h2>
                  <button
                    @click="closeLoginModal"
                    class="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Modal Content -->
                <div class="p-8">
                  <!-- Error Message -->
                  <div 
                    v-if="loginError" 
                    class="mb-6 p-4 bg-accent/10 border border-accent text-accent text-sm"
                  >
                    {{ loginError }}
                  </div>
                  
                  <!-- Login Form -->
                  <form @submit.prevent="handleLogin" class="space-y-6">
                    <!-- Email -->
                    <div>
                      <label for="login-email" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
                        {{ t.email }}
                      </label>
                      <input
                        id="login-email"
                        v-model="loginForm.email"
                        type="email"
                        required
                        autocomplete="email"
                        :placeholder="t.emailPlaceholder"
                        class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
                        :disabled="isLoggingIn"
                      />
                    </div>
                    
                    <!-- Password -->
                    <div>
                      <label for="login-password" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
                        {{ t.password }}
                      </label>
                      <div class="relative">
                        <input
                          id="login-password"
                          v-model="loginForm.password"
                          :type="showPassword ? 'text' : 'password'"
                          required
                          autocomplete="current-password"
                          :placeholder="t.passwordPlaceholder"
                          class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all pr-12"
                          :disabled="isLoggingIn"
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
                    
                    <!-- Submit Button -->
                    <button
                      type="submit"
                      :disabled="isLoggingIn || !loginForm.email || !loginForm.password"
                      class="w-full py-4 px-6 bg-black text-white font-sans font-semibold uppercase tracking-widest hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                    >
                      <svg 
                        v-if="isLoggingIn" 
                        class="w-5 h-5 animate-spin" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {{ isLoggingIn ? t.loggingIn : t.loginButton }}
                    </button>
                  </form>
                </div>
                
                <!-- Register Link -->
                <div class="px-8 py-6 bg-gray-50 border-t border-black">
                  <button
                    @click="goToRegister"
                    class="w-full py-4 px-6 bg-transparent border border-black text-black font-sans font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all"
                  >
                    {{ t.noAccount }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { isLoggedIn, customerName, customerEmail, customer, login, logout, clearError, error } = useShopwareAuth()
const { language } = useLanguage()

const isDropdownOpen = ref(false)
const isLoginModalOpen = ref(false)
const isLoggingIn = ref(false)
const loginError = ref<string | null>(null)
const showPassword = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const loginForm = reactive({
  email: '',
  password: '',
})

// Translations
const translations = {
  de: {
    login: 'Anmelden',
    loginTitle: 'Anmelden',
    loginButton: 'Jetzt Anmelden',
    loggingIn: 'Wird angemeldet...',
    email: 'E-Mail',
    emailPlaceholder: 'ihre@email.de',
    password: 'Passwort',
    passwordPlaceholder: 'Ihr Passwort',
    noAccount: 'Noch kein Konto? Registrieren',
    dashboard: 'Mein Konto',
    orders: 'Bestellungen',
    logout: 'Abmelden',
  },
  en: {
    login: 'Sign In',
    loginTitle: 'Sign In',
    loginButton: 'Sign In Now',
    loggingIn: 'Signing in...',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    noAccount: 'No account? Register',
    dashboard: 'My Account',
    orders: 'Orders',
    logout: 'Sign Out',
  },
}

const t = computed(() => translations[language.value])

const displayName = computed(() => {
  if (!customer.value) return ''
  const firstName = customer.value.firstName || ''
  const lastName = customer.value.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || customer.value.email || ''
})

const customerInitials = computed(() => {
  if (!customer.value) return '?'
  const firstName = customer.value.firstName || ''
  const lastName = customer.value.lastName || ''
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) return firstName[0].toUpperCase()
  if (customer.value.email) return customer.value.email[0].toUpperCase()
  return '?'
})

function openLoginModal() {
  isLoginModalOpen.value = true
}

function closeLoginModal() {
  isLoginModalOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

async function handleLogin() {
  if (!loginForm.email || !loginForm.password) return
  
  isLoggingIn.value = true
  loginError.value = null
  clearError()
  
  try {
    const success = await login(loginForm.email, loginForm.password)
    
    if (success) {
      isLoginModalOpen.value = false
      loginForm.email = ''
      loginForm.password = ''
    } else {
      loginError.value = error.value || 'Login fehlgeschlagen'
    }
  } catch (err: any) {
    loginError.value = err.message || 'Login fehlgeschlagen'
  } finally {
    isLoggingIn.value = false
  }
}

async function handleLogout() {
  isDropdownOpen.value = false
  await logout()
  router.push('/')
}

function goToRegister() {
  isLoginModalOpen.value = false
  router.push('/account/register')
}

watch(isLoginModalOpen, (isOpen) => {
  if (!isOpen) {
    loginError.value = null
    showPassword.value = false
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
