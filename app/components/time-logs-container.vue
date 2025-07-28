<script setup lang="ts">
import type { TimeLogForUI } from "../pages/admin/dashboard.vue";

const { log } = defineProps<{ log: TimeLogForUI }>();
const emit = defineEmits(["approve", "edit-remarks"]);

function formatTimeOnly(dateString: string | null): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(hours: number | null | undefined): string {
  if (hours === null || hours === undefined) return "0 Hours";
  // Use Intl.NumberFormat to handle decimals nicely and avoid unnecessary trailing zeros.
  const formattedHours = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2, // Allow up to two decimal places
  }).format(hours);
  return `${formattedHours} Hours`;
}


function handleApprove() {
  emit("approve", log.id);
}

function handleEditRemarks() {
  emit("edit-remarks", log); // Pass the entire log object back to the parent.
}

</script>

<template>
  <!-- Main Card Container -->
  <div class="bg-white rounded-xl shadow-md overflow-hidden p-5">
    <!-- Intern Name -->
    <p class="font-bold text-gray-800 text-lg mb-4">{{ log.intern.name }}</p>

    <!-- Info Grid -->
    <div class="grid grid-cols-3 text-center mb-4">
      <div>
        <span class="text-xs text-gray-500">Time in</span>
        <p class="font-bold text-gray-900">{{ formatTimeOnly(log.time_in) }}</p>
      </div>
      <div>
        <span class="text-xs text-gray-500">Time out</span>
        <p class="font-bold text-gray-900">{{ formatTimeOnly(log.time_out) }}</p>
      </div>
      <div>
        <span class="text-xs text-gray-500">Total Hours</span>
        <p class="font-bold text-gray-900">{{  formatDuration(log.total_hours)  }}</p>
      </div>
    </div>   
        
     <div class="text-sm px-2">
      <span class="text-gray-500">Overtime (if there is any):</span>
      <!-- Value is now adjacent with a left margin -->
      <span class="font-bold text-gray-900 ml-2">{{ formatDuration(log.overtime)  }}</span>
    </div>

    <!-- Remarks Display (optional) -->
    <div v-if="log.remarks" class="mt-4 pt-3 border-t border-gray-100">
      <p class="text-xs text-gray-500 font-semibold">Remarks:</p>
      <p class="text-sm text-gray-700 italic">"{{ log.remarks }}"</p>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex flex-col gap-3">
       <button
        @click="handleEditRemarks"
        class="w-full py-3 px-4 rounded-full border border-gray-300 bg-transparent text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold text-sm"
      >
        <!-- Plus Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add/Edit Remarks
      </button>

      <button
        @click="handleApprove"
        class="w-full py-3 px-4 rounded-full bg-teal-500 text-white font-bold hover:bg-teal-600 transition-colors shadow-sm"
      >
        Approve
      </button>
    </div>
  </div>
</template>
