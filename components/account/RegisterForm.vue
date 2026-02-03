<template>
  <form @submit.prevent="handleSubmit" class="space-y-10">
    <!-- Error Message -->
    <div 
      v-if="error" 
      class="p-5 bg-accent/10 border-2 border-accent text-accent text-base"
    >
      {{ error }}
    </div>
    
    <!-- Loading State for Form Data -->
    <div v-if="isLoadingFormData" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-4 text-black/50">
        <div class="w-8 h-8 border-4 border-black border-t-accent animate-spin" />
        <span class="font-mono text-sm uppercase tracking-wider">{{ t.loadingFormData }}</span>
      </div>
    </div>
    
    <template v-else>
      <!-- Personal Information Section -->
      <div class="space-y-6">
        <h3 class="font-display text-xl font-bold text-black uppercase border-b-2 border-black pb-3">{{ t.personalInfo }}</h3>
        
        <!-- Salutation -->
        <div>
          <label for="salutation" class="block font-mono text-sm uppercase tracking-wider text-black/60 mb-3">
            {{ t.salutation }} *
          </label>
          <select
            id="salutation"
            v-model="form.salutationId"
            required
            class="w-full px-5 py-4 text-lg bg-white border-2 border-black text-black focus:outline-none focus:border-accent transition-all touch-manipulation min-h-[64px]"
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
          <KioskInput
            v-model="form.firstName"
            :label="t.firstName + ' *'"
            :placeholder="t.firstNamePlaceholder"
            required
            autocomplete="given-name"
            size="lg"
            :disabled="loading"
          />
          
          <KioskInput
            v-model="form.lastName"
            :label="t.lastName + ' *'"
            :placeholder="t.lastNamePlaceholder"
            required
            autocomplete="family-name"
            size="lg"
            :disabled="loading"
          />
        </div>
        
        <!-- Company (Optional) -->
        <KioskInput
          v-model="form.company"
          :label="t.company"
          :placeholder="t.companyPlaceholder"
          autocomplete="organization"
          size="lg"
          :disabled="loading"
        />
      </div>
      
      <!-- Account Section -->
      <div class="space-y-6">
        <h3 class="font-display text-xl font-bold text-black uppercase border-b-2 border-black pb-3">{{ t.accountInfo }}</h3>
        
        <!-- Email -->
        <KioskInput
          v-model="form.email"
          type="email"
          :label="t.email + ' *'"
          :placeholder="t.emailPlaceholder"
          required
          autocomplete="email"
          inputmode="email"
          size="lg"
          :error="validationErrors.email"
          :disabled="loading"
        />
        
        <!-- Password -->
        <div>
          <KioskInput
            v-model="form.password"
            type="password"
            :label="t.password + ' *'"
            :placeholder="t.passwordPlaceholder"
            required
            autocomplete="new-password"
            size="lg"
            :error="validationErrors.password"
            :disabled="loading"
          />
          <p class="mt-2 font-mono text-sm text-black/40">{{ t.passwordHint }}</p>
        </div>
        
        <!-- Password Confirm -->
        <KioskInput
          v-model="form.passwordConfirm"
          type="password"
          :label="t.passwordConfirm + ' *'"
          :placeholder="t.passwordConfirmPlaceholder"
          required
          autocomplete="new-password"
          size="lg"
          :error="validationErrors.passwordConfirm"
          :disabled="loading"
        />
      </div>
      
      <!-- Address Section -->
      <div class="space-y-6">
        <h3 class="font-display text-xl font-bold text-black uppercase border-b-2 border-black pb-3">{{ t.addressInfo }}</h3>
        
        <!-- Street -->
        <KioskInput
          v-model="form.street"
          :label="t.street + ' *'"
          :placeholder="t.streetPlaceholder"
          required
          autocomplete="street-address"
          size="lg"
          :disabled="loading"
        />
        
        <!-- ZIP & City Row -->
        <div class="grid grid-cols-3 gap-4">
          <KioskInput
            v-model="form.zipcode"
            :label="t.zipcode + ' *'"
            :placeholder="t.zipcodePlaceholder"
            required
            autocomplete="postal-code"
            size="lg"
            :disabled="loading"
          />
          
          <div class="col-span-2">
            <KioskInput
              v-model="form.city"
              :label="t.city + ' *'"
              :placeholder="t.cityPlaceholder"
              required
              autocomplete="address-level2"
              size="lg"
              :disabled="loading"
            />
          </div>
        </div>
        
        <!-- Country -->
        <div>
          <label for="country" class="block font-mono text-sm uppercase tracking-wider text-black/60 mb-3">
            {{ t.country }} *
          </label>
          <select
            id="country"
            v-model="form.countryId"
            required
            class="w-full px-5 py-4 text-lg bg-white border-2 border-black text-black focus:outline-none focus:border-accent transition-all touch-manipulation min-h-[64px]"
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
          <label for="countryState" class="block font-mono text-sm uppercase tracking-wider text-black/60 mb-3">
            {{ t.state }} *
          </label>
          <select
            id="countryState"
            v-model="form.countryStateId"
            required
            class="w-full px-5 py-4 text-lg bg-white border-2 border-black text-black focus:outline-none focus:border-accent transition-all touch-manipulation min-h-[64px]"
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
        <KioskInput
          v-model="form.phoneNumber"
          type="tel"
          :label="t.phone"
          :placeholder="t.phonePlaceholder"
          autocomplete="tel"
          inputmode="tel"
          size="lg"
          :disabled="loading"
        />
      </div>
      
      <!-- Terms & Conditions -->
      <div class="space-y-4">
        <label class="flex items-start gap-4 cursor-pointer touch-manipulation py-2">
          <input
            v-model="form.acceptTerms"
            type="checkbox"
            required
            class="w-7 h-7 mt-0.5 border-2 border-black bg-white text-black focus:ring-0 focus:ring-offset-0 flex-shrink-0"
          />
          <span class="font-sans text-base text-black/70">
            {{ t.acceptTerms }}
            <NuxtLink to="/terms" class="text-accent hover:underline">{{ t.terms }}</NuxtLink>
            {{ t.and }}
            <NuxtLink to="/privacy" class="text-accent hover:underline">{{ t.privacy }}</NuxtLink>
            {{ t.acceptTermsEnd }} *
          </span>
        </label>
        <p v-if="validationErrors.acceptTerms" class="font-mono text-sm text-accent">
          {{ validationErrors.acceptTerms }}
        </p>
      </div>
      
      <!-- Submit Button -->
      <KioskButton
        type="submit"
        size="xl"
        full-width
        :loading="loading"
        :disabled="!isFormValid"
      >
        {{ loading ? t.registering : t.register }}
      </KioskButton>
      
      <!-- Login Link -->
      <p class="text-center font-sans text-lg text-black/50">
        {{ t.hasAccount }}
        <NuxtLink to="/account/login" class="text-accent hover:underline font-semibold ml-1">
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
