<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Initialize auth on app start
const { initAuth } = useShopwareAuth()

onMounted(async () => {
  await initAuth()
})
</script>
