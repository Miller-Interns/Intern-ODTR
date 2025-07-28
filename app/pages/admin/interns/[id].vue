<script setup lang="ts">
definePageMeta({
  layouts: 'admin',
});

const route = useRoute();
const internId = route.params.id; // Get the intern's ID from the URL

const activeTab = ref('time-logs'); // Default active tab

// --- DUMMY DATA ---
// In a real app, you would fetch this data from your API
// using `useFetch` based on the `internId`.
const intern = ref({
  name: 'Harold Jan P. Besario',
  status: 'Ongoing',
  role: 'UI/UX Designer',
  course: 'BS CpE - 4th Year',
  school: 'NORSU',
  hoursCompleted: 150,
  hoursRequired: 300,
  avatar: '/avatar-placeholder.png', // A placeholder image in your public/ dir
});

const timeLogs = ref([
  {
    id: 'log1',
    date: '2025-07-21T12:00:00Z',
    time_in: '2025-07-21T09:00:00Z',
    time_out: '2025-07-21T19:00:00Z',
    total_hours: 10,
    overtime: 2,
    remarks: 'Finished the onboarding module.',
    status: 'pending', // A log waiting for approval
  },
  {
    id: 'log2',
    date: '2025-07-20T12:00:00Z',
    time_in: '2025-07-20T09:00:00Z',
    time_out: '2025-07-20T18:00:00Z',
    total_hours: 9,
    overtime: 1,
    remarks: null,
    status: 'approved', // An already approved log
  },
]);
// --- END DUMMY DATA ---
</script>

<template>
  <div>
    <!-- Back Button -->
    <button @click="$router.back()" class="flex items-center text-gray-600 mb-4 p-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    </button>

    <!-- Intern Info Card -->
    <InternInfo :intern="intern" />

     <!-- Tabs: Personal Info / Time Logs -->
    <div class="mt-6 bg-gray-200 p-1 rounded-full flex items-center">
      <button
        @click="activeTab = 'personal-info'"
        :class="['w-1/2 py-2 text-center rounded-full text-sm font-semibold transition-colors', activeTab === 'personal-info' ? 'bg-white text-gray-800 shadow' : 'bg-transparent text-gray-500']"
      >
        Personal Info
      </button>
      <button
        @click="activeTab = 'time-logs'"
        :class="['w-1/2 py-2 text-center rounded-full text-sm font-semibold transition-colors', activeTab === 'time-logs' ? 'bg-white text-gray-800 shadow' : 'bg-transparent text-gray-500']"
      >
        Time Logs
      </button>
    </div>

  
    <!-- Content based on active tab -->
    <div class="mt-6">
      <div v-if="activeTab === 'time-logs'" class="space-y-4">
        <InternLogs
          v-for="log in timeLogs"
          :key="log.id"
          :log="log"
        />
      </div>
      
      <!-- Personal Info View (Placeholder) -->
      <div v-if="activeTab === 'personal-info'" class="bg-white p-6 rounded-lg shadow-sm text-center">
        <p class="text-gray-600">Personal information will be displayed here.</p>
      </div>
    </div>
  </div>
</template>