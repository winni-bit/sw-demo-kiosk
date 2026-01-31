// Language composable for the kiosk app with Frontstack context support
import client from '../../.frontstack/generated-client'

export type Language = 'de' | 'en'

const currentLanguage = ref<Language>('de')
const contextToken = ref<string | null>(null)
const isInitialized = ref(false)
const availableContexts = ref<any[]>([])

export function useLanguage() {
  // Initialize context on first use
  async function initContext() {
    if (isInitialized.value) return
    
    try {
      console.log('[Kiosk] Initializing Frontstack context...')
      const [contexts, token] = await client.contextList()
      contextToken.value = token
      availableContexts.value = contexts
      console.log('[Kiosk] Context initialized with token:', token)
      console.log('[Kiosk] Available contexts:', JSON.stringify(contexts, null, 2))
      isInitialized.value = true
    } catch (error) {
      console.error('[Kiosk] Failed to initialize context:', error)
    }
  }

  // Find the correct locale value from available contexts
  function findLocaleForLanguage(lang: Language): { region: string, locale: string } | null {
    const contexts = availableContexts.value
    
    // Look for locale context
    const localeContext = contexts.find((ctx: any) => ctx.type === 'locale')
    const regionContext = contexts.find((ctx: any) => ctx.type === 'region')
    
    console.log('[Kiosk] Locale context:', localeContext)
    console.log('[Kiosk] Region context:', regionContext)
    
    if (!localeContext || !regionContext) {
      console.warn('[Kiosk] No locale or region context found')
      return null
    }
    
    // Find matching locale option for the language
    const localeOptions = localeContext.options || []
    const regionOptions = regionContext.options || []
    
    console.log('[Kiosk] Locale options:', localeOptions)
    console.log('[Kiosk] Region options:', regionOptions)
    
    // Find locale that starts with the language code
    const matchingLocale = localeOptions.find((opt: any) => {
      const code = opt.code || opt.value || opt.id || opt
      return typeof code === 'string' && code.toLowerCase().startsWith(lang)
    })
    
    // Use first region as default, or find a matching one
    const defaultRegion = regionOptions[0]
    
    if (matchingLocale && defaultRegion) {
      const localeCode = matchingLocale.code || matchingLocale.value || matchingLocale.id || matchingLocale
      const regionCode = defaultRegion.code || defaultRegion.value || defaultRegion.id || defaultRegion
      
      console.log('[Kiosk] Found locale:', localeCode, 'region:', regionCode)
      return { region: regionCode, locale: localeCode }
    }
    
    return null
  }

  // Change language and update Frontstack context
  async function setLanguage(lang: Language) {
    if (currentLanguage.value === lang && isInitialized.value) return
    
    currentLanguage.value = lang
    console.log('[Kiosk] Language changed to:', lang)
    
    // Update Frontstack context if we have a token
    if (contextToken.value) {
      try {
        const contextValues = findLocaleForLanguage(lang)
        
        if (contextValues) {
          console.log('[Kiosk] Updating context to:', contextValues)
          await client.contextUpdate(contextValues, contextToken.value)
          console.log('[Kiosk] Context updated successfully')
        } else {
          console.warn('[Kiosk] Could not find matching context values for language:', lang)
        }
      } catch (error) {
        console.error('[Kiosk] Failed to update context:', error)
      }
    }
  }

  // Get the context key for API calls
  function getContextKey(): string | undefined {
    return contextToken.value || undefined
  }

  // UI Translations (for static text)
  const translations = {
    de: {
      shopName: 'Kiosk Shop',
      noProducts: 'Keine Produkte verfügbar',
      noProductsDescription: 'Derzeit sind keine Produkte vorhanden.',
      category: 'Kategorie',
      product: 'Produkt',
    },
    en: {
      shopName: 'Kiosk Shop',
      noProducts: 'No products available',
      noProductsDescription: 'There are currently no products available.',
      category: 'Category',
      product: 'Product',
    }
  }

  const t = computed(() => translations[currentLanguage.value])

  return {
    language: currentLanguage,
    setLanguage,
    initContext,
    getContextKey,
    t,
    isInitialized,
    availableContexts
  }
}
