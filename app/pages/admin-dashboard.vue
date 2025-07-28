<script setup lang="ts">

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

const { data: pendingLogs, pending, error, refresh } = useFetch<TimeLogForUI[]>('/api/approval/log');
const editingLog = ref<TimeLogForUI | null>(null);
const remarkText = ref<string>('');

async function onLogApproved(logId: string) {
  try {
  await $fetch('/api/approval/approval', {
      method: 'PATCH',
      body: {
        logId: logId,
        status: true, // The action is to approve (set status to true)
      },
    });
 alert(`Log with ID ${logId} has been approved.`);
 await refresh();
 } catch (e) {
    console.error('Failed to approve log:', e);
    alert('Failed to approve the log. Please try again.');
  }
}

// function openRemarkModal(log: TimeLogForUI) {
//   editingLog.value = log;
//   remarkText.value = log.remarks || ''; // Pre-fill with existing remarks
// }

async function submitRemark() {
  if (!editingLog.value) return;

  try {
    await $fetch('/api/approval/approval', {
      method: 'PATCH',
      body: {
        logId: editingLog.value.id,
        remarks: remarkText.value, // Send the updated remarks
      },
    });

    alert('Remarks have been updated.');
    // Close the modal and reset state.
    editingLog.value = null;
    remarkText.value = '';
    // Refresh the data to show the new remarks in the list.
    await refresh();

  } catch (e) {
    console.error('Failed to update remarks:', e);
    alert('Failed to update remarks. Please try again.');
  }
}

async function approveAll() {
  if (!pendingLogs.value || pendingLogs.value.length === 0) {
    alert('No logs to approve.');
    return;
  }
  
  try {
    // Call a new endpoint designed for bulk updates.
    await $fetch('/api/approval/all', {
      method: 'POST',
    });

    alert(`Approving all ${pendingLogs.value?.length || 0} logs.`);
    // Refresh the list, which should now be empty.
    await refresh();

  } catch (e) {
    console.error('Failed to approve all logs:', e);
    alert('Failed to approve all logs. Please try again.');
  }
}
  
const today = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
}).format(new Date());

function openRemarkModal(log: TimeLogForUI) {
  editingLog.value = log;
}

async function handleRemarkSubmit(newRemarkText: string) {
  if (!editingLog.value) return;

  const logId = editingLog.value.id;

  // Close the modal immediately for a better user experience
  editingLog.value = null;

  try {
    // Call the same PATCH endpoint, but only send the remarks
    await $fetch('/api/approval/approval', {
      method: 'PATCH',
      body: {
        logId: logId,
        remarks: newRemarkText, // Send the new text from the modal
      },
    });

    alert('Remarks have been updated.');
    await refresh(); // Refresh the main list to show the new remarks

  } catch (e) {
    console.error('Failed to update remarks:', e);
    alert('Failed to update remarks. Please try again.');
  }
}
</script>

<template>
  
  <div class="bg-gray-50 min-h-screen p-4 sm:p-6">

    <div>
      <header class="mb-8">
        <h1 class="font-serif text-2xl font-light text-gray-700 mb-1">
          Welcome Back, Admin 
        </h1>
        <h2 class="font-serif text-3xl font-light text-gray-900 mb-6">
          Today's Pending Time Log Approvals
        </h2>

        <div class="flex items-center">
          <span class="text-lg text-gray-600">{{ today }}</span>
          <span
            class="bg-gray-300 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm ml-3"
          >
          <span v-if="pending">...</span>
           <span v-else>{{ pendingLogs?.length || 0 }}</span>
          </span>
          <button
            @click="approveAll"
            :disabled="!pendingLogs || pendingLogs.length === 0"
            class="ml-auto py-2 px-5 bg-white border border-gray-300 rounded-md text-gray-600 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    @edit-remarks="openRemarkModal" 
  />
        </template>

        <RemarksModal
  v-if="editingLog"
  :initial-value="editingLog.remarks || ''"
  @close="editingLog = null"
  @submit="handleRemarkSubmit"
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
