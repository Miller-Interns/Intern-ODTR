<script setup lang="ts">
import type { TimeLog } from "~/types/time-logs.ts";

const pendingLogs = ref<TimeLog[]>([
  {
    id: "d8f2b7a9-4b1c-4b8e-9f3d-2c1a8d5b7c6e", // ID is now a string (UUID)
    intern: { id: "intern-007", name: "John Doe" }, // Name is nested under 'intern'
    intern_id: "intern-007",
    timeIn: "2025-07-24T08:00:00.000Z", // time_in is an ISO string
    timeOut: "2025-07-24T17:00:00.000Z", // time_out is an ISO string
    remarks: "Completed the initial setup of the project.",
    status: false, // Pending approval
    admin_id: "admin-123",
  },
  {
    id: "c7e1a6b8-3a2d-4c7f-8e1a-1b9d5c8e7f6a",
    intern: { id: "intern-008", name: "Jane Smith" },
    intern_id: "intern-008",
    timeIn: "2025-07-24T09:00:00.000Z",
    timeOut: "2025-07-24T18:00:00.000Z",
    remarks: null, // Remarks can be null
    status: false,
    admin_id: "admin-123",
  },
]);

function onLogApproved(logId: string) {
  alert(`Log with ID ${logId} has been approved.`);
  pendingLogs.value = pendingLogs.value.filter((log) => log.id !== logId);
}

function approveAll() {
  alert(`Approving all ${pendingLogs.value.length} logs.`);
  pendingLogs.value = [];
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen p-4 sm:p-6">
    <div>
      <header class="mb-8">
        <h1 class="font-serif text-2xl font-light text-gray-700 mb-1">
          Welcome Back Admin Name
        </h1>
        <h2 class="font-serif text-3xl font-light text-gray-900 mb-6">
          Today's Pending Time Log Approvals
        </h2>

        <div class="flex items-center">
          <span class="text-lg text-gray-600">Mon, Jul 23, 2025</span>
          <span
            class="bg-gray-300 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm ml-3"
          >
            {{ pendingLogs.length }}
          </span>
          <button
            @click="approveAll"
            class="ml-auto py-2 px-5 bg-white border border-gray-300 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition-colors"
          >
            Approve All
          </button>
        </div>
      </header>

      <main>
        <TimeLogsContainer
          v-if="pendingLogs.length > 0"
          v-for="log in pendingLogs"
          :key="log.id"
          :log="log"
          @approve="onLogApproved"
        />
        <div
          v-else
          class="text-center py-10 px-4 bg-white rounded-lg border border-gray-200"
        >
          <p class="text-gray-500">No pending approvals.</p>
        </div>
      </main>
    </div>
  </div>
</template>
