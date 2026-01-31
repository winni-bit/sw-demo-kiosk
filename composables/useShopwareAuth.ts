/**
 * Shopware 6 Customer Authentication Composable
 * 
 * Handles login, registration, logout, and customer data management
 * Shares context token with useShopwareCart
 */

import type {
  ShopwareCustomer,
  ShopwareLoginRequest,
  ShopwareRegisterRequest,
  RegistrationFormData,
  ShopwareOrder,
  ShopwareOrderResponse,
  ShopwareAddress,
  ShopwareCountry,
  ShopwareSalutation,
} from '~/types/shopware'

// Context token cookie name (shared with cart)
const CONTEXT_TOKEN_COOKIE = 'sw-context-token'

// Configured storefront URL in Shopware (must match Sales Channel configuration)
const STOREFRONT_URL = 'default.headless0'

export function useShopwareAuth() {
  // ============================================
  // Global State (shared across components)
  // ============================================
  
  const customer = useState<ShopwareCustomer | null>('auth-customer', () => null)
  const loading = useState<boolean>('auth-loading', () => false)
  const error = useState<string | null>('auth-error', () => null)
  const isInitialized = useState<boolean>('auth-initialized', () => false)
  
  // Countries and salutations for forms
  const countries = useState<ShopwareCountry[]>('auth-countries', () => [])
  const salutations = useState<ShopwareSalutation[]>('auth-salutations', () => [])
  
  // ============================================
  // Context Token Management
  // ============================================
  
  const contextToken = useCookie(CONTEXT_TOKEN_COOKIE, {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
    path: '/',
  })
  
  function getContextToken(): string | null {
    // Try to get from cookie first
    let token = contextToken.value || null
    
    // On client-side, also check localStorage as backup
    if (import.meta.client && !token) {
      token = localStorage.getItem(CONTEXT_TOKEN_COOKIE)
      if (token) {
        // Sync to cookie
        contextToken.value = token
      }
    }
    
    return token
  }
  
  function setContextToken(token: string | null) {
    contextToken.value = token
    
    // On client-side, also store in localStorage as backup
    if (import.meta.client) {
      if (token) {
        localStorage.setItem(CONTEXT_TOKEN_COOKIE, token)
      } else {
        localStorage.removeItem(CONTEXT_TOKEN_COOKIE)
      }
    }
  }
  
  // ============================================
  // API Helper
  // ============================================
  
  async function shopwareRequest<T>(
    endpoint: string,
    options: {
      method?: string
      body?: any
    } = {}
  ): Promise<{ data: T; contextToken: string | null }> {
    const { method = 'POST', body } = options
    
    const headers: Record<string, string> = {}
    const token = getContextToken()
    if (token) {
      headers['sw-context-token'] = token
    }
    
    let newContextToken: string | null = null
    
    const response = await $fetch<T>(`/api/shopware/${endpoint}`, {
      method: method as any,
      body,
      headers,
      onResponse({ response }) {
        // Update context token from response
        const tokenFromHeader = response.headers.get('sw-context-token')
        if (tokenFromHeader) {
          newContextToken = tokenFromHeader
          setContextToken(tokenFromHeader)
        }
      },
    })
    
    return { data: response, contextToken: newContextToken }
  }
  
  // ============================================
  // Computed Properties
  // ============================================
  
  const isLoggedIn = computed(() => {
    return customer.value !== null && !customer.value.guest
  })
  
  const customerName = computed(() => {
    if (!customer.value) return ''
    const firstName = customer.value.firstName || ''
    const lastName = customer.value.lastName || ''
    return `${firstName} ${lastName}`.trim() || customer.value.email || ''
  })
  
  const customerEmail = computed(() => {
    return customer.value?.email || ''
  })
  
  const billingAddress = computed(() => {
    return customer.value?.defaultBillingAddress || null
  })
  
  const shippingAddress = computed(() => {
    return customer.value?.defaultShippingAddress || null
  })
  
  const addresses = computed(() => {
    return customer.value?.addresses || []
  })
  
  // ============================================
  // Auth Methods
  // ============================================
  
  /**
   * Login with email and password
   */
  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      console.log('[Auth] Logging in:', email)
      
      // Login returns a context token, not customer data
      const { contextToken: newToken } = await shopwareRequest<any>('account/login', {
        body: { email, password } as ShopwareLoginRequest,
      })
      
      console.log('[Auth] Login successful, new context token received')
      
      // Fetch customer data after login
      await fetchCustomer()
      
      // Sync cart after login
      await syncCartAfterAuth()
      
      return true
    } catch (err: any) {
      console.error('[Auth] Login failed:', err)
      error.value = extractErrorMessage(err) || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.'
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Register a new customer account
   */
  async function register(formData: RegistrationFormData): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      console.log('[Auth] Registering:', formData.email)
      
      // Build the registration request
      const registrationData: ShopwareRegisterRequest = {
        email: formData.email,
        password: formData.password,
        salutationId: formData.salutationId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        storefrontUrl: STOREFRONT_URL,
        acceptedDataProtection: formData.acceptTerms,
        billingAddress: {
          salutationId: formData.salutationId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.street,
          zipcode: formData.zipcode,
          city: formData.city,
          countryId: formData.countryId,
          countryStateId: formData.countryStateId || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          company: formData.company || undefined,
        },
      }
      
      // Remove undefined values from billingAddress
      Object.keys(registrationData.billingAddress).forEach(key => {
        if (registrationData.billingAddress[key as keyof typeof registrationData.billingAddress] === undefined) {
          delete registrationData.billingAddress[key as keyof typeof registrationData.billingAddress]
        }
      })
      
      console.log('[Auth] Registration data:', JSON.stringify(registrationData, null, 2))
      
      // Register returns customer data directly
      const { data: response } = await shopwareRequest<ShopwareCustomer>('account/register', {
        body: registrationData,
      })
      
      // Set customer from registration response
      if (response && response.id) {
        customer.value = response
        console.log('[Auth] Registration successful:', response.email)
      } else {
        // Fetch customer data if not returned
        await fetchCustomer()
      }
      
      // Sync cart after registration
      await syncCartAfterAuth()
      
      return true
    } catch (err: any) {
      console.error('[Auth] Registration failed:', err)
      error.value = extractErrorMessage(err) || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Logout the current customer
   */
  async function logout(): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      console.log('[Auth] Logging out')
      
      await shopwareRequest('account/logout', {})
      
      customer.value = null
      console.log('[Auth] Logout successful')
      
      // Clear context token on logout
      setContextToken(null)
      
      // Sync cart after logout (get new guest cart)
      await syncCartAfterAuth()
      
      return true
    } catch (err: any) {
      console.error('[Auth] Logout failed:', err)
      // Even if logout fails, clear local state
      customer.value = null
      // Clear context token on logout
      setContextToken(null)
      return true // Return true anyway since we cleared local state
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Fetch current customer data with addresses
   */
  async function fetchCustomer(): Promise<ShopwareCustomer | null> {
    try {
      console.log('[Auth] Fetching customer data')
      
      const { data: response } = await shopwareRequest<ShopwareCustomer>('account/customer', {
        body: {
          associations: {
            addresses: {
              associations: {
                country: {},
                countryState: {},
                salutation: {},
              },
            },
            defaultBillingAddress: {
              associations: {
                country: {},
                countryState: {},
                salutation: {},
              },
            },
            defaultShippingAddress: {
              associations: {
                country: {},
                countryState: {},
                salutation: {},
              },
            },
            salutation: {},
          },
        },
      })
      
      if (response && response.id) {
        customer.value = response
        console.log('[Auth] Customer data fetched:', response.email, response.firstName, response.lastName)
        console.log('[Auth] Default billing address:', response.defaultBillingAddress?.street || 'none')
        console.log('[Auth] Default shipping address:', response.defaultShippingAddress?.street || 'none')
        console.log('[Auth] Total addresses:', response.addresses?.length || 0)
        return response
      }
      
      customer.value = null
      return null
    } catch (err: any) {
      console.log('[Auth] No customer logged in or fetch failed:', err?.message)
      customer.value = null
      return null
    }
  }
  
  /**
   * Fetch customer orders
   * Note: Shopware returns orders in { orders: { elements: [], total: ... } } format
   */
  async function fetchOrders(page = 1, limit = 10): Promise<ShopwareOrderResponse> {
    try {
      console.log('[Auth] Fetching orders, page:', page)
      
      // Shopware returns: { apiAlias: "order-route-response-struct", orders: { elements: [...], total: ... } }
      const { data: response } = await shopwareRequest<{ orders: ShopwareOrderResponse }>('order', {
        body: {
          page,
          limit,
          associations: {
            lineItems: {
              associations: {
                cover: {},
              },
            },
            deliveries: {
              associations: {
                shippingMethod: {},
                shippingOrderAddress: {
                  associations: {
                    country: {},
                    countryState: {},
                  },
                },
              },
            },
            transactions: {
              associations: {
                paymentMethod: {},
                stateMachineState: {},
              },
            },
            billingAddress: {
              associations: {
                country: {},
                countryState: {},
              },
            },
            stateMachineState: {},
            currency: {},
            orderCustomer: {},
          },
        },
      })
      
      // Extract orders from nested structure
      const orders = response.orders || response as unknown as ShopwareOrderResponse
      console.log('[Auth] Orders fetched:', orders.total || orders.elements?.length || 0)
      return orders
    } catch (err: any) {
      console.error('[Auth] Failed to fetch orders:', err)
      throw err
    }
  }
  
  /**
   * Fetch a single order by ID
   */
  async function fetchOrder(orderId: string): Promise<ShopwareOrder | null> {
    try {
      console.log('[Auth] Fetching order:', orderId)
      
      // Shopware returns: { apiAlias: "order-route-response-struct", orders: { elements: [...] } }
      const { data: response } = await shopwareRequest<{ orders: ShopwareOrderResponse }>('order', {
        body: {
          filter: [
            {
              type: 'equals',
              field: 'id',
              value: orderId,
            },
          ],
          associations: {
            lineItems: {
              associations: {
                cover: {},
              },
            },
            deliveries: {
              associations: {
                shippingMethod: {},
                shippingOrderAddress: {
                  associations: {
                    country: {},
                    countryState: {},
                    salutation: {},
                  },
                },
              },
            },
            transactions: {
              associations: {
                paymentMethod: {},
                stateMachineState: {},
              },
            },
            billingAddress: {
              associations: {
                country: {},
                countryState: {},
                salutation: {},
              },
            },
            stateMachineState: {},
            currency: {},
            orderCustomer: {},
          },
        },
      })
      
      // Extract orders from nested structure
      const orders = response.orders || response as unknown as ShopwareOrderResponse
      
      if (orders.elements && orders.elements.length > 0) {
        console.log('[Auth] Order found:', orders.elements[0].orderNumber)
        return orders.elements[0]
      }
      
      console.log('[Auth] Order not found')
      return null
    } catch (err: any) {
      console.error('[Auth] Failed to fetch order:', err)
      return null
    }
  }
  
  /**
   * Initialize auth state on app start
   */
  async function initAuth(): Promise<void> {
    if (isInitialized.value) {
      console.log('[Auth] Already initialized')
      return
    }
    
    console.log('[Auth] Initializing auth state')
    
    try {
      // Check if we have a context token and try to fetch customer
      if (getContextToken()) {
        await fetchCustomer()
      }
      
      // Load countries and salutations for forms
      await Promise.all([
        loadCountries(),
        loadSalutations(),
      ])
    } catch (err) {
      console.error('[Auth] Init failed:', err)
    } finally {
      isInitialized.value = true
    }
  }
  
  // ============================================
  // Helper Methods
  // ============================================
  
  /**
   * Load available countries
   */
  async function loadCountries(): Promise<void> {
    try {
      const { data: response } = await shopwareRequest<{ elements: ShopwareCountry[] }>('country', {
        body: {
          filter: [
            {
              type: 'equals',
              field: 'active',
              value: true,
            },
          ],
          associations: {
            states: {},
          },
          sort: [
            {
              field: 'name',
              order: 'ASC',
            },
          ],
        },
      })
      
      countries.value = response.elements || []
      console.log('[Auth] Countries loaded:', countries.value.length)
    } catch (err) {
      console.error('[Auth] Failed to load countries:', err)
    }
  }
  
  /**
   * Load available salutations
   */
  async function loadSalutations(): Promise<void> {
    try {
      const { data: response } = await shopwareRequest<{ elements: ShopwareSalutation[] }>('salutation', {})
      
      salutations.value = response.elements || []
      console.log('[Auth] Salutations loaded:', salutations.value.length)
    } catch (err) {
      console.error('[Auth] Failed to load salutations:', err)
    }
  }
  
  /**
   * Sync cart after login/logout
   */
  async function syncCartAfterAuth(): Promise<void> {
    try {
      // Trigger cart refresh by fetching it
      await shopwareRequest('checkout/cart', {
        method: 'GET',
      })
      console.log('[Auth] Cart synced after auth change')
    } catch (err) {
      console.error('[Auth] Failed to sync cart:', err)
    }
  }
  
  /**
   * Extract error message from API error
   */
  function extractErrorMessage(err: any): string | null {
    if (err?.data?.errors && Array.isArray(err.data.errors)) {
      const messages = err.data.errors.map((e: any) => e.detail || e.title).filter(Boolean)
      if (messages.length > 0) {
        return messages.join('. ')
      }
    }
    
    if (err?.data?.message) {
      return err.data.message
    }
    
    if (err?.message) {
      return err.message
    }
    
    return null
  }
  
  /**
   * Clear error state
   */
  function clearError(): void {
    error.value = null
  }
  
  // ============================================
  // Return
  // ============================================
  
  return {
    // State
    customer: readonly(customer),
    loading: readonly(loading),
    error: readonly(error),
    isInitialized: readonly(isInitialized),
    countries: readonly(countries),
    salutations: readonly(salutations),
    
    // Computed
    isLoggedIn,
    customerName,
    customerEmail,
    billingAddress,
    shippingAddress,
    addresses,
    
    // Methods
    login,
    register,
    logout,
    fetchCustomer,
    fetchOrders,
    fetchOrder,
    initAuth,
    clearError,
    
    // Context token (for sharing with cart)
    getContextToken,
    setContextToken,
  }
}
