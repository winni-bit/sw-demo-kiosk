<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    :class="[
      'block border-2 border-black transition-all touch-manipulation',
      // Clickable styles
      (to || clickable) && 'cursor-pointer hover:bg-black hover:text-white group',
      // Padding based on size
      paddingClasses,
      // Custom classes
      $attrs.class,
    ]"
    @click="clickable && $emit('click', $event)"
  >
    <!-- Number Badge -->
    <span 
      v-if="number !== undefined" 
      class="font-mono text-xs text-black/40 group-hover:text-white/40 block mb-3"
    >
      {{ String(number).padStart(2, '0') }}
    </span>
    
    <!-- Title -->
    <h3 
      v-if="title" 
      :class="[
        'font-display font-bold text-black uppercase group-hover:text-white',
        titleSizeClasses,
      ]"
    >
      {{ title }}
    </h3>
    
    <!-- Subtitle / Description -->
    <p 
      v-if="subtitle" 
      :class="[
        'font-sans text-black/50 group-hover:text-white/50 mt-2',
        subtitleSizeClasses,
      ]"
    >
      {{ subtitle }}
    </p>
    
    <!-- Custom Content Slot -->
    <slot />
    
    <!-- Footer Slot -->
    <div v-if="$slots.footer" class="mt-4">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink')

interface Props {
  to?: string
  clickable?: boolean
  number?: number
  title?: string
  subtitle?: string
  size?: 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  size: 'lg',
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const paddingClasses = computed(() => {
  switch (props.size) {
    case 'xl':
      return 'p-8'
    case 'lg':
      return 'p-6'
    case 'md':
    default:
      return 'p-5'
  }
})

const titleSizeClasses = computed(() => {
  switch (props.size) {
    case 'xl':
      return 'text-3xl'
    case 'lg':
      return 'text-2xl'
    case 'md':
    default:
      return 'text-xl'
  }
})

const subtitleSizeClasses = computed(() => {
  switch (props.size) {
    case 'xl':
      return 'text-base'
    case 'lg':
      return 'text-sm'
    case 'md':
    default:
      return 'text-sm'
  }
})
</script>
