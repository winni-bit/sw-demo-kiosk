<template>
  <div class="flex items-center border border-black">
    <button
      @click="handleLanguageChange('de')"
      class="px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200"
      :class="[
        language === 'de'
          ? 'bg-black text-white'
          : 'bg-white text-black hover:bg-gray-100'
      ]"
    >
      DE
    </button>
    <button
      @click="handleLanguageChange('en')"
      class="px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-200 border-l border-black"
      :class="[
        language === 'en'
          ? 'bg-black text-white'
          : 'bg-white text-black hover:bg-gray-100'
      ]"
    >
      EN
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
