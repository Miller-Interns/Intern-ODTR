<template>
  <div class="relative">
    <UButton
      to="/batches/edit-batch" 
      icon="i-lucide-pen"
      variant="ghost"
      color="primary"
      class="absolute top-0 right-0"
    />
    <div class="space-y-4">
      <div>
        <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">No. of Interns</h3>
        <p class="text-sm font-medium text-gray-900 dark:text-white"> {{ internsCountText }} </p>
      </div>    
      <div>
        <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Start Date</h3>
        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ batchData?.details.startDate }}</p>
      </div>
      
      <div>
        <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">Intern Supervisor</h3>
        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ batchData?.details.supervisorName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BatchDetailsData } from '~/types/crud-for-interns/Batch';

const props = defineProps<{
    batchData: BatchDetailsData | null
}>();

const internsCountText = computed(() => {
  if (!props.batchData) {
    return '0 Interns Added';
  }

  const count = props.batchData.details.internCount;

  if (count === 1) {
    return '1 Intern Added';
  }
  return `${count} Interns Added`;
});
</script>