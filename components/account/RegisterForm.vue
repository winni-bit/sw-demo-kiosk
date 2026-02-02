<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    <!-- Error Message -->
    <div 
      v-if="error" 
      class="p-4 bg-accent/10 border border-accent text-accent text-sm"
    >
      {{ error }}
    </div>
    
    <!-- Loading State for Form Data -->
    <div v-if="isLoadingFormData" class="flex items-center justify-center py-8">
      <div class="flex items-center gap-3 text-black/50">
        <div class="w-6 h-6 border-2 border-black border-t-accent animate-spin" />
        <span class="font-mono text-xs uppercase tracking-wider">{{ t.loadingFormData }}</span>
      </div>
    </div>
    
    <template v-else>
      <!-- Personal Information Section -->
      <div class="space-y-4">
        <h3 class="font-display text-lg font-bold text-black uppercase border-b border-black pb-2">{{ t.personalInfo }}</h3>
        
        <!-- Salutation -->
        <div>
          <label for="salutation" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
            {{ t.salutation }} *
          </label>
          <select
            id="salutation"
            v-model="form.salutationId"
            required
            class="w-full px-4 py-3 bg-white border border-black text-black focus:outline-none focus:border-accent transition-all"
            :disabled="loading"
          >
            <option value="" disabled>{{ t.selectSalutation }}</option>
            <option 
              v-for="salutation in displaySalutations" 
              :key="salutation.id" 
              :value="salutation.id"
            >
              {{ salutation.label }}
            </option>
          </select>
        </div>
        
        <!-- Name Row -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
              {{ t.firstName }} *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              autocomplete="given-name"
              :placeholder="t.firstNamePlaceholder"
              class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
              :disabled="loading"
            />
          </div>
          
          <div>
            <label for="lastName" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
              {{ t.lastName }} *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              autocomplete="family-name"
              :placeholder="t.lastNamePlaceholder"
              class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
              :disabled="loading"
            />
          </div>
        </div>
        
        <!-- Company (Optional) -->
        <div>
          <label for="company" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
            {{ t.company }}
          </label>
          <input
            id="company"
            v-model="form.company"
            type="text"
            autocomplete="organization"
            :placeholder="t.companyPlaceholder"
            class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
            :disabled="loading"
          />
        </div>
      </div>
      
      <!-- Account Section -->
      <div class="space-y-4">
        <h3 class="font-display text-lg font-bold text-black uppercase border-b border-black pb-2">{{ t.accountInfo }}</h3>
        
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
            class="w-full px-4 py-3 bg-white border text-black placeholder-black/30 focus:outline-none transition-all"
            :class="validationErrors.email ? 'border-accent' : 'border-black focus:border-accent'"
            :disabled="loading"
          />
          <p v-if="validationErrors.email" class="mt-1 font-mono text-xs text-accent">
            {{ validationErrors.email }}
          </p>
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
              autocomplete="new-password"
              :placeholder="t.passwordPlaceholder"
              class="w-full px-4 py-3 bg-white border text-black placeholder-black/30 focus:outline-none transition-all pr-12"
              :class="validationErrors.password ? 'border-accent' : 'border-black focus:border-accent'"
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
          <p v-if="validationErrors.password" class="mt-1 font-mono text-xs text-accent">
            {{ validationErrors.password }}
          </p>
          <p class="mt-1 font-mono text-xs text-black/40">{{ t.passwordHint }}</p>
        </div>
        
        <!-- Password Confirm -->
        <div>
          <label for="passwordConfirm" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
            {{ t.passwordConfirm }} *
          </label>
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            :type="showPassword ? 'text' : 'password'"
            required
            autocomplete="new-password"
            :placeholder="t.passwordConfirmPlaceholder"
            class="w-full px-4 py-3 bg-white border text-black placeholder-black/30 focus:outline-none transition-all"
            :class="validationErrors.passwordConfirm ? 'border-accent' : 'border-black focus:border-accent'"
            :disabled="loading"
          />
          <p v-if="validationErrors.passwordConfirm" class="mt-1 font-mono text-xs text-accent">
            {{ validationErrors.passwordConfirm }}
          </p>
        </div>
      </div>
      
      <!-- Address Section -->
      <div class="space-y-4">
        <h3 class="font-display text-lg font-bold text-black uppercase border-b border-black pb-2">{{ t.addressInfo }}</h3>
        
        <!-- Street -->
        <div>
          <label for="street" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
            {{ t.street }} *
          </label>
          <input
            id="street"
            v-model="form.street"
            type="text"
            required
            autocomplete="street-address"
            :placeholder="t.streetPlaceholder"
            class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
            :disabled="loading"
          />
        </div>
        
        <!-- ZIP & City Row -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label for="zipcode" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
              {{ t.zipcode }} *
            </label>
            <input
              id="zipcode"
              v-model="form.zipcode"
              type="text"
              required
              autocomplete="postal-code"
              :placeholder="t.zipcodePlaceholder"
              class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
              :disabled="loading"
            />
          </div>
          
          <div class="col-span-2">
            <label for="city" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
              {{ t.city }} *
            </label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              required
              autocomplete="address-level2"
              :placeholder="t.cityPlaceholder"
              class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
              :disabled="loading"
            />
          </div>
        </div>
        
        <!-- Country -->
        <div>
          <label for="country" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
            {{ t.country }} *
          </label>
          <select
            id="country"
            v-model="form.countryId"
            required
            class="w-full px-4 py-3 bg-white border border-black text-black focus:outline-none focus:border-accent transition-all"
            :disabled="loading"
          >
            <option value="" disabled>{{ t.selectCountry }}</option>
            <option 
              v-for="country in localCountries" 
              :key="country.id" 
              :value="country.id"
            >
              {{ country.name }}
            </option>
          </select>
        </div>
        
        <!-- Country State (if available) -->
        <div v-if="selectedCountryStates.length > 0">
          <label for="countryState" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
            {{ t.state }} *
          </label>
          <select
            id="countryState"
            v-model="form.countryStateId"
            required
            class="w-full px-4 py-3 bg-white border border-black text-black focus:outline-none focus:border-accent transition-all"
            :disabled="loading"
          >
            <option value="" disabled>{{ t.selectState }}</option>
            <option 
              v-for="state in selectedCountryStates" 
              :key="state.id" 
              :value="state.id"
            >
              {{ state.name }}
            </option>
          </select>
        </div>
        
        <!-- Phone (Optional) -->
        <div>
          <label for="phone" class="block font-mono text-xs uppercase tracking-wider text-black/60 mb-2">
            {{ t.phone }}
          </label>
          <input
            id="phone"
            v-model="form.phoneNumber"
            type="tel"
            autocomplete="tel"
            :placeholder="t.phonePlaceholder"
            class="w-full px-4 py-3 bg-white border border-black text-black placeholder-black/30 focus:outline-none focus:border-accent transition-all"
            :disabled="loading"
          />
        </div>
      </div>
      
      <!-- Terms & Conditions -->
      <div class="space-y-3">
        <label class="flex items-start gap-3 cursor-pointer">
          <input
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="w-5 h-5 mt-0.5 border-black bg-white text-black focus:ring-0 focus:ring-offset-0"
          />
          <span class="font-sans text-sm text-black/70">
            {{ t.acceptTerms }}
            <NuxtLink to="/terms" class="text-accent hover:underline">{{ t.terms }}</NuxtLink>
            {{ t.and }}
            <NuxtLink to="/privacy" class="text-accent hover:underline">{{ t.privacy }}</NuxtLink>
            {{ t.acceptTermsEnd }} *
          </span>
        </label>
        <p v-if="validationErrors.acceptTerms" class="font-mono text-xs text-accent">
          {{ validationErrors.acceptTerms }}
        </p>
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
        {{ loading ? t.registering : t.register }}
      </button>
      
      <!-- Login Link -->
      <p class="text-center font-sans text-black/50 text-sm">
        {{ t.hasAccount }}
        <NuxtLink to="/account/login" class="text-accent hover:underline font-semibold">
          {{ t.loginNow }}
        </NuxtLink>
      </p>
    </template>
  </form>
