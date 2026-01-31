<template>
  <nav class="bg-white shadow-sm p-4">
    <div class="flex justify-between items-center">
      <NuxtLink to="/" class="text-xl font-bold text-gray-900">
        Store
      </NuxtLink>
      
      <div class="flex space-x-6">
        <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">
          Home
        </NuxtLink>
        <NuxtLink to="/cart" class="text-gray-600 hover:text-gray-900 flex items-center gap-1">
          Cart
          <span v-if="cartItemCount > 0" class="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
            {{ cartItemCount }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const { items } = useCart()

const cartItemCount = computed(() => items.value.length)
</script>
