<script setup lang="ts">
import type { TimeLogForUI } from '~/types/composites';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  log: { type: Object as PropType<TimeLogForUI | null>, required: true },
  internName: { type: String, default: 'Intern' },
});

const emit = defineEmits(['update:modelValue', 'approve']);

function formatTimeOnly(dateString: string | null) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function formatDuration(hours: number | null | undefined) {
  if (hours === null || hours === undefined) return "0 Hours";
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(hours)} Hours`;
}

function handleApprove() {
  if (props.log) {
    emit('approve', props.log.id);
  }
}

function handleClose() {
  emit('update:modelValue', false);
}
</script>

<template>
    <div 
    v-if="modelValue && log"
    @click.self="handleClose"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >

   <!-- Modal Content -->
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
      <h3 class="font-bold text-lg text-gray-800 mb-4">{{ internName }}</h3>
      
      <!-- Time Details Grid -->
      <div class="grid grid-cols-3 gap-2 mb-6">
        <div>
          <p class="text-xs text-gray-500">Time in</p>
          <p class="font-bold text-gray-900">{{ formatTimeOnly(log.time_in) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Time out</p>
          <p class="font-bold text-gray-900">{{ formatTimeOnly(log.time_out) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Total Hours</p>
          <p class="font-bold text-gray-900">{{ formatDuration(log.total_hours) }}</p>
        </div>
      </div>
      <p class="text-sm text-gray-500 mb-6">
        Overtime (if there is any): 
        <span class="font-bold text-gray-900">{{ formatDuration(log.overtime) }}</span>
      </p>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button class="w-full flex items-center justify-center text-sm font-semibold text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" /></svg>
          Add Remarks
        </button>
        <button 
          @click="handleApprove"
          class="w-full py-3 rounded-lg bg-teal-500 text-white font-bold hover:bg-teal-600 transition-colors"
        >
          Approve
        </button>
      </div>
    </div>
  </div>
</template>