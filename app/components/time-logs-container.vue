<script setup lang="ts">
import type { TimeLogForUI } from "../pages/admin-dashboard.vue";

const { log } = defineProps<{ log: TimeLogForUI }>();
const emit = defineEmits(["approve", "edit-remarks"]);

function formatTime(dateString: string | null): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// function calculateTotalHours(startTime: string, endTime: string): number {
//   const start = new Date(startTime).getTime();
//   const end = new Date(endTime).getTime();
//   const diffMilliseconds = Math.abs(end - start);
//   const totalHours = diffMilliseconds / (1000 * 60 * 60);
//   return totalHours;
// }

// function calculateOvertimeHours(
//   totalHours: number,
//   standardWorkdayHours: number = 8
// ): number {
//   const overtimeHours =
//     totalHours > standardWorkdayHours ? totalHours - standardWorkdayHours : 0;
//   return overtimeHours;
// }

function handleApprove() {
  emit("approve", log.id);
}

function handleEditRemarks() {
  emit("edit-remarks", log); // Pass the entire log object back to the parent.
}

</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
    <div class="bg-gray-100 p-4 rounded-md">
      <p class="font-medium text-gray-800 mb-4">{{ log.intern.name }}</p>

      <div class="flex justify-between mb-4">
        <div class="flex flex-col">
          <span class="text-sm text-gray-600 mb-1">Time In</span>
          <span class="font-semibold text-gray-900">{{ log.time_in }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm text-gray-600 mb-1">Time Out</span>
          <span class="font-semibold text-gray-900">{{ log.time_out }}</span>
        </div>
      </div>

      <div v-if="log.time_out" class="flex justify-between">
        <div class="flex flex-col">
          <span class="text-sm text-gray-600 mb-1">Total Hours</span>
          <span class="font-semibold text-gray-900">{{
            log.total_hours?.toFixed(2) ?? '0.00'
          }}</span>
        </div>

       <div class="flex flex-col">
      <span class="text-sm text-gray-500">Overtime (If there is any):</span>
      <span class="font-semibold text-gray-900">
        {{
          log.overtime?.toFixed(2) ?? '0.00' 
        }}
      </span>
    </div>
  </div>
  </div>

    <div v-if="log.remarks" class="mt-4 pt-4 border-t border-gray-200">
      <p class="text-sm text-gray-600 font-semibold">Remarks:</p>
      <p class="text-sm text-gray-800 italic">"{{ log.remarks }}"</p>
    </div>
  </div>

  <div class="flex flex-col mt-4 gap-2">
    <button
      class="w-full py-3 px-4 rounded-md border border-gray-300 bg-transparent text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors"
      @click="handleEditRemarks"
    >
      <span class="font-bold text-lg mr-2">+</span>
      Add/Edit Remarks
    </button>

    <!-- <p>Current Remarks: "{{ existingRemark }}"</p> -->

    
    <button
      @click="handleApprove"
      class="w-full py-3 px-4 rounded-md bg-gray-200 text-gray-600 font-medium hover:bg-gray-300 transition-colors"
    >
      Approve
    </button>
  </div>
</template>
