<template>
  <div class="bg-gray-50 min-h-screen flex flex-col pb-20">
    <!-- Loading State -->
    <div v-if="pending" class="flex flex-1 items-center justify-center">
      <p>Loading Dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-1 items-center justify-center text-red-500 text-center">
      <p>Could not load dashboard data.<br />Please try again later.</p>
      <pre v-if="error.message" class="text-xs text-black-400 mt-2">{{ error.message }}</pre>
    </div>

    <!-- Main Content -->
    <div v-else-if="dashboardData && typedUser" class="p-4 space-y-6">

      <!-- Header -->
      <header>
        <h1 class="text-2xl font-bold text-black-800">Welcome back,</h1>
        <h1 class="text-2xl font-bold text-black-800">{{ typedUser.name || 'Intern' }}</h1>
        <!-- The subtext now correctly reflects the intern's status -->
        <p v-if="!internStatus" class="text-amber-600 pt-2 pb-3 italic">Your account is currently inactive.</p>
        <p v-else-if="activeTimeLog" class="text-black-500 pt-2 pb-3 italic">Your time log is in progress</p>
        <p v-else-if="lastCompletedLog" class="text-black-500 pt-2 pb-3 italic">Your time log has been submitted for
          today, Great Job!</p>
        <p v-else class="text-black-500 pt-2 pb-3 italic">You are currently timed out.</p>
      </header>

      <!-- NEW STATE: Inactive Intern View -->
      <div v-if="!internStatus">
        <UCard>
          <div class="text-center">
            <p class="mb-4">Your account is currently inactive. You cannot time in until an administrator reactivates
              your account.</p>
          </div>
        </UCard>
      </div>

      <!-- In-Progress View -->
      <div v-else-if="activeTimeLog">
        <h2 class="font-semibold text-xl pb-4">Time Log Summary</h2>
        <UCard class="mb-6">
          <template #header>
            <p class="text-l text-black">{{ formattedDate(activeTimeLog.time_in) }}</p>
          </template>
          <div class="space-y-4 mb-6">
            <div>
              <p class="text-sm text-black-500">Time in:</p>
              <p class="font-semibold text-lg">{{ formatTime(activeTimeLog.time_in) }}</p>
            </div>
            <div class="bg-gray-100 p-4 rounded-lg text-center border-2 border-dashed border-gray-300">
              <p class="text-sm text-black-500">Elapsed Time:</p>
              <p class="font-bold text-xl">{{ elapsedTime.toFixed(1) }} hrs</p>
            </div>
          </div>
          <div v-if="!showRemarksInput" class="space-y-2 flex flex-col items-center justify-center text-center">
            <button @click="showRemarksInput = true" class="text-black-600 flex items-center gap-1 text-lg font-medium">
              <UIcon name="i-heroicons-plus" class="w-6 h-6" />
              Add Remarks (Optional)
            </button>
            <div class="flex items-center bg-blue-50 p-3 rounded-lg text-blue-800">
              <UIcon name="i-heroicons-information-circle" class="text-xl mr-2 flex-shrink-0 text-black" />
              <p class="text-xs text-black">
                To time out with less than 8 hours, please add a reason in the note field.
              </p>
            </div>
          </div>
          <div v-else class="flex flex-col w-full space-y-2">
            <h2 class="text-base font-semibold">Intern Notes:</h2>
            <UFormGroup name="intern_notes" class="w-full">
              <UTextarea v-model="intern_notes"
                placeholder="Add any details about your time log for today (e.g. overtime or short hours)." :rows="3"
                class="w-full" :ui="{ base: 'text-lg placeholder:text-lg w-full' }" />
            </UFormGroup>
          </div>
          <UButton @click="handleTimeOut" :disabled="isTimeOutDisabled" :loading="isSubmitting" block class="mt-4"
            size="lg">Time
            Out</UButton>
        </UCard>
      </div>

      <!-- Submitted View -->
      <div v-else-if="lastCompletedLog">
        <h2 class="font-semibold text-xl pb-4">Time Log Summary</h2>
        <UCard>
          <template #header>
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-black-500">{{ formattedDate(lastCompletedLog.time_in) }}</p>
              </div>
              <UBadge v-if="lastCompletedLog.status === true" color="success" variant="soft">Approved</UBadge>
              <UBadge v-else color="warning" variant="soft">Pending Approval</UBadge>
            </div>
          </template>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-black-500">Time in:</p>
                <p class="font-semibold">{{ formatTime(lastCompletedLog.time_in) }}</p>
              </div>
              <div>
                <p class="text-sm text-black-500">Time out:</p>
                <p class="font-semibold">{{ formatTime(lastCompletedLog.time_out) }}</p>
              </div>
            </div>
            <div v-if="lastCompletedLog.intern_notes">
              <p class="text-sm text-black-500">Intern Notes</p>
              <p class="text-sm p-2 bg-gray-50 rounded">{{ lastCompletedLog.intern_notes }}</p>
            </div>
            <div class="bg-gray-100 p-4 rounded-lg text-center border-2 border-dashed border-gray-300">
              <p class="text-sm text-black-500">Total Hours:</p>
              <p class="font-bold text-xl">{{ lastCompletedLog.total_hours.toFixed(1) }} hrs</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Fully Timed Out View (for active interns) -->
      <div v-else>
        <UCard>
          <div class="text-center">
            <p class="mb-4">You do not have an active time log. Please log out and log in again to start a new time
              sheet.</p>
          </div>
        </UCard>
      </div>

      <!-- Hours Rendered Card (always visible) -->
      <div>
        <h2 class="font-semibold text-xl pb-4">Hours Rendered</h2>
        <UCard>
          <div class="text-center space-y-1">
            <p class="text-sm font-medium text-black-500">{{ progressPercentage.toFixed(0) }}%</p>
            <UProgress v-model="renderedHours" :max="totalHours" color="success" />
            <p class="text-lg font-semibold text-black-800">{{ renderedHours.toFixed(0) }} / {{ totalHours }} Hours</p>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t">
      <div class="flex justify-around py-2">
        <UButton to="/dashboard" variant="link" icon="i-heroicons-home" class="flex flex-col items-center text-xs text-black-600">
          Dashboard
        </UButton>
        <UButton to="/timelogs" variant="link" icon="i-heroicons-clock" class="flex flex-col items-center text-xs text-black-600">Time
          Logs
        </UButton>
        <UButton variant="link" icon="i-heroicons-user-circle"
          class="flex flex-col items-center text-xs text-black-600">
          Profile</UButton>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import type { Selectable } from 'kysely'
