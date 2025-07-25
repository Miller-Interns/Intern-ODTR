<script setup lang="ts">
import { ref } from 'vue'

// Define the TimeLogForUI type for use in the component
export type TimeLogForUI = {
  id: string;
  intern: { // This property is required
    id: string;
    name: string;
  };
  intern_id: string;
  time_in: string;    // In the UI, it's just a string or Date
  time_out: string | null;
  overtime?: number | null; // Optional because it can be missing
  remarks: string | null;
  status: boolean;
  admin_id: string;
  total_hours: number; // Optional because it can be missing
};

const { data: pendingLogs, pending, error, refresh } = await useFetch<TimeLogForUI[]>('/api/pending-logs')

function onLogApproved(logId: string) {
  alert(`Log with ID ${logId} has been approved.`);

if (pendingLogs.value) {
    pendingLogs.value = pendingLogs.value.filter((log) => log.id !== logId);
  }
  // TODO: In a real application, you would now call another API
  // to tell the database to update the log's status to 'true'.
  // Example: $fetch(`/api/approve-log/${logId}`, { method: 'POST' });
}

function approveAll() {
 alert(`Approving all ${pendingLogs.value?.length || 0} logs.`);

 if (pendingLogs.value) {
    pendingLogs.value = [];
  }
  // TODO: In a real application, you would call an API to approve all.
  // Example: $fetch('/api/approve-all-logs', { method: 'POST' });
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
            {{ pendingLogs?.length || 0 }}
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
  <div v-if="pending" class="text-center py-10">
    <p class="text-gray-500">Loading Pending Logs...</p>
  </div>

  <div v-else-if="error" class="text-center py-10 px-4 bg-red-50 rounded-lg border border-red-200">
    <p class="font-semibold text-red-700">Failed to load data</p>
    <p class="text-sm text-red-600 mt-1">{{ error.message }}</p>
  </div>

       <template v-else-if="pendingLogs && pendingLogs.length > 0">
          <TimeLogsContainer
            v-for="log in pendingLogs"
            :key="log.id"
            :log="log"
            @approve="onLogApproved"
          />
        </template>
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
