<template>
  <button
    type="button"
    @click="$emit('select')"
    class="w-full p-5 rounded-xl border-2 transition-all text-left"
    :class="[
      selected 
        ? 'border-white bg-white/5' 
        : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600',
    ]"
  >
    <div class="flex items-start gap-4">
      <!-- Radio Circle -->
      <div 
        class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
        :class="selected ? 'border-white' : 'border-neutral-600'"
      >
        <div 
          v-if="selected" 
          class="w-3 h-3 rounded-full bg-white"
        />
      </div>
      
      <!-- Content -->
      <div class="flex-1">
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div 
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="selected ? 'bg-white/10' : 'bg-neutral-700'"
          >
            <img 
              v-if="method.media?.url" 
              :src="method.media.url" 
              :alt="method.name"
              class="w-8 h-8 object-contain"
            />
            <svg 
              v-else 
              class="w-6 h-6 text-neutral-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          
          <!-- Name -->
          <div>
            <h3 class="text-lg font-semibold text-white">{{ method.name }}</h3>
            <p v-if="method.description" class="text-sm text-neutral-400 mt-0.5 line-clamp-2">
              {{ method.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { ShopwarePaymentMethod } from '~/types/shopware'

interface Props {
  method: ShopwarePaymentMethod
  selected?: boolean
}

defineProps<Props>()

defineEmits<{
  select: []
}>()
</script>
