<template #header>
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
        <h3 class="text-xs font-medium text-black dark:text-white">No. of Interns</h3>
        <p class="text-sm font-medium text-black dark:text-white"> {{ internsCountText }} </p>
      </div>    
      <div>
        <h3 class="text-xs font-medium text-black dark:text-white">Start Date</h3>
        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ batchData.details.start_date }}</p>
      </div>
      
      <div>
        <h3 class="text-xs font-medium text-black dark:text-white">Intern Supervisor</h3>
        <p class="text-sm font-medium text-black dark:text-white">{{ batchData.details.supervisor }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BatchData } from '~/interfaces/interfaces';

const props = defineProps<{
    batchData: BatchData
}>();

const internsCountText = computed(() => {
  const count = props.batchData.details.internCount;

  if (count === 1) {
    return '1 Intern Added';
  }
  return `${count} Interns Added`;
});
</script>