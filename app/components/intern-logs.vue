<script setup>
const props = defineProps({
  log: { type: Object, required: true },
});

const formattedDate = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric'
}).format(new Date(props.log.date));

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
</script>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden p-5">
    <!-- Card Header with Date -->
    <div class="flex items-center text-gray-600 font-semibold mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      <span>{{ formattedDate }}</span>
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

    <!-- Action Button -->
    <div class="mt-6">
      <!-- Pending Button -->
      <button
        v-if="log.status === 'pending'"
        class="w-full py-3 px-4 rounded-full bg-yellow-400 text-yellow-900 font-bold text-sm"
      >
        Pending Approval
      </button>

      <!-- Export DTR Button -->
      <button
        v-if="log.status === 'approved'"
        class="w-full py-3 px-4 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors shadow-sm text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Export DTR
      </button>
    </div>
  </div>
</template>