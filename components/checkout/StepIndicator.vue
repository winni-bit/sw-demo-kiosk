<template>
  <div class="flex items-center justify-center gap-2">
    <template v-for="(step, index) in steps" :key="step.id">
      <!-- Step -->
      <button
        type="button"
        @click="$emit('go-to-step', step.id)"
        :disabled="!canGoToStep(step.id)"
        class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all"
        :class="[
          currentStep === step.id 
            ? 'bg-white text-neutral-900' 
            : isStepCompleted(step.id)
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              : 'bg-neutral-800 text-neutral-500',
          canGoToStep(step.id) ? 'cursor-pointer' : 'cursor-not-allowed',
        ]"
      >
        <!-- Step Number / Check -->
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
          :class="[
            currentStep === step.id 
              ? 'bg-neutral-900 text-white' 
              : isStepCompleted(step.id)
                ? 'bg-green-500 text-white'
                : 'bg-neutral-700 text-neutral-400',
          ]"
        >
          <svg 
            v-if="isStepCompleted(step.id) && currentStep !== step.id" 
            class="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ step.id }}</span>
        </div>
        
        <!-- Step Label (hidden on mobile) -->
        <span class="hidden sm:inline font-medium">{{ step.label }}</span>
      </button>
      
      <!-- Connector Line -->
      <div 
        v-if="index < steps.length - 1"
        class="w-8 h-0.5 mx-1"
        :class="isStepCompleted(step.id) ? 'bg-green-500' : 'bg-neutral-700'"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
interface Step {
  id: number
  label: string
}

interface Props {
  steps: Step[]
  currentStep: number
  completedSteps: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'go-to-step': [step: number]
}>()

function isStepCompleted(stepId: number): boolean {
  return props.completedSteps.includes(stepId)
}

function canGoToStep(stepId: number): boolean {
  // Can always go to current step
  if (stepId === props.currentStep) return true
  
  // Can go to previous steps
  if (stepId < props.currentStep) return true
  
  // Can go to next step only if current is completed
  if (stepId === props.currentStep + 1 && isStepCompleted(props.currentStep)) return true
  
  return false
}
</script>
