<script setup lang="ts">
import type { TimeLogForUI } from "../../../app/types/time-log.ts";

definePageMeta({
  layout: 'default',
});

const STANDARD_WORK_HOURS = 8;
const BREAK_HOURS = 1;

const { data: pendingLogs, pending, error, refresh } = useFetch<TimeLogForUI[]>('/api/approval/log', {
  transform: (logs) => {
    return logs.map(log => {
      if (!log.time_in || !log.time_out) {
        return { ...log, total_hours: 0, overtime: 0 };
      }
      const timeIn = new Date(log.time_in);
      const timeOut = new Date(log.time_out);
      if (isNaN(timeIn.getTime()) || isNaN(timeOut.getTime())) {
        return { ...log, total_hours: 0, overtime: 0 };
      }

      const grossDurationHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60);
      const calculatedTotalHours = Math.max(0, grossDurationHours - BREAK_HOURS);
      const calculatedOvertime = Math.max(0, calculatedTotalHours - STANDARD_WORK_HOURS);

      return {
        ...log,
        total_hours: parseFloat(calculatedTotalHours.toFixed(2)),
        overtime: parseFloat(calculatedOvertime.toFixed(2)),
      };
    });
  }
});


async function handleApproval(payload: { id: string; remarks: string }) {
  const logToApprove = pendingLogs.value?.find(log => log.id === payload.id);
  if (!logToApprove) return;

  try {
    await $fetch('/api/approval/approval', {
      method: 'PATCH',
      body: {
        logId: payload.id,
        remarks: payload.remarks,
        status: true,
        total_hours: logToApprove.total_hours, // Pass calculated hours
        overtime: logToApprove.overtime,       // Pass calculated overtime
      },
    });

    alert(`Log with ID ${payload.id} has been approved.`);
    await refresh();

  } catch (e) {
    console.error('Failed to approve log:', e);
    alert('Failed to approve the log. Please try again.');
  }
}

async function approveAll() {
  if (!pendingLogs.value || pendingLogs.value.length === 0) {
    alert('No logs to approve.');
    return;
  }

  const approvalPayload = pendingLogs.value.map(log => ({
    id: log.id,
    total_hours: log.total_hours,
    overtime: log.overtime,
  }));

  try {
    await $fetch('/api/approval/all', {
      method: 'POST',
      body: { logs: approvalPayload },
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

</script>

<template>
  <div>
      <header class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Pending Logs</h1>
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
           @approve-with-remarks="handleApproval"
        />
      </div>
      <div v-else class="text-center py-10 mt-8 bg-white rounded-lg shadow-sm">
        <p class="text-gray-500">No pending approvals.</p>
      </div>
    </main>
  </div>
</template>
