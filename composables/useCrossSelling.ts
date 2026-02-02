/**
 * Cross-Selling / Upselling Composable
 * 
 * Ermittelt Produktempfehlungen basierend auf:
 * 1. Bestellhistorie des Kunden (meistgekaufte Produkte)
 * 2. Gleiche Kategorie wie Warenkorb-Produkte
 * 3. Beliebige andere Produkte als Fallback
 */

import client from '../../.frontstack/generated-client'

interface CrossSellingProduct {
  id: string
  key: string
  name: string
  price: Price | undefined
  cover: Media | undefined
  categoryIds: string[]
}

interface PurchaseHistory {
  productId: string
  productKey: string
  purchaseCount: number
}

export function useCrossSelling() {
  const { getContextKey } = useLanguage()
  
  // State
  const recommendations = ref<CrossSellingProduct[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  /**
   * Analysiert die Bestellhistorie und gibt eine Liste der gekauften Produkt-IDs
   * sortiert nach Kaufhäufigkeit zurück.
   * 
   * WICHTIG: Diese Funktion macht einen eigenen API-Call und fängt Fehler ab,
   * um den Login-Status nicht zu beeinträchtigen.
   */
  async function analyzePurchaseHistory(): Promise<PurchaseHistory[]> {
    try {
      console.log('[CrossSelling] Analyzing purchase history...')
      
      // Wir verwenden einen separaten API-Call, um die Bestellungen zu holen
      // Das vermeidet Probleme mit dem Context-Token
      const { fetchOrders } = useShopwareAuth()
      
      // Hole alle Bestellungen des Kunden (max 50 für Performance)
      const ordersResponse = await fetchOrders(1, 50)
      const orders = ordersResponse.elements || []
      
      console.log('[CrossSelling] Found', orders.length, 'orders')
      
      // Zähle wie oft jedes Produkt gekauft wurde
      const productCounts = new Map<string, { key: string; count: number }>()
      
      for (const order of orders) {
        const lineItems = order.lineItems || []
        
        for (const item of lineItems) {
          // Nur Produkte zählen (keine Versandkosten etc.)
          if (item.type !== 'product' || !item.productId) continue
          
          const productId = item.productId
          const existing = productCounts.get(productId)
          
          if (existing) {
            existing.count += item.quantity
          } else {
            productCounts.set(productId, {
              key: item.referencedId || productId,
              count: item.quantity
            })
          }
        }
      }
      
      // Konvertiere zu Array und sortiere nach Häufigkeit (absteigend)
      const history: PurchaseHistory[] = Array.from(productCounts.entries())
        .map(([productId, data]) => ({
          productId,
          productKey: data.key,
          purchaseCount: data.count
        }))
        .sort((a, b) => b.purchaseCount - a.purchaseCount)
      
      console.log('[CrossSelling] Purchase history:', history.length, 'unique products')
      
      return history
    } catch (err: any) {
      // Bei Fehlern (z.B. 403) einfach leere Historie zurückgeben
      // Das Cross-Selling funktioniert dann mit Kategorie- oder Fallback-Produkten
      console.warn('[CrossSelling] Could not load purchase history (this is OK):', err?.message || err)
      return []
    }
  }
  
  /**
   * Ermittelt die häufigste Kategorie im Warenkorb
   */
  function getMostFrequentCategory(cartItems: { categoryIds?: string[] }[]): string | null {
    const categoryCounts = new Map<string, number>()
    
    for (const item of cartItems) {
      const categoryIds = item.categoryIds || []
      for (const categoryId of categoryIds) {
        categoryCounts.set(categoryId, (categoryCounts.get(categoryId) || 0) + 1)
      }
    }
    
    if (categoryCounts.size === 0) return null
    
    // Finde die Kategorie mit den meisten Produkten
    let maxCount = 0
    let mostFrequentCategory: string | null = null
    
    for (const [categoryId, count] of categoryCounts) {
      if (count > maxCount) {
        maxCount = count
        mostFrequentCategory = categoryId
      }
    }
    
    console.log('[CrossSelling] Most frequent category:', mostFrequentCategory, 'with', maxCount, 'products')
    
    return mostFrequentCategory
  }
  
  /**
   * Holt Produktdetails von Frontstack
   */
  async function fetchProductDetails(productKeys: string[]): Promise<CrossSellingProduct[]> {
    if (productKeys.length === 0) return []
    
    try {
      const contextKey = getContextKey()
      const products: CrossSellingProduct[] = []
      
      // Lade alle Produkte parallel
      const promises = productKeys.map(async (key) => {
        try {
          const product = await client.block('ProductCard', key, { contextKey })
          if (product) {
            return {
              id: product.id || product.key,
              key: product.key,
              name: product.name || '',
              price: product.price,
              cover: product.cover,
              categoryIds: product.categoryIds || []
            } as CrossSellingProduct
          }
        } catch (err) {
          console.warn('[CrossSelling] Failed to fetch product:', key)
        }
        return null
      })
      
      const results = await Promise.all(promises)
      
      for (const product of results) {
        if (product) {
          products.push(product)
        }
      }
      
      return products
    } catch (err) {
      console.error('[CrossSelling] Failed to fetch product details:', err)
      return []
    }
  }
  
  /**
   * Holt Produkte aus einer bestimmten Kategorie
   */
  async function fetchProductsByCategory(categoryId: string, excludeKeys: string[], limit: number): Promise<CrossSellingProduct[]> {
    try {
      const contextKey = getContextKey()
      
      const response = await client.listing('ProductsByCategoryListing', { categoryId }, {
        contextKey,
        query: {
          limit: limit + excludeKeys.length // Mehr laden um Excludes auszugleichen
        }
      })
      
      const products: CrossSellingProduct[] = []
      
      for (const item of response.items || []) {
        // Überspringe Produkte die bereits im Warenkorb sind
        if (excludeKeys.includes(item.key)) continue
        
        products.push({
          id: item.id || item.key,
          key: item.key,
          name: item.name || '',
          price: item.price,
          cover: item.cover,
          categoryIds: item.categoryIds || []
        })
        
        if (products.length >= limit) break
      }
      
      console.log('[CrossSelling] Found', products.length, 'products in category', categoryId)
      
      return products
    } catch (err) {
      console.error('[CrossSelling] Failed to fetch products by category:', err)
      return []
    }
  }
  
  /**
   * Holt beliebige Produkte als Fallback
   */
  async function fetchAnyProducts(excludeKeys: string[], limit: number): Promise<CrossSellingProduct[]> {
    try {
      const contextKey = getContextKey()
      
      const response = await client.listing('AllProductsListing', {}, {
        contextKey,
        query: {
          limit: limit + excludeKeys.length
        }
      })
      
      const products: CrossSellingProduct[] = []
      
      for (const item of response.items || []) {
        // Überspringe Produkte die bereits im Warenkorb sind
        if (excludeKeys.includes(item.key)) continue
        
        products.push({
          id: item.id || item.key,
          key: item.key,
          name: item.name || '',
          price: item.price,
          cover: item.cover,
          categoryIds: item.categoryIds || []
        })
        
        if (products.length >= limit) break
      }
      
      console.log('[CrossSelling] Found', products.length, 'fallback products')
      
      return products
    } catch (err) {
      console.error('[CrossSelling] Failed to fetch any products:', err)
      return []
    }
  }
  
  /**
   * Hauptfunktion: Ermittelt Cross-Selling Empfehlungen
   * 
   * @param cartProductKeys - Keys der Produkte im Warenkorb
   * @param cartProducts - Produkte im Warenkorb (für Kategorie-Analyse)
   * @param limit - Maximale Anzahl der Empfehlungen
   */
  async function getRecommendations(
    cartProductKeys: string[],
    cartProducts: { categoryIds?: string[] }[],
    limit: number = 2
  ): Promise<CrossSellingProduct[]> {
    loading.value = true
    error.value = null
    recommendations.value = []
    
    try {
      console.log('[CrossSelling] Getting recommendations...')
      console.log('[CrossSelling] Cart product keys:', cartProductKeys)
      
      const result: CrossSellingProduct[] = []
      const excludeKeys = new Set(cartProductKeys)
      
      // 1. Versuche Produkte aus der Bestellhistorie zu empfehlen
      // Fehler werden intern abgefangen, damit der Login-Status nicht beeinträchtigt wird
      const purchaseHistory = await analyzePurchaseHistory()
      
      // Filtere Produkte die bereits im Warenkorb sind
      const eligibleFromHistory = purchaseHistory.filter(
        item => !excludeKeys.has(item.productKey) && !excludeKeys.has(item.productId)
      )
      
      console.log('[CrossSelling] Eligible products from history:', eligibleFromHistory.length)
      
      if (eligibleFromHistory.length > 0) {
        // Hole Details für die Top-Produkte aus der Historie
        const historyKeys = eligibleFromHistory.slice(0, limit).map(item => item.productKey)
        const historyProducts = await fetchProductDetails(historyKeys)
        
        for (const product of historyProducts) {
          if (result.length >= limit) break
          if (!excludeKeys.has(product.key)) {
            result.push(product)
            excludeKeys.add(product.key)
          }
        }
        
        console.log('[CrossSelling] Added', result.length, 'products from purchase history')
      }
      
      // 2. Falls nicht genug: Produkte aus der gleichen Kategorie
      if (result.length < limit) {
        const mostFrequentCategory = getMostFrequentCategory(cartProducts)
        
        if (mostFrequentCategory) {
          const categoryProducts = await fetchProductsByCategory(
            mostFrequentCategory,
            Array.from(excludeKeys),
            limit - result.length
          )
          
          for (const product of categoryProducts) {
            if (result.length >= limit) break
            if (!excludeKeys.has(product.key)) {
              result.push(product)
              excludeKeys.add(product.key)
            }
          }
          
          console.log('[CrossSelling] Added products from category, total now:', result.length)
        }
      }
      
      // 3. Falls immer noch nicht genug: Beliebige andere Produkte
      if (result.length < limit) {
        const fallbackProducts = await fetchAnyProducts(
          Array.from(excludeKeys),
          limit - result.length
        )
        
        for (const product of fallbackProducts) {
          if (result.length >= limit) break
          if (!excludeKeys.has(product.key)) {
            result.push(product)
            excludeKeys.add(product.key)
          }
        }
        
        console.log('[CrossSelling] Added fallback products, total now:', result.length)
      }
      
      recommendations.value = result
      console.log('[CrossSelling] Final recommendations:', result.length)
      
      return result
    } catch (err: any) {
      console.error('[CrossSelling] Failed to get recommendations:', err)
      error.value = err.message || 'Failed to load recommendations'
      return []
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Formatiert den Preis
   */
  function formatPrice(price: Price | undefined): string {
    if (!price || price.amount === undefined) return ''
    
    const amount = price.amount / Math.pow(10, price.precision || 2)
    const currency = price.currency || 'EUR'
    
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency
    }).format(amount)
  }
  
  return {
    recommendations: readonly(recommendations),
    loading: readonly(loading),
    error: readonly(error),
    getRecommendations,
    formatPrice
  }
}
