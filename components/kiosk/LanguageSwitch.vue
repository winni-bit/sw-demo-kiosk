<template>
  <div class="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
    <button
      @click="handleLanguageChange('de')"
      class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      :class="[
        language === 'de'
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      ]"
    >
      🇩🇪 DE
    </button>
    <button
      @click="handleLanguageChange('en')"
      class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      :class="[
        language === 'en'
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
      ]"
    >
      🇬🇧 EN
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  change: [language: 'de' | 'en']
}>()

const { language, setLanguage } = useLanguage()

async function handleLanguageChange(lang: 'de' | 'en') {
  await setLanguage(lang)
  emit('change', lang)
}
</script>
