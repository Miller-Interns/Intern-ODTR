<script setup lang="ts">

definePageMeta({
  layouts: 'admin',
});

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
        status: true, 
      },
    });
 alert(`Log with ID ${logId} has been approved.`);
 await refresh();
 } catch (e) {
    console.error('Failed to approve log:', e);
    alert('Failed to approve the log. Please try again.');
  }
}

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
    editingLog.value = null;
    remarkText.value = '';
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
    await $fetch('/api/approval/all', {
      method: 'POST',
    });

    alert(`Approving all ${pendingLogs.value?.length || 0} logs.`);
    await refresh();

  } catch (e) {
    console.error('Failed to approve all logs:', e);
    alert('Failed to approve all logs. Please try again.');
  }
}
  
const today = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
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
  editingLog.value = null;

  try {
    await $fetch('/api/approval/approval', {
      method: 'PATCH',
      body: {
        logId: logId,
        remarks: newRemarkText, // Send the new text from the modal
      },
    });

    alert('Remarks have been updated.');
    await refresh(); 

  } catch (e) {
    console.error('Failed to update remarks:', e);
    alert('Failed to update remarks. Please try again.');
  }
}
</script>

<template>
  <div>
    <!-- Header Section -->
      <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Pending Approvals for Today</h1>
      <div class="flex justify-between items-center mt-2">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">{{ today }}</span>
          <span v-if="!pending" class="bg-teal-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {{ pendingLogs?.length || 0 }}
          </span>
        </div>
        <button
          @click="approveAll"
          :disabled="!pendingLogs || pendingLogs.length === 0"
          class="bg-teal-500 text-white font-semibold text-sm py-2 px-5 rounded-full shadow-sm hover:bg-teal-600 transition-colors disabled:opacity-50"
        >
          Approve All
        </button>
      </div>
    </header>

    <!-- Main Content: List of Logs -->
    <main>
      <div v-if="pending" class="text-center py-10 text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-center p-4 bg-red-100 text-red-700 rounded-lg">
        Failed to load data.
      </div>
      <div v-else-if="pendingLogs && pendingLogs.length > 0" class="space-y-4">
        <TimeLogsContainer
          v-for="log in pendingLogs"
          :key="log.id"
          :log="log"
          @approve="onLogApproved"
          @edit-remarks="openRemarkModal"
        />
      </div>
      <div v-else class="text-center py-10 mt-8 bg-white rounded-lg shadow-sm">
        <p class="text-gray-500">No pending approvals.</p>
      </div>
    </main>

    <!-- Modal for Remarks (no visual changes needed) -->
    <ModalRemarks
      v-if="editingLog"
      :initial-value="editingLog.remarks || ''"
      @close="editingLog = null"
      @submit="handleRemarkSubmit"
    />
  </div>
</template>
