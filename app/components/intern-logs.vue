<script setup>
const props = defineProps({
  log: { type: Object, required: true },
  // isApproving: { type: Boolean, default: false } 
});

const emit = defineEmits(['open-modal']);

// CORRECTED: Use `log.time_in` which is the correct property from your API.
const formattedDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(new Date(props.log.time_in));

function formatTimeOnly(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(hours) {
  if (hours === null || hours === undefined) return "0 Hours";
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(hours)} Hours`;
}

function handleCardClick() {
  if (props.log.status || props.isApproving) {
    return;
  }
   emit('open-modal', props.log.id);
}

</script>

<template>
  <div 
    @click="handleCardClick"
    :class="[
      'bg-white rounded-xl shadow-md overflow-hidden p-5 transition-all', 
      !log.status ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : '', 
      isApproving && !log.status ? 'opacity-50 pointer-events-none' : ''
    ]"
  >
    <!-- Card Header with Date -->
    <div class="flex items-center text-gray-600 font-semibold mb-4">
       <div class="flex items-center text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      <span>{{ formattedDate }}</span>
    </div>

    <span
        v-if="!log.status"
        class="text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-800"
      >
        Pending Approval
      </span>
      </div>
    

    <!-- Info Grid -->
    <div class="grid grid-cols-3 text-center mb-4">
      <div>
        <span class="text-xs text-gray-500">Time in</span>
        <p class="font-bold text-sm text-gray-900">{{ formatTimeOnly(log.time_in) }}</p>
      </div>
      <div>
        <span class="text-xs text-gray-500">Time out</span>
        <p class="font-bold text-sm text-gray-900">{{ formatTimeOnly(log.time_out) }}</p>
      </div>
      <div>
        <span class="text-xs text-gray-500">Total Hours</span>
        <p class="font-bold text-sm text-gray-900">{{ formatDuration(log.total_hours) }}</p>
      </div>
    </div>
    
    <!-- Overtime & Remarks -->
    <div class="space-y-1 text-sm px-2">
      <div>
        <span class="text-gray-500">Overtime (if there is any):</span>
        <span class="font-bold text-gray-900 ml-2">{{ formatDuration(log.overtime) }}</span>
      </div>
      <div>
        <span class="text-gray-500">Notes/Remarks:</span>
        <span v-if="log.remarks" class="text-gray-800 ml-2 italic">"{{ log.remarks }}"</span>
        <span v-else class="text-gray-400 ml-2">(Optional)</span>
      </div>
    </div>

    <!-- Action Button
    <div class="mt-6">
    
      <button
        v-if="!log.status"
        @click="handleApproveClick"
        :disabled="isApproving"
        class="w-full py-3 px-4 rounded-full bg-yellow-400 text-yellow-900 font-bold text-sm hover:bg-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {{ isApproving ? 'Approving...' : 'Pending Approval' }}
      </button>
    </div> -->
  </div>
</template>