</template>

<script setup lang="ts">
import type { RegistrationFormData, ShopwareCountry, ShopwareSalutation } from '~/types/shopware'

const emit = defineEmits<{
  success: []
}>()

const { register, loading, error, clearError } = useShopwareAuth()
const { language } = useLanguage()

const localCountries = ref<ShopwareCountry[]>([])
const localSalutations = ref<ShopwareSalutation[]>([])
const isLoadingFormData = ref(true)

const form = reactive<RegistrationFormData>({
  email: '',
  password: '',
  passwordConfirm: '',
  salutationId: '',
  firstName: '',
  lastName: '',
  street: '',
  zipcode: '',
  city: '',
  countryId: '',
  countryStateId: '',
  phoneNumber: '',
  company: '',
  acceptTerms: false,
})

const showPassword = ref(false)
const validationErrors = reactive<Record<string, string>>({})

const salutationLabels: Record<string, Record<string, string>> = {
  mr: { de: 'Herr', en: 'Mr.' },
  mrs: { de: 'Frau', en: 'Mrs.' },
  ms: { de: 'Frau', en: 'Ms.' },
  not_specified: { de: 'Keine Angabe', en: 'Not specified' },
  diverse: { de: 'Divers', en: 'Diverse' },
}

const translations = {
  de: {
    loadingFormData: 'Formulardaten werden geladen...',
    personalInfo: 'Persönliche Daten',
    salutation: 'Anrede',
    selectSalutation: 'Bitte wählen',
    firstName: 'Vorname',
    firstNamePlaceholder: 'Max',
    lastName: 'Nachname',
    lastNamePlaceholder: 'Mustermann',
    company: 'Firma (optional)',
    companyPlaceholder: 'Ihre Firma',
    accountInfo: 'Zugangsdaten',
    email: 'E-Mail',
    emailPlaceholder: 'ihre@email.de',
    password: 'Passwort',
    passwordPlaceholder: 'Mindestens 8 Zeichen',
    passwordHint: 'Mindestens 8 Zeichen',
    passwordConfirm: 'Passwort bestätigen',
    passwordConfirmPlaceholder: 'Passwort wiederholen',
    addressInfo: 'Adresse',
    street: 'Straße und Hausnummer',
    streetPlaceholder: 'Musterstraße 123',
    zipcode: 'PLZ',
    zipcodePlaceholder: '12345',
    city: 'Stadt',
    cityPlaceholder: 'Musterstadt',
    country: 'Land',
    selectCountry: 'Land wählen',
    state: 'Bundesland',
    selectState: 'Bundesland wählen',
    phone: 'Telefon (optional)',
    phonePlaceholder: '+49 123 456789',
    acceptTerms: 'Ich akzeptiere die',
    terms: 'AGB',
    and: 'und die',
    privacy: 'Datenschutzerklärung',
    acceptTermsEnd: '',
    register: 'Registrieren',
    registering: 'Wird registriert...',
    hasAccount: 'Bereits ein Konto?',
    loginNow: 'Jetzt anmelden',
    errorEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    errorPassword: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    errorPasswordMatch: 'Die Passwörter stimmen nicht überein',
    errorTerms: 'Bitte akzeptieren Sie die AGB',
  },
  en: {
    loadingFormData: 'Loading form data...',
    personalInfo: 'Personal Information',
    salutation: 'Salutation',
    selectSalutation: 'Please select',
    firstName: 'First Name',
    firstNamePlaceholder: 'John',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Doe',
    company: 'Company (optional)',
    companyPlaceholder: 'Your company',
    accountInfo: 'Account Details',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    passwordHint: 'At least 8 characters',
    passwordConfirm: 'Confirm Password',
    passwordConfirmPlaceholder: 'Repeat password',
    addressInfo: 'Address',
    street: 'Street and Number',
    streetPlaceholder: '123 Main Street',
    zipcode: 'ZIP',
    zipcodePlaceholder: '12345',
    city: 'City',
    cityPlaceholder: 'Your City',
    country: 'Country',
    selectCountry: 'Select country',
    state: 'State',
    selectState: 'Select state',
    phone: 'Phone (optional)',
    phonePlaceholder: '+1 234 567890',
    acceptTerms: 'I accept the',
    terms: 'Terms & Conditions',
    and: 'and the',
    privacy: 'Privacy Policy',
    acceptTermsEnd: '',
    register: 'Register',
    registering: 'Registering...',
    hasAccount: 'Already have an account?',
    loginNow: 'Sign in now',
    errorEmail: 'Please enter a valid email address',
    errorPassword: 'Password must be at least 8 characters',
    errorPasswordMatch: 'Passwords do not match',
    errorTerms: 'Please accept the terms',
  },
}

