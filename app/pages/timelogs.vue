<template>
  <!-- FIX: Added extra bottom padding (pb-40) to make space for the sticky button and the nav -->
  <div class="bg-black-50 min-h-screen flex flex-col pb-40">
    <!-- Header -->
    <header class="p-4">
      <h1 class="text-2xl font-bold text-black-800">Time Logs</h1>
    </header>

    <!-- Loading State -->
    <div v-if="pending" class="flex flex-1 items-center justify-center">
      <p>Loading Time Logs...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-1 items-center justify-center text-red-500 text-center">
      <p>Could not load time logs.<br />Please try again later.</p>
    </div>

    <!-- Main Content: List of Time Logs -->
    <div v-else-if="data?.timeLogs" class="px-4 space-y-4">
      <!-- Empty State -->
      <div v-if="data.timeLogs.length === 0" class="text-center">
        <UCard class="shadow-lg text-gray-500 p-3 text-md">
          <p>No time logs recorded yet. Once you log time, it will show up here.</p>
        </UCard>
      </div>

      <!-- Loop through each time log -->
      <UCard v-for="log in data.timeLogs" class="shadow-lg" :key="log.id">
        <template #header>
          <div class="flex justify-between items-center">
            <p class="font-semibold text-black-700">{{ formattedDate(log.time_in) }}</p>
            <UBadge v-if="!log.status" color="warning" variant="soft">Pending Approval</UBadge>
          </div>
        </template>
        <div>
          <div class="grid grid-cols-3">
            <div class="flex justify-center">
              <div class="text-left">
                <p class="text-sm text-black-500">Time in</p>
                <p class="font-medium">{{ formatTime(log.time_in) }}</p>
              </div>
            </div>
            <div class="flex justify-center">
              <div class="text-left">
                <p class="text-sm text-black-500">Time out</p>
                <p class="font-medium">{{ formatTime(log.time_out) }}</p>
              </div>
            </div>
            <div class="flex justify-center">
              <div class="text-left">
                <p class="text-sm text-black-500">Total Hours</p>
                <p class="font-medium">{{ log.total_hours.toFixed(1) }} Hours</p>
              </div>
            </div>
          </div>
          <div v-if="log.intern_notes || log.admin_remarks"
            class="mt-4 pt-4 border-t border-gray-200 space-y-2 text-left">
            <div v-if="log.intern_notes">
              <p class="text-sm text-black-500">Intern Notes:</p>
              <p class="text-sm text-black-800 p-2 bg-black-50 rounded-md">{{ log.intern_notes }}</p>
            </div>
            <div v-if="log.admin_remarks">
              <p class="text-sm text-black-500">Admin Remarks:</p>
              <p class="text-sm text-black-800 p-2 bg-blue-50 rounded-md">{{ log.admin_remarks }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- NEW FEATURE: Sticky Export Button -->
    <div class="fixed bottom-20 left-0 right-0 p-4">
      <UButton block size="lg" icon="i-heroicons-arrow-down-tray" @click="exportDTR"
        :disabled="!data || data.timeLogs.length === 0">
        Export DTR
      </UButton>
    </div>

    <!-- Bottom Navigation -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t">
      <div class="flex justify-around py-2">
        <UButton to="/dashboard" variant="link" icon="i-heroicons-home"
          class="flex flex-col items-center text-xs text-black-600">
          Dashboard
        </UButton>
        <UButton to="/timelogs" variant="link" icon="i-heroicons-clock"
          class="flex flex-col items-center text-xs text-black-600">Time
          Logs
        </UButton>
        <UButton to="/profile" variant="link" icon="i-heroicons-user-circle"
          class="flex flex-col items-center text-xs text-black-600">
          Profile</UButton>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Selectable } from 'kysely';
import type { TimeLog } from '~/server/db/types';

// --- Type Definitions ---
interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

type TimeLogWithAdmin = Selectable<TimeLog> & {
  adminName: string | null;
}

type TimeLogsResponse = {
  timeLogs: TimeLogWithAdmin[];
}

const { session } = useUserSession();
const toast = useToast();
const typedUser = computed(() => session.value?.user as SessionUser | undefined);

const { data, pending, error } = await useFetch<TimeLogsResponse>('/api/timelog/list');

// --- Helper Functions for Formatting ---
// This function creates the desired display format (e.g., "Sat, Aug 16, 2025")
const formattedDate = (dateString: string | Date) => {
  if (!dateString) return '';
  return new Date(String(dateString)).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (dateString: string | Date | null) => {
  if (!dateString) return '';
  return new Date(String(dateString)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

// Helper to format time in 24-hour format (HH:mm) for the CSV
const format24HourTime = (dateString: string | Date | null): string => {
  if (!dateString) return '';
  const date = new Date(String(dateString));
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};


// --- CSV Export Logic ---
function exportDTR() {
  if (!data.value || !data.value.timeLogs || data.value.timeLogs.length === 0) {
    toast.add({ id: 'export_error', title: 'No time logs to export.', color: 'error' });
    return;
  }

  const internName = typedUser.value?.name || 'Intern';
  let totalHours = 0;

  const metadata = [
    '"Miller Dev Internship Daily Time Record"',
    `"Intern Name: ${internName}"`,
    '"Official Hours: 9:00 - 6:00 PM"',
    '',
  ];

  const headers = ['Date', 'Approved By', 'Time in', 'Time out', 'No. of Hours'];

  const rows = data.value.timeLogs.map(log => {
    totalHours += log.total_hours;

    // FIX: Use the display format but enclose it in double quotes to make it CSV-safe.
    const date = `"${formattedDate(log.time_in)}"`;

    const approvedBy = log.adminName ? `${log.adminName}` : 'N/A';
    const timeIn = format24HourTime(log.time_in);
    const timeOut = format24HourTime(log.time_out);
    const hours = log.total_hours.toFixed(1);

    return [date, approvedBy, timeIn, timeOut, hours].join(',');
  });

  const footer = ['', '', '', '"Total No. of Hours:"', totalHours.toFixed(1)];

  const csvContent = [
    ...metadata,
    headers.join(','),
    ...rows,
    footer.join(',')
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);

  const userNameForFile = internName.replace(/\s+/g, '_');
  link.setAttribute('download', `DTR_${userNameForFile}.csv`);

  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.add({ id: 'export_success', title: 'DTR exported successfully!', color: 'success' });
}
</script>