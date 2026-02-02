<template>
  <section 
    :id="`category-${category.key}`"
    class="relative border-b border-black"
  >
    <!-- Category Header - Full Width -->
    <div class="flex items-stretch border-b border-black">
      <!-- Category Title - Large Typography -->
      <div class="flex-1 px-8 py-6 flex items-center gap-6">
        <span class="font-mono text-sm text-black/40">
          {{ String(sectionIndex + 1).padStart(2, '0') }}
        </span>
        <h2 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-black uppercase tracking-tight">
          {{ categoryName }}
        </h2>
      </div>
      
      <!-- Product Count -->
      <div class="px-8 py-6 border-l border-black flex items-center justify-center min-w-[120px]">
        <span class="font-mono text-sm text-black/60">
          {{ products.length }} {{ products.length === 1 ? t.product : t.products }}
        </span>
      </div>
    </div>
    
    <!-- Products Grid - Asymmetric Layout -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <KioskProductTile
        v-for="(product, index) in products"
        :key="product.key"
        :product="product"
        :index="index"
        :featured="shouldBeFeatured(index)"
        :tall="shouldBeTall(index)"
        class="border-r border-b border-black last:border-r-0"
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

// Asymmetric layout logic
function shouldBeFeatured(index: number): boolean {
  // First item of each section is featured (larger)
  return index === 0 && props.products.length > 4
}

function shouldBeTall(index: number): boolean {
  // Every 5th item is tall (spans 2 rows)
  return index > 0 && index % 7 === 3 && props.products.length > 6
}
</script>
