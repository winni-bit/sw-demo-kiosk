<template>
  <div class="h-screen w-screen bg-gray-50 overflow-hidden flex flex-col fixed inset-0 z-50">
    <!-- Category Navigation Header -->
    <KioskCategoryNav
      :categories="categories"
      :active-key="activeCategoryKey"
      :loading="loadingCategories"
      @select="scrollToCategory"
      @language-change="reloadData"
    />
    
    <!-- Scrollable Product Sections -->
    <div 
      ref="scrollContainer"
      class="flex-1 overflow-y-auto bg-gray-50"
      @scroll="handleScroll"
    >
      <!-- Loading State -->
      <div v-if="loading" class="relative min-h-[400px]">
        <div class="flex">
          <div class="w-14 flex-shrink-0 bg-gray-200 animate-pulse" />
          <div class="flex-1 py-8 px-6">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              <div
                v-for="i in 10"
                :key="i"
                class="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm"
              >
                <div class="aspect-square bg-gray-100" />
                <div class="p-5 space-y-3">
                  <div class="h-5 bg-gray-100 rounded w-3/4" />
                  <div class="h-7 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Sections by Category -->
      <template v-else>
        <KioskProductSection
          v-for="(section, index) in productSections"
          :key="section.category.key"
          :category="section.category"
          :products="section.products"
          :color="getCategoryColor(index)"
          @select="openProductModal"
          @add-to-cart="handleAddToCart"
          @buy-now="handleBuyNow"
        />
        
        <!-- Empty State -->
        <div 
          v-if="productSections.length === 0" 
          class="h-full flex flex-col items-center justify-center text-center px-6"
        >
          <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">{{ t.noProducts }}</h3>
          <p class="text-gray-500 max-w-sm">
            {{ t.noProductsDescription }}
          </p>
        </div>
      </template>
    </div>
    
    <!-- Product Detail Modal -->
    <KioskProductDetailModal
      :product="selectedProduct"
      :is-open="isModalOpen"
      :adding-to-cart="addingToCart"
      @close="closeProductModal"
      @add-to-cart="handleAddToCartFromModal"
      @buy-now="handleBuyNowFromModal"
    />
    
    <!-- Floating Cart Button (only shows when cart has items) -->
    <CartFloatingCartButton />
    
    <!-- Toast Notification -->
    <ClientOnly>
      <Teleport to="body">
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="translate-y-full opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-full opacity-0"
        >
          <div 
            v-if="showToast"
            class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-md"
            :class="toastType === 'success' ? 'bg-gray-900 text-white' : 'bg-red-500 text-white'"
          >
            <svg v-if="toastType === 'success'" class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-medium">{{ toastMessage }}</span>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import client from '../../.frontstack/generated-client'

definePageMeta({
  layout: false
})

const router = useRouter()
const { t, initContext, getContextKey, language } = useLanguage()
const { addToCart, initCart, error: cartError } = useShopwareCart()

// Category colors - subtle, muted tones for Apple style
const categoryColors = [
  '#6B7280', // gray
  '#374151', // dark gray
  '#4B5563', // medium gray
  '#1F2937', // charcoal
  '#6B7280', // gray
  '#374151', // dark gray
  '#4B5563', // medium gray
  '#1F2937', // charcoal
]

// Refs
const scrollContainer = ref<HTMLElement | null>(null)

// State
const categories = ref<CategoryCard[]>([])
const products = ref<ProductCard[]>([])
const activeCategoryKey = ref<string | null>(null)
const loadingCategories = ref(true)
const loadingProducts = ref(true)

// Modal state
const selectedProduct = ref<ProductCard | null>(null)
const isModalOpen = ref(false)
const addingToCart = ref(false)

// Toast state
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const loading = computed(() => loadingCategories.value || loadingProducts.value)

// Group products by category
const productSections = computed(() => {
  const sections: { category: CategoryCard; products: ProductCard[] }[] = []
  
  for (const category of categories.value) {
    const categoryProducts = products.value.filter(product => 
      product.categoryIds?.includes(category.key)
    )
    
    if (categoryProducts.length > 0) {
      sections.push({
        category,
        products: categoryProducts
      })
    }
  }
  
  return sections
})

/**
 * Get the Shopware product ID from a product
 * Uses the 'id' field if available, falls back to 'key'
 */
function getShopwareProductId(product: ProductCard): string {
  // Use 'id' field if it exists and is different from 'key'
  // The 'id' field contains the actual Shopware product ID
  return (product as any).id || product.key
}

