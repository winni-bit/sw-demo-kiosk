<template>
  <section 
    :id="`category-${category.key}`"
    class="relative min-h-[200px] bg-white border-b border-gray-100"
  >
    <div class="flex">
      <!-- Vertical Category Label -->
      <div class="w-14 flex-shrink-0 bg-gray-900 flex items-center justify-center relative">
        <span 
          class="text-white text-sm font-medium tracking-widest uppercase whitespace-nowrap"
          style="writing-mode: vertical-rl; text-orientation: mixed; transform: rotate(180deg);"
        >
          {{ categoryName }}
        </span>
      </div>
      
      <!-- Section Content -->
      <div class="flex-1 py-8 px-6">
        <!-- Products Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <KioskProductTile
            v-for="product in products"
            :key="product.key"
            :product="product"
            @click="$emit('select', product)"
            @add-to-cart="$emit('addToCart', product)"
            @buy-now="$emit('buyNow', product)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  category: CategoryCard
  products: ProductCard[]
  color: string
}>()

defineEmits<{
  select: [product: ProductCard]
  addToCart: [product: ProductCard]
  buyNow: [product: ProductCard]
}>()

const categoryName = computed(() => {
  if (props.category.breadcrumb && props.category.breadcrumb.length > 0) {
    return props.category.breadcrumb[props.category.breadcrumb.length - 1]
  }
  return props.category.title || 'Kategorie'
})
</script>