const t = computed(() => translations[language.value])

const displaySalutations = computed(() => {
  return localSalutations.value.map(salutation => {
    const key = salutation.salutationKey?.toLowerCase() || ''
    const localizedLabel = salutationLabels[key]?.[language.value]
    
    return {
      id: salutation.id,
      label: localizedLabel || salutation.displayName || salutation.salutationKey,
    }
  }).filter(s => s.label)
})

async function loadFormData() {
  isLoadingFormData.value = true
  
  try {
    const countriesResponse = await $fetch<{ elements: ShopwareCountry[] }>('/api/shopware/country', {
      method: 'POST',
      body: {
        filter: [{ type: 'equals', field: 'active', value: true }],
        associations: { states: {} },
        sort: [{ field: 'name', order: 'ASC' }],
      },
    })
    
    localCountries.value = countriesResponse.elements || []
    
    const germany = localCountries.value.find(c => 
      c.iso === 'DE' || c.name === 'Germany' || c.name === 'Deutschland'
    )
    if (germany && !form.countryId) {
      form.countryId = germany.id
    }
  } catch (err) {
    console.error('[RegisterForm] Failed to load countries:', err)
  }
  
  try {
    const salutationsResponse = await $fetch<{ elements: ShopwareSalutation[] }>('/api/shopware/salutation', {
      method: 'POST',
      body: {},
    })
    
    localSalutations.value = salutationsResponse.elements || []
    
    if (localSalutations.value.length > 0 && !form.salutationId) {
      const defaultSalutation = localSalutations.value.find(s => 
        s.salutationKey === 'mr'
      ) || localSalutations.value[0]
      
      form.salutationId = defaultSalutation.id
    }
  } catch (err) {
    console.error('[RegisterForm] Failed to load salutations:', err)
  }
  
  isLoadingFormData.value = false
}

