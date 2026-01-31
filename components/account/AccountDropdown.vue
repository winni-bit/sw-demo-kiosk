<template>
  <div class="relative" ref="dropdownRef">
    <!-- Logged In: Show Account Button with Dropdown -->
    <template v-if="isLoggedIn">
      <button
        @click="isDropdownOpen = !isDropdownOpen"
        class="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-900 rounded-xl font-medium text-base hover:bg-gray-200 transition-all"
      >
        <!-- User Initials Avatar -->
        <div class="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
          <span class="text-sm font-semibold">{{ customerInitials }}</span>
        </div>
        <!-- Chevron -->
        <svg 
          class="w-4 h-4 transition-transform text-gray-600"
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
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div 
          v-if="isDropdownOpen"
          class="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50"
        >
          <!-- Customer Info -->
          <div class="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <p class="text-base font-semibold text-gray-900 truncate">{{ displayName }}</p>
            <p class="text-sm text-gray-500 truncate">{{ customerEmail }}</p>
          </div>
          
          <!-- Menu Items -->
          <div class="py-2">
            <NuxtLink
              to="/account"
              @click="isDropdownOpen = false"
              class="flex items-center gap-4 px-5 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span class="text-base">{{ t.dashboard }}</span>
            </NuxtLink>
            
            <NuxtLink
              to="/account/orders"
              @click="isDropdownOpen = false"
              class="flex items-center gap-4 px-5 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span class="text-base">{{ t.orders }}</span>
            </NuxtLink>
          </div>
          
          <!-- Logout -->
          <div class="border-t border-gray-100 p-3">
            <button
              @click="handleLogout"
              class="w-full flex items-center justify-center gap-3 px-5 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-base font-medium"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
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
        class="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-medium text-base hover:bg-gray-800 transition-all"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        {{ t.login }}
      </button>
    </template>
    
    <!-- Login Modal Overlay (Client-side only) -->
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
            class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-6"
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
                class="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                @click.stop
              >
                <!-- Modal Header -->
                <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                  <h2 class="text-2xl font-semibold text-gray-900">{{ t.loginTitle }}</h2>
                  <button
                    @click="closeLoginModal"
                    class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Modal Content -->
                <div class="p-8">
                  <!-- Error Message -->
                  <div 
                    v-if="loginError" 
                    class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-base"
                  >
                    {{ loginError }}
                  </div>
                  
                  <!-- Login Form -->
                  <form @submit.prevent="handleLogin" class="space-y-6">
                    <!-- Email -->
                    <div>
                      <label for="login-email" class="block text-base font-medium text-gray-700 mb-2">
                        {{ t.email }}
                      </label>
                      <input
                        id="login-email"
                        v-model="loginForm.email"
                        type="email"
                        required
                        autocomplete="email"
                        :placeholder="t.emailPlaceholder"
                        class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all"
                        :disabled="isLoggingIn"
                      />
                    </div>
                    
                    <!-- Password -->
                    <div>
                      <label for="login-password" class="block text-base font-medium text-gray-700 mb-2">
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
                          class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all pr-12"
                          :disabled="isLoggingIn"
                        />
                        <button
                          type="button"
                          @click="showPassword = !showPassword"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
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
                      class="w-full py-4 px-6 bg-gray-900 text-white rounded-xl font-semibold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
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
                <div class="px-8 py-6 bg-gray-50 border-t border-gray-100">
                  <button
                    @click="goToRegister"
                    class="w-full py-4 px-6 bg-transparent border border-gray-300 text-gray-700 rounded-xl font-medium text-base hover:border-gray-400 hover:text-gray-900 transition-all"
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
    loginButton: 'Jetzt anmelden',
    loggingIn: 'Wird angemeldet...',
    email: 'E-Mail-Adresse',
    emailPlaceholder: 'ihre@email.de',
    password: 'Passwort',
    passwordPlaceholder: 'Ihr Passwort',
    noAccount: 'Noch kein Kunde? Hier registrieren',
    dashboard: 'Mein Konto',
    orders: 'Bestellungen',
    logout: 'Abmelden',
  },
  en: {
    login: 'Sign In',
    loginTitle: 'Sign In',
    loginButton: 'Sign In Now',
    loggingIn: 'Signing in...',
    email: 'Email Address',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: 'Your password',
    noAccount: 'No account yet? Register here',
    dashboard: 'My Account',
    orders: 'Orders',
    logout: 'Sign Out',
  },
}

const t = computed(() => translations[language.value])

// Customer display name with fallback
const displayName = computed(() => {
  if (!customer.value) return ''
  const firstName = customer.value.firstName || ''
  const lastName = customer.value.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim()
  return fullName || customer.value.email || ''
})

// Customer initials for avatar
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

// Open login modal
function openLoginModal() {
  console.log('[AccountDropdown] Opening login modal')
  isLoginModalOpen.value = true
}

// Close login modal
function closeLoginModal() {
  console.log('[AccountDropdown] Closing login modal')
  isLoginModalOpen.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

// Handle login
async function handleLogin() {
  if (!loginForm.email || !loginForm.password) return
  
  console.log('[AccountDropdown] Attempting login...')
  isLoggingIn.value = true
  loginError.value = null
  clearError()
  
  try {
    const success = await login(loginForm.email, loginForm.password)
    
    if (success) {
      console.log('[AccountDropdown] Login successful')
      isLoginModalOpen.value = false
      loginForm.email = ''
      loginForm.password = ''
    } else {
      console.log('[AccountDropdown] Login failed:', error.value)
      loginError.value = error.value || 'Login fehlgeschlagen'
    }
  } catch (err: any) {
    console.error('[AccountDropdown] Login error:', err)
    loginError.value = err.message || 'Login fehlgeschlagen'
  } finally {
    isLoggingIn.value = false
  }
}

// Handle logout
async function handleLogout() {
  isDropdownOpen.value = false
  await logout()
  router.push('/')
}

// Go to register page
function goToRegister() {
  isLoginModalOpen.value = false
  router.push('/account/register')
}

// Reset form when modal closes
watch(isLoginModalOpen, (isOpen) => {
  console.log('[AccountDropdown] Modal state changed:', isOpen)
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
