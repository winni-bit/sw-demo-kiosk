<template>
  <div class="min-h-screen bg-white overflow-x-hidden">
    <!-- Category Navigation Header -->
    <KioskCategoryNav
      :categories="categories"
      :active-key="activeCategoryKey"
      :loading="loadingCategories"
      @select="scrollToCategory"
      @language-change="reloadData"
    />
    
    <!-- Main Content -->
    <main ref="scrollContainer" @scroll="handleScroll">
      <!-- Loading State -->
      <div v-if="loading" class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 border-2 border-black border-t-accent animate-spin mx-auto mb-6" />
          <p class="font-mono text-sm text-black/50 uppercase tracking-widest">Loading</p>
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
          :section-index="index"
          @select="openProductModal"
          @add-to-cart="handleAddToCart"
          @buy-now="handleBuyNow"
        />
        
        <!-- Empty State -->
        <div 
          v-if="productSections.length === 0" 
          class="min-h-[60vh] flex flex-col items-center justify-center text-center px-8"
        >
          <div class="w-32 h-32 border-2 border-black/20 flex items-center justify-center mb-8">
            <span class="font-display text-6xl text-black/20">∅</span>
          </div>
          <h3 class="font-display text-3xl font-bold text-black mb-4">{{ t.noProducts }}</h3>
          <p class="font-sans text-black/50 max-w-md">
            {{ t.noProductsDescription }}
          </p>
        </div>
      </template>
      
      <!-- Footer -->
      <footer class="border-t border-black py-12 px-8">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="font-display text-2xl font-bold text-black uppercase">
            KIOSK<span class="text-accent">.</span>
          </div>
          <p class="font-mono text-xs text-black/40 uppercase tracking-wider">
            © {{ new Date().getFullYear() }} — Brutalist Editorial Design
          </p>
        </div>
      </footer>
    </main>
    
    <!-- Product Detail Modal -->
    <KioskProductDetailModal
      :product="selectedProduct"
      :is-open="isModalOpen"
      :adding-to-cart="addingToCart"
      @close="closeProductModal"
      @add-to-cart="handleAddToCartFromModal"
      @buy-now="handleBuyNowFromModal"
    />
    
    <!-- Floating Cart Button -->
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
            class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-8 py-4 flex items-center gap-4 max-w-md"
            :class="toastType === 'success' ? 'bg-black text-white' : 'bg-accent text-white'"
          >
            <svg v-if="toastType === 'success'" class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span class="font-sans font-medium">{{ toastMessage }}</span>
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

// Category colors
const categoryColors = ['#000000', '#1a1a1a', '#333333', '#4d4d4d']

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

function getShopwareProductId(product: ProductCard): string {
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

async function reloadData() {
  console.log('[Kiosk] Reloading data after language change...')
  await loadData()
}

onMounted(async () => {
  await initContext()
  await Promise.all([
    loadData(),
    initCart()
  ])
  
  // Set up scroll listener on window for detecting active category
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

function scrollToCategory(categoryKey: string) {
  // First, immediately set the active category key when clicked
  activeCategoryKey.value = categoryKey
  
  // Then scroll to the category section
  const element = document.getElementById(`category-${categoryKey}`)
  if (element) {
    // Account for fixed header height (approximately 120px)
    const headerOffset = 130
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

function handleScroll() {
  // Don't update during programmatic scrolling to avoid flickering
  const headerOffset = 150
  
  for (const section of productSections.value) {
    const element = document.getElementById(`category-${section.category.key}`)
    if (element) {
      const rect = element.getBoundingClientRect()
      // Check if the section is in the viewport (accounting for header)
      if (rect.top <= headerOffset && rect.bottom > headerOffset) {
        activeCategoryKey.value = section.category.key
        break
      }
    }
  }
}

function getCategoryColor(index: number): string {
  return categoryColors[index % categoryColors.length]
}

function openProductModal(product: ProductCard) {
  selectedProduct.value = product
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeProductModal() {
  isModalOpen.value = false
  selectedProduct.value = null
  document.body.style.overflow = ''
}

function showToastNotification(message: string, type: 'success' | 'error' = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 4000)
}

async function handleAddToCart(product: ProductCard) {
  const shopwareId = getShopwareProductId(product)
  const success = await addToCart(shopwareId, 1)
  
  if (success) {
    const message = language.value === 'de' 
      ? `${product.name} wurde hinzugefügt`
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

async function handleAddToCartFromModal(product: ProductCard) {
  const shopwareId = getShopwareProductId(product)
  addingToCart.value = true
  const success = await addToCart(shopwareId, 1)
  addingToCart.value = false
  
  if (success) {
    closeProductModal()
    const message = language.value === 'de' 
      ? `${product.name} wurde hinzugefügt`
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
