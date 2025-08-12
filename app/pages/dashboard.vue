<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="pending" class="text-center">
      <p>Loading Dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500">
      <p>Could not load dashboard data. Please try again later.</p>
      <pre>{{ error.message }}</pre>
    </div>

    <!-- Data Loaded State -->
    <div v-else-if="dashboardData">
      <header class="mb-6">
        <!-- Safely access user name -->
        <h1 class="text-2xl font-bold">Welcome back, {{ authData?.user?.name || 'Intern' }}</h1>
        <p v-if="activeTimeLog" class="text-gray-500">Your time log is in progress</p>
        <p v-else class="text-gray-500">You are currently timed out. Time in to start a new log.</p>
      </header>

      <!-- Show Time In button if there's no active log -->
      <UCard v-if="!activeTimeLog" class="mb-6">
        <div class="text-center">
          <p class="mb-4">You do not have an active time log.</p>
          <UButton size="lg">Time In</UButton>
        </div>
      </UCard>

      <!-- Main time log card -->
      <UCard v-if="activeTimeLog" class="mb-6">
        <template #header>
          <h2 class="font-semibold text-lg">Time Log Summary</h2>
          <p class="text-sm text-gray-500">{{ formattedDate }}</p>
        </template>

        <div class="grid grid-cols-2 gap-4 items-center">
          <div>
            <p class="text-sm text-gray-500">Time in:</p>
            <p class="font-semibold text-lg">{{ timeIn }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg text-center">
            <p class="text-sm text-gray-500">Elapsed Time:</p>
            <p class="font-bold text-xl">{{ elapsedTime.toFixed(1) }} hrs</p>
          </div>
        </div>

        <div v-if="elapsedTime < 8" class="mt-6">
          <div v-if="!showRemarksInput" class="text-center">
            <UButton @click="showRemarksInput = true" variant="link" icon="i-heroicons-plus-circle">
              Add Remarks (Optional)
            </UButton>
            <div class="flex items-center justify-center bg-blue-50 p-3 rounded-lg mt-2">
              <UIcon name="i-heroicons-information-circle" class="text-blue-500 text-xl mr-2" />
              <p class="text-xs text-gray-600">To time out with less than 8 hours, please add a reason in the note field.</p>
            </div>
          </div>
          <div v-else>
            <UFormGroup label="Intern Notes" name="remarks">
              <UTextarea v-model="remarks" placeholder="Add any details about your time log for today..." />
            </UFormGroup>
          </div>
        </div>

        <div v-else class="mt-6 text-center">
          <UButton v-if="!showRemarksInput" @click="showRemarksInput = true" variant="link" icon="i-heroicons-plus-circle">
            Add Remarks (Optional)
          </UButton>
          <UFormGroup v-if="showRemarksInput" label="Intern Notes" name="remarks">
            <UTextarea v-model="remarks" placeholder="Add any details about your time log for today..." />
          </UFormGroup>
        </div>

        <UButton @click="handleTimeOut" :disabled="isTimeOutDisabled" :loading="isSubmitting" block class="mt-4" size="lg">
          Time Out
        </UButton>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="font-semibold text-lg">Hours Rendered</h2>
        </template>
        <div class="text-center">
          <UProgress :value="renderedHours" :max="totalHours" class="mb-2" />
          <p class="text-sm font-medium">{{ renderedHours.toFixed(2) }} / {{ totalHours }} Hours</p>
          <p class="text-xs text-gray-500">{{ progressPercentage.toFixed(0) }}%</p>
        </div>
      </UCard>
    </div>

    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t">
      <div class="flex justify-around">
        <UButton variant="link" icon="i-heroicons-home">Dashboard</UButton>
        <UButton variant="link" icon="i-heroicons-clock">Time Logs</UButton>
        <UButton variant="link" icon="i-heroicons-user-circle">Profile</UButton>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import type { Selectable } from 'kysely'
import type { TimeLog, User } from '~/server/db/types';

// --- Type Definitions for API Responses ---
type UserResponse = {
  user: Selectable<User>
}

type DashboardDataResponse = {
  activeTimeLog: Selectable<TimeLog> | null;
  requiredHours: number;
  renderedHours: number;
}

// --- Reactive State ---
const remarks = ref('');
const showRemarksInput = ref(false);
const elapsedTime = ref(0);
const activeTimeLog = ref<Selectable<TimeLog> | null>(null);
const isSubmitting = ref(false);

const renderedHours = ref(0);
const totalHours = ref(300);

let timerInterval: NodeJS.Timeout | null = null;

// --- Data Fetching with Types ---
const { data: authData } = await useFetch<UserResponse>('/api/auth/me');

const { data: dashboardData, pending, error, refresh } = await useAsyncData<DashboardDataResponse>(
  'dashboard-data',
  () => $fetch('/api/timelog/current'),
  { watch: [authData] }
)

// --- Watch for fetched data to update the state ---
watch(dashboardData, (newData) => {
  if (newData) {
    activeTimeLog.value = newData.activeTimeLog;
    renderedHours.value = newData.renderedHours || 0;
    totalHours.value = newData.requiredHours || 300;

    if (newData.activeTimeLog) {
      updateElapsedTime();
      if (!timerInterval) {
        timerInterval = setInterval(updateElapsedTime, 1000);
      }
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }
}, { immediate: true });


// --- Computed Properties ---
const formattedDate = computed(() => {
  if (!activeTimeLog.value) return '';
  // FIX: Cast to String to ensure new Date() can parse it
  return new Date(String(activeTimeLog.value.time_in)).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
});

const timeIn = computed(() => {
  if (!activeTimeLog.value) return '';
  // FIX: Cast to String to ensure new Date() can parse it
  return new Date(String(activeTimeLog.value.time_in)).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true
  });
});

const isTimeOutDisabled = computed(() => {
  if (isSubmitting.value) return true;
  if (elapsedTime.value >= 8) return false;
  return remarks.value.trim() === '';
});

const progressPercentage = computed(() => {
  if (totalHours.value === 0) return 0;
  return (renderedHours.value / totalHours.value) * 100;
});

// --- Methods ---
function updateElapsedTime() {
  if (activeTimeLog.value?.time_in) {
    // FIX: Cast to String to ensure new Date() can parse it
    const timeInDate = new Date(String(activeTimeLog.value.time_in));
    const now = new Date();
    const diff = now.getTime() - timeInDate.getTime();
    elapsedTime.value = diff / (1000 * 60 * 60);
  }
}

async function handleTimeOut() {
  if (!activeTimeLog.value || isTimeOutDisabled.value) return;

  isSubmitting.value = true;
  try {
    await $fetch('/api/timelog/timeout', {
      method: 'POST',
      body: {
        timeLogId: activeTimeLog.value.id,
        remarks: remarks.value,
      },
    });
    alert('Time out successful!');
    await refresh();
  } catch (err: any) {
    console.error('Failed to time out:', err);
    alert(`Error: ${err.data?.message || 'Could not process time out.'}`);
  } finally {
    isSubmitting.value = false;
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  if (activeTimeLog.value && !timerInterval) {
    timerInterval = setInterval(updateElapsedTime, 1000);
  }
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>