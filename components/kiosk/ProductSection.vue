<template>
  <section 
    :id="`category-${category.key}`"
    class="relative border-b border-black"
  >
    <!-- Category Header - Full Width -->
    <div class="flex items-stretch border-b border-black">
      <!-- Category Title - Large Typography -->
      <div class="flex-1 px-4 py-4 md:px-8 md:py-6 flex items-center gap-3 md:gap-6">
        <span class="font-mono text-xs md:text-sm text-black/40">
          {{ String(sectionIndex + 1).padStart(2, '0') }}
        </span>
        <h2 class="font-display text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black uppercase tracking-tight">
          {{ categoryName }}
        </h2>
      </div>
      
      <!-- Product Count -->
      <div class="px-4 py-4 md:px-8 md:py-6 border-l border-black flex items-center justify-center min-w-[80px] md:min-w-[120px]">
        <span class="font-mono text-xs md:text-sm text-black/60">
          {{ products.length }} {{ products.length === 1 ? t.product : t.products }}
        </span>
      </div>
    </div>
    
    <!-- Products Grid - Responsive Layout -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <KioskProductTile
        v-for="(product, index) in products"
        :key="product.key"
        :product="product"
        :index="index"
        :featured="shouldBeFeatured(index)"
        :tall="shouldBeTall(index)"
        class="border-r border-b border-black last:border-r-0 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(4n)]:border-r-0 xl:[&:nth-child(4n)]:border-r xl:[&:nth-child(5n)]:border-r-0"
        @click="$emit('select', product)"
        @add-to-cart="$emit('addToCart', product)"
        @buy-now="$emit('buyNow', product)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  category: CategoryCard
  products: ProductCard[]
  color: string
  sectionIndex?: number
}>()

defineEmits<{
  select: [product: ProductCard]
  addToCart: [product: ProductCard]
  buyNow: [product: ProductCard]
}>()

const { language } = useLanguage()

const translations = {
  de: { product: 'Produkt', products: 'Produkte' },
  en: { product: 'Product', products: 'Products' }
}

const t = computed(() => translations[language.value])

const categoryName = computed(() => {
  if (props.category.breadcrumb && props.category.breadcrumb.length > 0) {
    return props.category.breadcrumb[props.category.breadcrumb.length - 1]
  }
  return props.category.title || 'Kategorie'
})

// Asymmetric layout logic - only on desktop
function shouldBeFeatured(index: number): boolean {
  return false // Disabled for consistent layout
}

function shouldBeTall(index: number): boolean {
  return false // Disabled for consistent layout
}
</script>
