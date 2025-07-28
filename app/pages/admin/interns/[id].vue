<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

interface LogEntry {
  id: string;
  time_in: string; // These are ISO strings
  time_out: string | null;
  total_hours: number | null;
  overtime: number | null;
  remarks: string | null;
  status: 'approved' | 'pending'; // The string status we created in the API
  date: string;
}

// This describes the `intern` object from your API
interface InternProfile {
  id: string;
  name: string | null;
  school: string;
  course: string;
  year: string;
  statusString: 'Ongoing' | 'Completed';
  required_hours: number;
  hoursCompleted: number;
  avatar: string | null;
  role: string;
}

// This is the main interface for the entire API response object
interface InternDetailResponse {
  intern: InternProfile;
  timeLogs: LogEntry[];
}

const route = useRoute();
const internId = route.params.id as string; // Get the intern's ID from the URL
const { data, pending, error } = await useFetch<InternDetailResponse>(`/api/approval/${internId}`);

const activeTab = ref('time-logs'); // Default active tab
</script>

<template>
  <div>
    <!-- Back Button -->
    <button @click="$router.back()" class="flex items-center text-gray-600 mb-4 p-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
    </button>

    <div v-if="pending">Loading intern...</div>
    <div v-else-if="error">Could not load intern data.</div>
    
    <div v-else-if="data">
    <InternInfo :intern="data.intern" />

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
          v-for="log in data.timeLogs"
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
  </div>
</template>