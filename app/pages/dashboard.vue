<template>
  <div class="p-4 bg-gray-50 min-h-screen">
    <!-- Loading State -->
    <div v-if="pending" class="text-center">
      <p>Loading Dashboard...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500">
      <p>Could not load dashboard data. Please try again later.</p>
      <pre v-if="error.message">{{ error.message }}</pre>
    </div>

    <!-- Data Loaded State -->
    <!-- FIX: We now check our new 'typedUser' computed property -->
    <div v-else-if="dashboardData && typedUser">
      <header class="mb-6">
        <!-- FIX: We now use 'typedUser.name' which is guaranteed to be type-safe -->
        <h1 class="text-2xl font-bold">Welcome back, {{ typedUser.name || 'Intern' }}</h1>
        <p v-if="activeTimeLog" class="text-gray-500">Your time log is in progress</p>
        <p v-else class="text-gray-500">You are currently timed out. Please log in again to start a new session.</p>
      </header>

      <!-- The rest of the template remains the same -->

      <UCard v-if="!activeTimeLog" class="mb-6">
        <div class="text-center">
          <p class="mb-4">You do not have an active time log. Please log out and log in again to start a new time sheet.</p>
        </div>
      </UCard>

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
          <UFormGroup label="Intern Notes" name="intern_notes">
            <UTextarea v-model="intern_notes" placeholder="Add any details about your time log for today..." />
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
import type { TimeLog } from '~/server/db/types';

// --- FIX: Define the shape of our User object directly in the script ---
interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

const { session, clear } = useUserSession()
const router = useRouter()

// --- FIX: Create a strongly-typed computed property for the user ---
// This tells TypeScript exactly what to expect, resolving the editor errors.
const typedUser = computed(() => session.value?.user as SessionUser | undefined);

type DashboardDataResponse = { activeTimeLog: Selectable<TimeLog> | null; requiredHours: number; renderedHours: number; }

const intern_notes = ref('');
const elapsedTime = ref(0);
const activeTimeLog = ref<Selectable<TimeLog> | null>(null);
const isSubmitting = ref(false);
const renderedHours = ref(0);
const totalHours = ref(300);
let timerInterval: NodeJS.Timeout | null = null;

const { data: dashboardData, pending, error, refresh } = await useFetch<DashboardDataResponse>(
    '/api/timelog/current',
    {
        // FIX: Watch our new typedUser property. The fetch will run when the user logs in.
        watch: [typedUser],
        immediate: !!typedUser.value,
    }
);

watch(dashboardData, (newData) => {
  if (newData) {
    activeTimeLog.value = newData.activeTimeLog;
    renderedHours.value = newData.renderedHours || 0;
    totalHours.value = newData.requiredHours || 300;
    if (newData.activeTimeLog) {
      updateElapsedTime();
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(updateElapsedTime, 1000);
    } else {
      if (timerInterval) clearInterval(timerInterval);
    }
  }
}, { immediate: true });

const formattedDate = computed(() => {
  if (!activeTimeLog.value) return '';
  return new Date(String(activeTimeLog.value.time_in)).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
});

const timeIn = computed(() => {
  if (!activeTimeLog.value) return '';
  return new Date(String(activeTimeLog.value.time_in)).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
});

const isTimeOutDisabled = computed(() => {
  if (isSubmitting.value) {
    return true;
  }
  if (elapsedTime.value < 8) {
    return intern_notes.value.trim() === '';
  }
  return false;
});

const progressPercentage = computed(() => {
    if(!totalHours.value) return 0;
    return (renderedHours.value / totalHours.value) * 100;
});

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
    alert('Time out successful! You will now be logged out.');
    
    await $fetch('/api/auth/logout', { method: 'POST' });
    await clear();
    await router.push('/login');

  } catch (err: any) {
    console.error('Failed to time out:', err);
    alert(`Error: ${err.data?.message || 'Could not process time out.'}`);
    isSubmitting.value = false;
  }
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>