<template>
  <div class="flex items-center gap-4 sm:gap-6">
    <template v-if="intern">
      <div class="relative flex-shrink-0">
        <UAvatar :src="previewSrc || intern.internPicture || undefined" :alt="intern.fullName || 'Intern Avatar'" size="3xl" />
        <div v-if="isEditing" class="absolute bottom-0 -right-1">
          <UButton
            icon="i-heroicons-camera-solid"
            size="sm"
            color="primary"
            square
            variant="solid"
            class="rounded-full"
            aria-label="Change profile picture"
            @click="triggerFileInput"
          />
          <input ref="fileInput" type="file" @change="handleFileUpload" accept="image/*" class="hidden" />
        </div>
      </div>
      <div class="w-full">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-2xl font-bold text-black dark:text-white">{{ intern.fullName }}</h1>
          <UToggle
            :model-value="isCompleted"
            @update:model-value="toggleCompletedStatus"
            :disabled="!isEditing"
            on-icon="i-heroicons-check-20-solid"
            off-icon="i-heroicons-x-mark-20-solid"
          />
        </div>

        <StatusBadge :status="intern.status || 'INCOMING'"/>  
        
        <p class="text-black dark:text-white">{{ intern.role }}</p>
        <p class="text-sm text-black dark:text-white">
          {{ intern.course }} - {{ intern.year }} | {{ intern.school }}
        </p>
        <div class="mt-2">
          <p class="text-sm text-black dark:text-white">
            Hours Completed: {{ intern.hoursCompleted ?? 0 }} / {{ intern.requiredHours }}
          </p>
          <UMeter :value="intern.hoursCompleted ?? 0" :max="intern.requiredHours" class="mt-1" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { UAvatar, UBadge, UButton } from '#components'
import type { PropType } from 'vue'
import { ref, computed } from 'vue'
import type { InternDetails } from '~/types/Intern'

const props = defineProps({
  intern: {
    type: Object as PropType<Partial<InternDetails>>,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  },
  previewSrc: {
    type: String as PropType<string | null>,
    default: null
  }
})

const emit = defineEmits(['update:status', 'upload-picture'])
const fileInput = ref<HTMLInputElement | null>(null)

const isCompleted = computed(() => props.intern?.status === 'COMPLETED')

function toggleCompletedStatus(isCompleted: boolean) {
  emit('update:status', isCompleted ? 'COMPLETED' : 'ONGOING')
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  emit('upload-picture', file)
}
</script>