// Load data function
async function loadData() {
  loadingCategories.value = true
  loadingProducts.value = true
  
  try {
    const contextKey = getContextKey()
    console.log('[Kiosk] Loading data with context:', contextKey)
    
    const [categoriesResponse, productsResponse] = await Promise.all([
      client.listing('CategoryListing', {}, { contextKey }),
      client.listing('AllProductsListing', {}, { contextKey })
    ])
    
    categories.value = categoriesResponse.items || []
    products.value = productsResponse.items || []
    
    console.log('[Kiosk] Categories loaded:', categories.value.length)
    console.log('[Kiosk] Products loaded:', products.value.length)
    
    // Log first product to see id vs key
    if (products.value.length > 0) {
      const firstProduct = products.value[0] as any
      console.log('[Kiosk] First product - id:', firstProduct.id, 'key:', firstProduct.key)
    }
    
    // Set initial active category
    if (categories.value.length > 0 && !activeCategoryKey.value) {
      activeCategoryKey.value = categories.value[0].key
    }
  } catch (error) {
    console.error('[Kiosk] Failed to load data:', error)
  } finally {
    loadingCategories.value = false
    loadingProducts.value = false
  }
}

// Reload data when language changes
async function reloadData() {
  console.log('[Kiosk] Reloading data after language change...')
  await loadData()
}

// Initialize on mount
onMounted(async () => {
  await initContext()
  await Promise.all([
    loadData(),
    initCart()
  ])
})

// Scroll to category section
function scrollToCategory(categoryKey: string) {
  const element = document.getElementById(`category-${categoryKey}`)
  if (element && scrollContainer.value) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Update active category based on scroll position
function handleScroll() {
  if (!scrollContainer.value) return
  
  const container = scrollContainer.value
  const containerTop = container.getBoundingClientRect().top
  
  // Find which section is currently most visible
  for (const section of productSections.value) {
    const element = document.getElementById(`category-${section.category.key}`)
    if (element) {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top - containerTop
      
      // If the section top is near the viewport top (with some threshold)
      if (elementTop <= 100 && elementTop + rect.height > 100) {
        activeCategoryKey.value = section.category.key
        break
      }
    }
  }
}

// Get category color by index
function getCategoryColor(index: number): string {
  return categoryColors[index % categoryColors.length]
}

// Modal functions
function openProductModal(product: ProductCard) {
  console.log('[Kiosk] Opening product modal:', product.name, 'key:', product.key, 'id:', (product as any).id)
  selectedProduct.value = product
  isModalOpen.value = true
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
}

function closeProductModal() {
  isModalOpen.value = false
  selectedProduct.value = null
  
  // Restore body scroll
  document.body.style.overflow = ''
}

// Show toast notification
function showToastNotification(message: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

// Cart & Buy actions from tiles
async function handleAddToCart(product: ProductCard) {
  const shopwareId = getShopwareProductId(product)
  console.log('[Kiosk] Add to cart:', product.name, 'shopwareId:', shopwareId)
  
  const success = await addToCart(shopwareId, 1)
  console.log('[Kiosk] Add to cart result:', success)
  
  if (success) {
    const message = language.value === 'de' 
      ? `${product.name} wurde zum Warenkorb hinzugefügt`
      : `${product.name} added to cart`
    showToastNotification(message, 'success')
  } else {
    const errorMsg = cartError.value || (language.value === 'de' 
      ? `Produkt nicht verfügbar`
      : `Product not available`)
    showToastNotification(errorMsg, 'error')
  }
}

async function handleBuyNow(product: ProductCard) {
  const shopwareId = getShopwareProductId(product)
  console.log('[Kiosk] Buy now:', product.name, 'shopwareId:', shopwareId)
  
  const success = await addToCart(shopwareId, 1)
  
  if (success) {
    router.push('/checkout')
  } else {
    const errorMsg = cartError.value || (language.value === 'de' 
      ? `Produkt nicht verfügbar`
      : `Product not available`)
    showToastNotification(errorMsg, 'error')
  }
}

// Cart & Buy actions from modal
async function handleAddToCartFromModal(product: ProductCard) {
  const shopwareId = getShopwareProductId(product)
  console.log('[Kiosk] Add to cart from modal:', product.name, 'shopwareId:', shopwareId)
  
  addingToCart.value = true
  const success = await addToCart(shopwareId, 1)
  console.log('[Kiosk] Add to cart from modal result:', success)
  addingToCart.value = false
  
  if (success) {
    closeProductModal()
    
    const message = language.value === 'de' 
      ? `${product.name} wurde zum Warenkorb hinzugefügt`
      : `${product.name} added to cart`
    showToastNotification(message, 'success')
  } else {
    const errorMsg = cartError.value || (language.value === 'de' 
      ? `Produkt nicht verfügbar`
      : `Product not available`)
    showToastNotification(errorMsg, 'error')
  }
}

async function handleBuyNowFromModal(product: ProductCard) {
  const shopwareId = getShopwareProductId(product)
  console.log('[Kiosk] Buy now from modal:', product.name, 'shopwareId:', shopwareId)
  
  addingToCart.value = true
  const success = await addToCart(shopwareId, 1)
  addingToCart.value = false
  
  if (success) {
    closeProductModal()
    router.push('/checkout')
  } else {
    const errorMsg = cartError.value || (language.value === 'de' 
      ? `Produkt nicht verfügbar`
      : `Product not available`)
    showToastNotification(errorMsg, 'error')
  }
}
</script>
