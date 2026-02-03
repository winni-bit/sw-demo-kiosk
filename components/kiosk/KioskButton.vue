<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :type="!to ? type : undefined"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-3 font-sans font-semibold uppercase tracking-widest transition-all touch-manipulation',
      // Size variants
      sizeClasses,
      // Variant styles
      variantClasses,
      // Disabled state
      (disabled || loading) && 'opacity-50 cursor-not-allowed',
      // Full width
      fullWidth && 'w-full',
    ]"
    @click="!disabled && !loading && $emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <svg 
      v-if="loading" 
      class="animate-spin flex-shrink-0"
      :class="size === 'xl' ? 'w-7 h-7' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'"
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    
    <!-- Icon Slot (Left) -->
    <slot name="icon-left" />
    
    <!-- Button Text -->
    <span><slot /></span>
    
    <!-- Icon Slot (Right) -->
    <slot name="icon-right" />
  </component>
</template>

<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink')

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  size?: 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  to?: string
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'lg',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xl':
      return 'px-10 py-6 text-xl min-h-[72px]'
    case 'lg':
      return 'px-8 py-5 text-lg min-h-[64px]'
    case 'md':
    default:
      return 'px-6 py-4 text-base min-h-[56px]'
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-black text-white hover:bg-accent'
    case 'secondary':
      return 'bg-gray-100 text-black hover:bg-gray-200'
    case 'outline':
      return 'border-2 border-black text-black hover:bg-black hover:text-white'
    case 'ghost':
      return 'text-black hover:bg-gray-100'
    case 'accent':
      return 'bg-accent text-white hover:bg-accent-dark'
    default:
      return 'bg-black text-white hover:bg-accent'
  }
})
</script>
