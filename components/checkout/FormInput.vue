<template>
  <div class="space-y-2">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      class="block text-lg font-medium text-neutral-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    
    <!-- Input Container -->
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        @input="onInput"
        @blur="onBlur"
        class="w-full px-5 py-4 bg-neutral-800 border rounded-xl text-white text-lg placeholder-neutral-500 focus:outline-none focus:ring-2 transition-all"
        :class="[
          error 
            ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
            : success
              ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
              : 'border-neutral-700 focus:ring-white/20 focus:border-neutral-500',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
      />
      
      <!-- Status Icons -->
      <div class="absolute right-4 top-1/2 -translate-y-1/2">
        <!-- Error Icon -->
        <svg 
          v-if="error" 
          class="w-6 h-6 text-red-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        <!-- Success Icon -->
        <svg 
          v-else-if="success" 
          class="w-6 h-6 text-green-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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
interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  error?: string
  success?: boolean
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  success: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
}>()

// Generate unique ID
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}
</script>