onMounted(() => {
  loadFormData()
})

const selectedCountryStates = computed(() => {
  if (!form.countryId) return []
  const country = localCountries.value.find(c => c.id === form.countryId)
  return country?.states || []
})

watch(() => form.countryId, () => {
  form.countryStateId = ''
})

const isFormValid = computed(() => {
  return (
    form.email.trim() !== '' &&
    form.password.trim() !== '' &&
    form.passwordConfirm.trim() !== '' &&
    form.salutationId !== '' &&
    form.firstName.trim() !== '' &&
    form.lastName.trim() !== '' &&
    form.street.trim() !== '' &&
    form.zipcode.trim() !== '' &&
    form.city.trim() !== '' &&
    form.countryId !== '' &&
    form.acceptTerms
  )
})

function validateForm(): boolean {
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key] = ''
  })
  
  let isValid = true
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    validationErrors.email = t.value.errorEmail
    isValid = false
  }
  
  if (form.password.length < 8) {
    validationErrors.password = t.value.errorPassword
    isValid = false
  }
  
  if (form.password !== form.passwordConfirm) {
    validationErrors.passwordConfirm = t.value.errorPasswordMatch
    isValid = false
  }
  
  if (!form.acceptTerms) {
    validationErrors.acceptTerms = t.value.errorTerms
    isValid = false
  }
  
  return isValid
}

async function handleSubmit() {
  if (!isFormValid.value) return
  
  if (!validateForm()) return
  
  clearError()
  
  const success = await register(form)
  
  if (success) {
    emit('success')
  }
}

watch(() => form.email, () => {
  validationErrors.email = ''
  if (error.value) clearError()
})

watch(() => form.password, () => {
  validationErrors.password = ''
  if (error.value) clearError()
})

watch(() => form.passwordConfirm, () => {
  validationErrors.passwordConfirm = ''
})
</script>
