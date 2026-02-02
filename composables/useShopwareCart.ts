/**
 * Shopware 6 Cart Composable
 * 
 * Handles cart management, shipping/payment methods, and order placement
 * Shares context token with useShopwareAuth
 */

import type {
  ShopwareCart,
  ShopwareCartLineItem,
  ShopwareShippingMethod,
  ShopwarePaymentMethod,
  ShopwareOrder,
} from '~/types/shopware'

// Context token cookie name (shared with auth)
const CONTEXT_TOKEN_COOKIE = 'sw-context-token'

export function useShopwareCart() {
  // ============================================
  // Global State (shared across components)
  // ============================================
  
  const cart = useState<ShopwareCart | null>('shopware-cart-data', () => null)
  const loading = useState<boolean>('shopware-cart-loading', () => false)
  const error = useState<string | null>('shopware-cart-error', () => null)
  const isInitialized = useState<boolean>('shopware-cart-initialized', () => false)
  
  // Shipping and payment methods
  const shippingMethods = useState<ShopwareShippingMethod[]>('shopware-cart-shipping-methods', () => [])
  const paymentMethods = useState<ShopwarePaymentMethod[]>('shopware-cart-payment-methods', () => [])
  
  // Selected methods
  const selectedShippingMethodId = useState<string | null>('shopware-cart-selected-shipping', () => null)
  const selectedPaymentMethodId = useState<string | null>('shopware-cart-selected-payment', () => null)
  
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
      query?: Record<string, any>
    } = {}
  ): Promise<{ data: T; contextToken: string | null }> {
    const { method = 'POST', body, query } = options
    
    const headers: Record<string, string> = {}
    const token = getContextToken()
    if (token) {
      headers['sw-context-token'] = token
    }
    
    console.log(`[Cart API] ${method} /api/shopware/${endpoint}`)
    console.log('[Cart API] Sending context token:', token ? token.substring(0, 20) + '...' : 'none')
    if (query) {
      console.log('[Cart API] Query params:', JSON.stringify(query))
    }
    
    let newContextToken: string | null = null
    
    const response = await $fetch<T>(`/api/shopware/${endpoint}`, {
      method: method as any,
      body,
      query,
      headers,
      onResponse({ response }) {
        // Update context token from response
        const tokenFromHeader = response.headers.get('sw-context-token')
        if (tokenFromHeader) {
          console.log('[Cart API] New context token received:', tokenFromHeader.substring(0, 20) + '...')
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
  
  const isEmpty = computed(() => {
    const result = !cart.value || !cart.value.lineItems || cart.value.lineItems.length === 0
    return result
  })
  
  const itemCount = computed(() => {
    if (!cart.value || !cart.value.lineItems) return 0
    return cart.value.lineItems.reduce((sum, item) => sum + item.quantity, 0)
  })
  
  const lineItems = computed(() => {
    return cart.value?.lineItems || []
  })
  
  const subtotal = computed(() => {
    return cart.value?.price?.positionPrice || 0
  })
  
  const totalPrice = computed(() => {
    return cart.value?.price?.totalPrice || 0
  })
  
  const shippingCosts = computed(() => {
    if (!cart.value?.deliveries || cart.value.deliveries.length === 0) return 0
    return cart.value.deliveries.reduce((sum, d) => sum + (d.shippingCosts?.totalPrice || 0), 0)
  })
  
  const taxes = computed(() => {
    if (!cart.value?.price?.calculatedTaxes) return 0
    return cart.value.price.calculatedTaxes.reduce((sum, t) => sum + t.tax, 0)
  })
  
  const netPrice = computed(() => {
    return cart.value?.price?.netPrice || 0
  })
  
  // ============================================
  // Cart Methods
  // ============================================
  
  /**
   * Initialize the cart - always fetch fresh to ensure we have the latest state
   */
  async function initCart(): Promise<void> {
    console.log('[Cart] Initializing cart...')
    console.log('[Cart] Current context token:', getContextToken() ? 'exists' : 'none')
    
    await fetchCart()
    isInitialized.value = true
    console.log('[Cart] Initialized with', cart.value?.lineItems?.length || 0, 'items')
  }
  
  /**
   * Fetch the current cart
   */
  async function fetchCart(): Promise<ShopwareCart | null> {
    loading.value = true
    error.value = null
    
    try {
      console.log('[Cart] Fetching cart...')
      console.log('[Cart] Using context token:', getContextToken() ? 'yes' : 'no')
      
      const { data: response } = await shopwareRequest<ShopwareCart>('checkout/cart', {
        method: 'GET',
      })
      
      console.log('[Cart] Raw response lineItems count:', response?.lineItems?.length || 0)
      
      // Ensure lineItems is always an array
      if (response && !response.lineItems) {
        response.lineItems = []
      }
      
      cart.value = response
      console.log('[Cart] Cart fetched, items:', response?.lineItems?.length || 0)
      
      // Log line item IDs for debugging
      if (response?.lineItems && response.lineItems.length > 0) {
        response.lineItems.forEach((item, idx) => {
          console.log(`[Cart] LineItem ${idx}: id=${item.id}, referencedId=${item.referencedId}, label=${item.label}, qty=${item.quantity}`)
        })
      }
      
      return response
    } catch (err: any) {
      console.error('[Cart] Failed to fetch cart:', err)
      error.value = extractErrorMessage(err) || 'Fehler beim Laden des Warenkorbs'
      return null
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Add a product to the cart
   * @param productId - The product ID (will be sent as-is to Shopware)
   * @param quantity - The quantity to add
   */
  async function addToCart(productId: string, quantity: number = 1): Promise<boolean> {
    loading.value = true
    error.value = null
    
    // Clean the product ID - remove any dashes for consistency
    const cleanProductId = productId.replace(/-/g, '')
    
    try {
      console.log('[Cart] Adding to cart - original productId:', productId)
      console.log('[Cart] Adding to cart - clean productId:', cleanProductId, 'quantity:', quantity)
      
      const { data: response } = await shopwareRequest<ShopwareCart>('checkout/cart/line-item', {
        method: 'POST',
        body: {
          items: [
            {
              id: cleanProductId,
              referencedId: cleanProductId,
              type: 'product',
              quantity,
            },
          ],
        },
      })
      
      console.log('[Cart] Add to cart response lineItems:', response?.lineItems?.length || 0)
      
      // Check for errors in the response
      if (response.errors && Object.keys(response.errors).length > 0) {
        const errorMessages = Object.values(response.errors)
          .map((e: any) => {
            // Handle Shopware's error format with %s placeholder
            let message = e.message || e.detail || ''
            if (message.includes('%s')) {
              message = message.replace('%s', 'dieses Produkt')
            }
            return message
          })
          .filter(Boolean)
        
        if (errorMessages.length > 0) {
          console.error('[Cart] Shopware returned errors:', errorMessages)
          
          // Check if it's a "product not found" error
          const isProductNotFound = errorMessages.some(msg => 
            msg.toLowerCase().includes('not found') || 
            msg.toLowerCase().includes('nicht gefunden')
          )
          
          if (isProductNotFound) {
            error.value = 'Dieses Produkt ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.'
          } else {
            error.value = errorMessages.join('. ')
          }
          return false
        }
      }
      
      // Ensure lineItems is always an array
      if (response && !response.lineItems) {
        response.lineItems = []
      }
      
      cart.value = response
      
      // Check if item was actually added
      if (response.lineItems && response.lineItems.length > 0) {
        console.log('[Cart] Product added successfully, total items:', response.lineItems.length)
        return true
      } else {
        console.warn('[Cart] Product was not added to cart (lineItems is empty)')
        error.value = 'Produkt konnte nicht hinzugefügt werden. Bitte versuchen Sie es später erneut.'
        return false
      }
    } catch (err: any) {
      console.error('[Cart] Failed to add to cart:', err)
      console.error('[Cart] Error details:', JSON.stringify(err))
      error.value = extractErrorMessage(err) || 'Fehler beim Hinzufügen zum Warenkorb'
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Update quantity of a line item
   * IMPORTANT: lineItemId must be the actual line item ID from the cart, NOT the product ID!
   */
  async function updateQuantity(lineItemId: string, quantity: number): Promise<boolean> {
    if (quantity < 1) {
      return removeFromCart(lineItemId)
    }
    
    error.value = null
    
    try {
      console.log('[Cart] Updating quantity - lineItemId:', lineItemId, 'quantity:', quantity)
      console.log('[Cart] Current context token:', getContextToken() ? 'exists' : 'none')
      
      // Find the line item to verify it exists
      const existingItem = cart.value?.lineItems?.find(item => item.id === lineItemId)
      if (!existingItem) {
        console.error('[Cart] Line item not found in local cart:', lineItemId)
        console.log('[Cart] Available line items:', cart.value?.lineItems?.map(i => ({ id: i.id, label: i.label })))
        error.value = 'Artikel nicht im Warenkorb gefunden'
        return false
      }
      
      console.log('[Cart] Found line item:', existingItem.label, 'current qty:', existingItem.quantity)
      
      const { data: response } = await shopwareRequest<ShopwareCart>('checkout/cart/line-item', {
        method: 'PATCH',
        body: {
          items: [
            {
              id: lineItemId,
              quantity,
            },
          ],
        },
      })
      
      // Ensure lineItems is always an array
      if (response && !response.lineItems) {
        response.lineItems = []
      }
      
      cart.value = response
      console.log('[Cart] Quantity updated, new cart items:', response?.lineItems?.length || 0)
      
      return true
    } catch (err: any) {
      console.error('[Cart] Failed to update quantity:', err)
      error.value = extractErrorMessage(err) || 'Fehler beim Aktualisieren der Menge'
      
      // Refresh cart to get current state
      await fetchCart()
      
      return false
    }
  }
  
  /**
   * Remove a line item from the cart
   * IMPORTANT: lineItemId must be the actual line item ID from the cart, NOT the product ID!
   */
  async function removeFromCart(lineItemId: string): Promise<boolean> {
    error.value = null
    
    try {
      console.log('[Cart] Removing from cart - lineItemId:', lineItemId)
      
      // Use query parameter for the DELETE request
      const { data: response } = await shopwareRequest<ShopwareCart>('checkout/cart/line-item', {
        method: 'DELETE',
        query: {
          'ids[]': lineItemId,
        },
      })
      
      // Ensure lineItems is always an array
      if (response && !response.lineItems) {
        response.lineItems = []
      }
      
      cart.value = response
      console.log('[Cart] Item removed, remaining items:', response?.lineItems?.length || 0)
      
      return true
    } catch (err: any) {
      console.error('[Cart] Failed to remove from cart:', err)
      error.value = extractErrorMessage(err) || 'Fehler beim Entfernen aus dem Warenkorb'
      
      // Refresh cart to get current state
      await fetchCart()
      
      return false
    }
  }
  
  /**
   * Clear the entire cart
   */
  async function clearCart(): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      console.log('[Cart] Clearing cart')
      
      // Remove all items one by one
      for (const item of cart.value?.lineItems || []) {
        await shopwareRequest('checkout/cart/line-item', {
          method: 'DELETE',
          query: {
            'ids[]': item.id,
          },
        })
      }
      
      await fetchCart()
      console.log('[Cart] Cart cleared')
      
      return true
    } catch (err: any) {
      console.error('[Cart] Failed to clear cart:', err)
      error.value = extractErrorMessage(err) || 'Fehler beim Leeren des Warenkorbs'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // ============================================
  // Shipping & Payment Methods
  // ============================================
  
  /**
   * Fetch available shipping methods
   */
  async function fetchShippingMethods(): Promise<ShopwareShippingMethod[]> {
    try {
      console.log('[Cart] Fetching shipping methods')
      
      const { data: response } = await shopwareRequest<{ elements: ShopwareShippingMethod[] }>('shipping-method', {
        method: 'POST',
        body: {
          onlyAvailable: true,
        },
      })
      
      shippingMethods.value = response.elements || []
      console.log('[Cart] Shipping methods fetched:', shippingMethods.value.length)
      
      // Auto-select first if none selected
      if (!selectedShippingMethodId.value && shippingMethods.value.length > 0) {
        selectedShippingMethodId.value = shippingMethods.value[0].id
      }
      
      return shippingMethods.value
    } catch (err: any) {
      console.error('[Cart] Failed to fetch shipping methods:', err)
      return []
    }
  }
  
  /**
   * Fetch available payment methods
   */
  async function fetchPaymentMethods(): Promise<ShopwarePaymentMethod[]> {
    try {
      console.log('[Cart] Fetching payment methods')
      
      const { data: response } = await shopwareRequest<{ elements: ShopwarePaymentMethod[] }>('payment-method', {
        method: 'POST',
        body: {
          onlyAvailable: true,
        },
      })
      
      paymentMethods.value = response.elements || []
      console.log('[Cart] Payment methods fetched:', paymentMethods.value.length)
      
      // Auto-select first if none selected
      if (!selectedPaymentMethodId.value && paymentMethods.value.length > 0) {
        selectedPaymentMethodId.value = paymentMethods.value[0].id
      }
      
      return paymentMethods.value
    } catch (err: any) {
      console.error('[Cart] Failed to fetch payment methods:', err)
      return []
    }
  }
  
  /**
   * Set the shipping method
   */
  async function setShippingMethod(shippingMethodId: string): Promise<boolean> {
    try {
      console.log('[Cart] Setting shipping method:', shippingMethodId)
      
      await shopwareRequest('context', {
        method: 'PATCH',
        body: {
          shippingMethodId,
        },
      })
      
      selectedShippingMethodId.value = shippingMethodId
      
      // Refresh cart to get updated shipping costs
      await fetchCart()
      
      console.log('[Cart] Shipping method set')
      return true
    } catch (err: any) {
      console.error('[Cart] Failed to set shipping method:', err)
      return false
    }
  }
  
  /**
   * Set the payment method
   */
  async function setPaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      console.log('[Cart] Setting payment method:', paymentMethodId)
      
      await shopwareRequest('context', {
        method: 'PATCH',
        body: {
          paymentMethodId,
        },
      })
      
      selectedPaymentMethodId.value = paymentMethodId
      
      console.log('[Cart] Payment method set')
      return true
    } catch (err: any) {
      console.error('[Cart] Failed to set payment method:', err)
      return false
    }
  }
  
  // ============================================
  // Checkout Methods
  // ============================================
  
  /**
   * Prepare checkout by setting up shipping and payment methods
   * This should be called before placing an order
   */
  async function prepareCheckout(): Promise<{ success: boolean; error?: string }> {
    console.log('[Cart] Preparing checkout...')
    
    try {
      // Fetch available methods
      const [shipping, payment] = await Promise.all([
        fetchShippingMethods(),
        fetchPaymentMethods(),
      ])
      
      console.log('[Cart] Available shipping methods:', shipping.length)
      console.log('[Cart] Available payment methods:', payment.length)
      
      // Check if we have methods available
      if (shipping.length === 0) {
        return { success: false, error: 'Keine Versandmethoden verfügbar' }
      }
      
      if (payment.length === 0) {
        return { success: false, error: 'Keine Zahlungsmethoden verfügbar' }
      }
      
      // Set default shipping method if not set
      if (!selectedShippingMethodId.value) {
        await setShippingMethod(shipping[0].id)
      }
      
      // Set default payment method if not set
      if (!selectedPaymentMethodId.value) {
        await setPaymentMethod(payment[0].id)
      }
      
      console.log('[Cart] Checkout prepared successfully')
      return { success: true }
    } catch (err: any) {
      console.error('[Cart] Failed to prepare checkout:', err)
      return { success: false, error: extractErrorMessage(err) || 'Fehler bei der Checkout-Vorbereitung' }
    }
  }
  
  /**
   * Place an order
   */
  async function placeOrder(): Promise<ShopwareOrder | null> {
    loading.value = true
    error.value = null
    
    try {
      console.log('[Cart] Placing order')
      console.log('[Cart] Selected shipping method:', selectedShippingMethodId.value)
      console.log('[Cart] Selected payment method:', selectedPaymentMethodId.value)
      
      // First, ensure checkout is prepared (shipping/payment methods set)
      const prepResult = await prepareCheckout()
      if (!prepResult.success) {
        error.value = prepResult.error || 'Checkout-Vorbereitung fehlgeschlagen'
        return null
      }
      
      const { data: response } = await shopwareRequest<ShopwareOrder>('checkout/order', {
        method: 'POST',
        body: {},
      })
      
      console.log('[Cart] Order placed:', response.orderNumber)
      
      // Clear local cart state
      cart.value = null
      
      // Fetch fresh cart
      await fetchCart()
      
      return response
    } catch (err: any) {
      console.error('[Cart] Failed to place order:', err)
      
      // Extract detailed error message
      let errorMessage = extractErrorMessage(err)
      
      // Check for common Shopware checkout errors
      if (err?.data?.errors) {
        const errors = err.data.errors
        if (Array.isArray(errors)) {
          const errorDetails = errors.map((e: any) => {
            if (e.code === 'CHECKOUT__CUSTOMER_NOT_LOGGED_IN') {
              return 'Bitte melden Sie sich an, um die Bestellung abzuschließen.'
            }
            if (e.code === 'CHECKOUT__CART_EMPTY') {
              return 'Der Warenkorb ist leer.'
            }
            if (e.code === 'CHECKOUT__CART_INVALID') {
              return 'Der Warenkorb enthält ungültige Artikel.'
            }
            if (e.code?.includes('SHIPPING')) {
              return 'Bitte wählen Sie eine gültige Versandmethode.'
            }
            if (e.code?.includes('PAYMENT')) {
              return 'Bitte wählen Sie eine gültige Zahlungsmethode.'
            }
            if (e.code?.includes('ADDRESS')) {
              return 'Bitte überprüfen Sie Ihre Adressdaten.'
            }
            return e.detail || e.title || e.message
          }).filter(Boolean)
          
          if (errorDetails.length > 0) {
            errorMessage = errorDetails.join(' ')
          }
        }
      }
      
      error.value = errorMessage || 'Fehler beim Aufgeben der Bestellung'
      return null
    } finally {
      loading.value = false
    }
  }
  
  // ============================================
  // Helper Methods
  // ============================================
  
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
   * Format price with currency
   */
  function formatPrice(amount: number, currencyCode: string = 'EUR'): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount)
  }
  
  /**
   * Clear error state
   */
  function clearError(): void {
    error.value = null
  }
  
  /**
   * Force refresh cart from server
   */
  async function refreshCart(): Promise<void> {
    console.log('[Cart] Force refreshing cart...')
    isInitialized.value = false
    await initCart()
  }
  
  // ============================================
  // Return
  // ============================================
  
  return {
    // State
    cart: readonly(cart),
    loading: readonly(loading),
    error: readonly(error),
    isInitialized: readonly(isInitialized),
    shippingMethods: readonly(shippingMethods),
    paymentMethods: readonly(paymentMethods),
    selectedShippingMethodId,
    selectedPaymentMethodId,
    
    // Computed
    isEmpty,
    itemCount,
    lineItems,
    subtotal,
    totalPrice,
    shippingCosts,
    taxes,
    netPrice,
    
    // Cart Methods
    initCart,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    
    // Shipping & Payment
    fetchShippingMethods,
    fetchPaymentMethods,
    setShippingMethod,
    setPaymentMethod,
    
    // Checkout
    prepareCheckout,
    placeOrder,
    
    // Helpers
    formatPrice,
    clearError,
    
    // Context token (for sharing)
    getContextToken,
    setContextToken,
  }
}
