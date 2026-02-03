<template>
  <div class="space-y-3">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      class="block font-mono text-sm uppercase tracking-wider text-black/60"
    >
      {{ label }}
      <span v-if="required" class="text-accent">*</span>
    </label>
    
    <!-- Input Container -->
    <div class="relative">
      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
        class="w-full bg-white border-2 text-black placeholder-black/30 focus:outline-none transition-all touch-manipulation"
        :class="[
          // Size classes
          sizeClasses,
          // State classes
          error 
            ? 'border-accent focus:border-accent' 
            : success
              ? 'border-green-500 focus:border-green-500'
              : 'border-black focus:border-accent',
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          // Right padding for icons
          (error || success || showPasswordToggle) && 'pr-14',
        ]"
      />
      
      <!-- Status Icons / Password Toggle -->
      <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <!-- Password Toggle -->
        <button
          v-if="showPasswordToggle"
          type="button"
          @click="togglePassword"
          class="p-2 text-black/40 hover:text-black transition-colors touch-manipulation"
        >
          <svg v-if="showPassword" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        
        <!-- Error Icon -->
        <svg 
          v-else-if="error" 
          class="w-6 h-6 text-accent" 
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
    <p v-if="error && typeof error === 'string'" class="text-accent text-sm font-sans">
      {{ error }}
    </p>
    
    <!-- Help Text -->
    <p v-else-if="helpText" class="text-black/50 text-sm font-sans">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'search'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  autocomplete?: string
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  error?: string | boolean
  success?: boolean
  helpText?: string
  size?: 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  success: false,
  size: 'lg',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}>()

// Generate unique ID
const inputId = computed(() => `kiosk-input-${Math.random().toString(36).substr(2, 9)}`)

// Password visibility toggle
const showPassword = ref(false)
const showPasswordToggle = computed(() => props.type === 'password')
const computedType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

// Size classes for touch-friendly sizing
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xl':
      return 'px-6 py-5 text-xl min-h-[72px]'
    case 'lg':
      return 'px-5 py-4 text-lg min-h-[64px]'
    case 'md':
    default:
      return 'px-4 py-3 text-base min-h-[52px]'
  }
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}
</script>
