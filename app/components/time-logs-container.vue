<script setup lang="ts">
import { ref } from 'vue';
import type { TimeLogForUI } from "../types/composites.js";

const { log } = defineProps<{ log: TimeLogForUI }>();
const emit = defineEmits(["approve-with-remarks"]);

const isEditingRemarks = ref(false);
const remarksText = ref(log.remarks || "");

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
  const formattedHours = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2, // Allow up to two decimal places
  }).format(hours);
  return `${formattedHours} Hours`;
}

function handleApprove() {
  emit("approve-with-remarks", {
    id: log.id,
    remarks: remarksText.value,
  });
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden p-5">
    <p class="font-bold text-gray-800 text-lg mb-4">{{ log.intern.name }}</p>

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
      <span class="font-bold text-gray-900 ml-2">{{ formatDuration(log.overtime)  }}</span>
    </div>

    <div v-if="isEditingRemarks" class="mt-4">
      <label for="remarks" class="block text-sm font-semibold text-gray-800 mb-2">
        Note/Remarks: 
      </label>
      <textarea
        id="remarks"
        v-model="remarksText"
        rows="4"
        class="w-full bg-white border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Note and Remarks"
      ></textarea>
    </div>

    <!-- Remarks Display (optional) -->
    <div v-if="log.remarks" class="mt-4 pt-3 border-t border-gray-100">
      <p class="text-xs text-gray-500 font-semibold">Remarks:</p>
      <p class="text-sm text-gray-700 italic">"{{ log.remarks }}"</p>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex flex-col gap-3">
       <button
        v-if="!isEditingRemarks"
        @click="isEditingRemarks = true"
        class="w-full py-3 px-4 rounded-lg border border-gray-300 bg-transparent text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors font-semibold text-sm"
      >
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
