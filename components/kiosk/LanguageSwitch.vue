<template>
  <div class="flex items-center gap-2 bg-neutral-800 rounded-2xl p-2">
    <button
      @click="handleLanguageChange('de')"
      class="px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-200"
      :class="[
        language === 'de'
          ? 'bg-white text-neutral-900'
          : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
      ]"
    >
      🇩🇪 DE
    </button>
    <button
      @click="handleLanguageChange('en')"
      class="px-5 py-3 rounded-xl text-lg font-semibold transition-all duration-200"
      :class="[
        language === 'en'
          ? 'bg-white text-neutral-900'
          : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
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
