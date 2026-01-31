/**
 * Checkout Composable
 * 
 * Handles checkout form state, validation, and step management
 * For Kiosk: No shipping (pickup only), payment via budget
 */

import type { CheckoutFormData } from '~/types/shopware'

export function useCheckout() {
  const { language } = useLanguage()
  
  // ============================================
  // Form State
  // ============================================
  
  const formData = reactive<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    street: '',
    zipcode: '',
    city: '',
    countryId: '',
    countryStateId: '',
    salutationId: '',
    phoneNumber: '',
    company: '',
  })
  
  // Validation errors
  const errors = reactive<Partial<Record<keyof CheckoutFormData, string>>>({})
  
  // Step tracking
  const currentStep = ref(1)
  const completedSteps = ref<number[]>([])
  
  // ============================================
  // Translations
  // ============================================
  
  const translations = {
    de: {
      required: 'Dieses Feld ist erforderlich',
      invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      invalidZipcode: 'Bitte geben Sie eine gültige Postleitzahl ein',
      minLength: (min: number) => `Mindestens ${min} Zeichen erforderlich`,
    },
    en: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidZipcode: 'Please enter a valid postal code',
      minLength: (min: number) => `At least ${min} characters required`,
    },
  }
  
  const t = computed(() => translations[language.value])
  
  // ============================================
  // Validation Methods
  // ============================================
  
  /**
   * Validate email format
   */
  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  /**
   * Validate a single field
   */
  function validateField(field: keyof CheckoutFormData, value: string): string | null {
    // Clear previous error
    errors[field] = undefined
    
    // Required fields
    const requiredFields: (keyof CheckoutFormData)[] = [
      'email',
      'firstName',
      'lastName',
      'street',
      'zipcode',
      'city',
      'countryId',
      'salutationId',
    ]
    
    if (requiredFields.includes(field) && !value?.trim()) {
      errors[field] = t.value.required
      return t.value.required
    }
    
    // Email validation
    if (field === 'email' && value && !validateEmail(value)) {
      errors[field] = t.value.invalidEmail
      return t.value.invalidEmail
    }
    
    // Zipcode validation (basic)
    if (field === 'zipcode' && value && value.length < 4) {
      errors[field] = t.value.invalidZipcode
      return t.value.invalidZipcode
    }
    
    // Min length validations
    if (field === 'firstName' && value && value.length < 2) {
      errors[field] = t.value.minLength(2)
      return t.value.minLength(2)
    }
    
    if (field === 'lastName' && value && value.length < 2) {
      errors[field] = t.value.minLength(2)
      return t.value.minLength(2)
    }
    
    return null
  }
  
  /**
   * Validate the entire form
   */
  function validateForm(): boolean {
    let isValid = true
    
    // Validate all required fields
    const fieldsToValidate: (keyof CheckoutFormData)[] = [
      'email',
      'firstName',
      'lastName',
      'street',
      'zipcode',
      'city',
      'countryId',
      'salutationId',
    ]
    
    for (const field of fieldsToValidate) {
      const error = validateField(field, formData[field] || '')
      if (error) {
        isValid = false
      }
    }
    
    return isValid
  }
  
  /**
   * Clear all errors
   */
  function clearErrors(): void {
    Object.keys(errors).forEach(key => {
      errors[key as keyof CheckoutFormData] = undefined
    })
  }
  
  /**
   * Clear a specific error
   */
  function clearError(field: keyof CheckoutFormData): void {
    errors[field] = undefined
  }
  
  // ============================================
  // Step Management
  // ============================================
  
  /**
   * Check if a step is completed
   */
  function isStepCompleted(step: number): boolean {
    return completedSteps.value.includes(step)
  }
  
  /**
   * Mark a step as completed
   */
  function completeStep(step: number): void {
    if (!completedSteps.value.includes(step)) {
      completedSteps.value.push(step)
    }
  }
  
  /**
   * Go to a specific step
   */
  function goToStep(step: number): void {
    currentStep.value = step
  }
  
  /**
   * Go to next step
   */
  function nextStep(): void {
    completeStep(currentStep.value)
    currentStep.value++
  }
  
  /**
   * Go to previous step
   */
  function prevStep(): void {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }
  
  // ============================================
  // Computed Properties
  // ============================================
  
  /**
   * Check if form is complete
   */
  const isFormComplete = computed(() => {
    return (
      formData.email &&
      validateEmail(formData.email) &&
      formData.firstName &&
      formData.lastName &&
      formData.street &&
      formData.zipcode &&
      formData.city &&
      formData.countryId &&
      formData.salutationId
    )
  })
  
  /**
   * Check if current step is valid
   */
  const isCurrentStepValid = computed(() => {
    switch (currentStep.value) {
      case 1: // Address step
        return isFormComplete.value
      case 2: // Payment step (for kiosk: always valid if logged in)
        return true
      case 3: // Confirmation step
        return true
      default:
        return false
    }
  })
  
  // ============================================
  // Form Helpers
  // ============================================
  
  /**
   * Pre-fill form with customer data
   */
  function prefillFromCustomer(customer: any): void {
    if (!customer) return
    
    formData.email = customer.email || ''
    formData.firstName = customer.firstName || ''
    formData.lastName = customer.lastName || ''
    formData.salutationId = customer.salutationId || ''
    
    // Pre-fill from default billing address
    const address = customer.defaultBillingAddress
    if (address) {
      formData.street = address.street || ''
      formData.zipcode = address.zipcode || ''
      formData.city = address.city || ''
      formData.countryId = address.countryId || ''
      formData.countryStateId = address.countryStateId || ''
      formData.phoneNumber = address.phoneNumber || ''
      formData.company = address.company || ''
    }
  }
  
  /**
   * Reset form
   */
  function resetForm(): void {
    formData.email = ''
    formData.firstName = ''
    formData.lastName = ''
    formData.street = ''
    formData.zipcode = ''
    formData.city = ''
    formData.countryId = ''
    formData.countryStateId = ''
    formData.salutationId = ''
    formData.phoneNumber = ''
    formData.company = ''
    
    clearErrors()
    currentStep.value = 1
    completedSteps.value = []
  }
  
  // ============================================
  // Price Formatting
  // ============================================
  
  /**
   * Format price with currency
   */
  function formatPrice(amount: number, currencyCode: string = 'EUR', locale?: string): string {
    const loc = locale || (language.value === 'de' ? 'de-DE' : 'en-GB')
    return new Intl.NumberFormat(loc, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount)
  }
  
  // ============================================
  // Return
  // ============================================
  
  return {
    // Form state
    formData,
    errors,
    
    // Step management
    currentStep,
    completedSteps: readonly(completedSteps),
    
    // Validation
    validateEmail,
    validateField,
    validateForm,
    clearErrors,
    clearError,
    
    // Steps
    isStepCompleted,
    completeStep,
    goToStep,
    nextStep,
    prevStep,
    
    // Computed
    isFormComplete,
    isCurrentStepValid,
    
    // Helpers
    prefillFromCustomer,
    resetForm,
    formatPrice,
  }
}
