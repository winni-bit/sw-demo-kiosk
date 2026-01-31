<template>
  <div class="space-y-2">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="selectId" 
      class="block text-lg font-medium text-neutral-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    
    <!-- Select Container -->
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :required="required"
        :disabled="disabled"
        @change="onChange"
        @blur="onBlur"
        class="w-full px-5 py-4 bg-neutral-800 border rounded-xl text-white text-lg appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
        :class="[
          error 
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
            : success
              ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
              : 'border-neutral-700 focus:ring-white/20 focus:border-neutral-500',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          !modelValue ? 'text-neutral-500' : '',
        ]"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
          class="text-white bg-neutral-800"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- Chevron Icon -->
      <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg 
          class="w-5 h-5 text-neutral-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    
    <!-- Error Message -->
    <p v-if="error" class="text-red-400 text-sm mt-1">
      {{ error }}
    </p>
    
    <!-- Help Text -->
    <p v-else-if="helpText" class="text-neutral-500 text-sm mt-1">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: SelectOption[]
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  success?: boolean
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  success: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
}>()

// Generate unique ID
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}
</script>
