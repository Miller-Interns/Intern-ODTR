<script setup lang="ts">
import type { TimeLog } from "~/types/time-logs.ts";

const { log } = defineProps<{ log: TimeLog }>();
const emit = defineEmits(["approve"]);

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function calculateTotalHours(startTime: string, endTime: string): string {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diffMilliseconds = Math.abs(end - start);
  const diffHours = diffMilliseconds / (1000 * 60 * 60);

  // Return formatted string, e.g., "9.0 Hours" or "8.5 Hours"
  return `${diffHours.toFixed(2)} Hours`;
}

function handleApprove() {
  alert(`Approving for ${log.intern.name}`);
  emit("approve", log.id);
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
    <div class="bg-gray-100 p-4 rounded-md">
      <p class="font-medium text-gray-800 mb-4">{{ log.intern.name }}</p>

      <div class="flex justify-between mb-4">
        <div class="flex flex-col">
          <span class="text-sm text-gray-600 mb-1">Time in</span>
          <span class="font-semibold text-gray-900">{{ log.timeIn }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-600 mb-1">Time out</span>
          <span class="font-semibold text-gray-900">{{ log.timeOut }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-600 mb-1">Total Hours</span>
          <span class="font-semibold text-gray-900">{{
            calculateTotalHours(log.timeIn, log.timeOut)
          }}</span>
        </div>
      </div>
      <p class="text-sm text-gray-500">Overtime (If there is any):</p>
    </div>

    <div v-if="log.remarks" class="mt-4 pt-4 border-t border-gray-200">
      <p class="text-sm text-gray-600 font-semibold">Remarks:</p>
      <p class="text-sm text-gray-800 italic">"{{ log.remarks }}"</p>
    </div>
  </div>

  <div class="flex flex-col mt-4 gap-2">
    <button
      class="w-full py-3 px-4 rounded-md border border-gray-300 bg-transparent text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors"
    >
      <span class="font-bold text-lg mr-2">+</span>
      Add Remarks
    </button>
    <button
      @click="handleApprove"
      class="w-full py-3 px-4 rounded-md bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors"
    >
      Approve
    </button>
  </div>
</template>