import type { TimeLog } from '~/server/db/types';

interface SessionUser { id: string; email: string; name: string | null; isAdmin: boolean; }
// Update the response type to include our new field
type DashboardDataResponse = { activeTimeLog: Selectable<TimeLog> | null; lastCompletedLog: Selectable<TimeLog> | null; internStatus: boolean; requiredHours: number; renderedHours: number; }

const { session } = useUserSession()
const router = useRouter()
const toast = useToast()
const typedUser = computed(() => session.value?.user as SessionUser | undefined);

const intern_notes = ref('');
const elapsedTime = ref(0);
const activeTimeLog = ref<Selectable<TimeLog> | null>(null);
const lastCompletedLog = ref<Selectable<TimeLog> | null>(null);
const isSubmitting = ref(false);
const renderedHours = ref(0);
const totalHours = ref(300);
const showRemarksInput = ref(false);
const internStatus = ref<boolean>(true); // Add a new ref for the intern's status
let timerInterval: NodeJS.Timeout | null = null;

const { data: dashboardData, pending, error, refresh } = await useFetch<DashboardDataResponse>(
  '/api/timelog/current',
  { watch: [typedUser], immediate: !!typedUser.value }
);

watch(dashboardData, (newData) => {
  if (timerInterval) clearInterval(timerInterval);
  if (newData && typeof newData === 'object') {
    activeTimeLog.value = newData.activeTimeLog;
    lastCompletedLog.value = newData.lastCompletedLog;
    renderedHours.value = newData.renderedHours || 0;
    totalHours.value = newData.requiredHours || 300;
    internStatus.value = newData.internStatus; // Sync the intern's status
  }
  if (process.client && activeTimeLog.value) {
    updateElapsedTime();
    timerInterval = setInterval(updateElapsedTime, 1000);
  }
}, { immediate: true });

onMounted(() => {
  if (activeTimeLog.value) {
    updateElapsedTime();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateElapsedTime, 1000);
  }
});

const isTimeOutDisabled = computed(() => {
  if (isSubmitting.value) { return true; }
  if (elapsedTime.value >= 8) { return false; }
  return intern_notes.value.trim() === '';
});

const progressPercentage = computed(() => {
  if (!totalHours.value) return 0;
  return (renderedHours.value / totalHours.value) * 100;
});

const formattedDate = (dateString: string | Date) => {
  if (!dateString) return '';
  return new Date(String(dateString)).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
};

const formatTime = (dateString: string | Date | null) => {
  if (!dateString) return '';
  return new Date(String(dateString)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

function updateElapsedTime() {
  if (!activeTimeLog.value?.time_in) return;
  const timeInDate = new Date(String(activeTimeLog.value.time_in));
  const now = new Date();
  const diffMilliseconds = now.getTime() - timeInDate.getTime();
  elapsedTime.value = diffMilliseconds / (1000 * 60 * 60);
}

async function handleTimeOut() {
  if (!activeTimeLog.value || isTimeOutDisabled.value) return;
  isSubmitting.value = true;
  try {
    await $fetch('/api/timelog/timeout', {
      method: 'POST',
      body: {
        timeLogId: activeTimeLog.value.id,
        intern_notes: intern_notes.value,
      },
    });
    toast.add({ id: 'timeout_success', title: 'Time log submitted for approval.', color: 'success' });
    await refresh();
  } catch (err: any) {
    console.error('Failed to time out:', err);
    toast.add({ id: 'timeout_error', title: 'Error', description: err.data?.message || 'Could not process time out.', color: 'error' });
  } finally {
    isSubmitting.value = false;
  }
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>