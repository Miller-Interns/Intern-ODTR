<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { InternDetailsResponse } from '~/types/composites';

const route = useRoute();
const internId = route.params.id;
const { data, pending, error } = await useFetch<InternDetailsResponse>(`/api/admin/approval/${internId}`);
const internFullName = computed(() => data.value?.intern.user.name || 'Loading...');

</script>

<template>
  <div class="bg-gray-100 min-h-screen font-sans">
    <div class="max-w-md mx-auto bg-white min-h-screen">
      <header class="p-4 flex items-center">
        <NuxtLink to="/admin/active-interns" class="text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-800 ml-4">Manage Intern</h1>
      </header>

      <main class="p-4">
        <div v-if="pending" class="text-center text-gray-500">Loading Intern Details...</div>
        
        <div v-else-if="error" class="text-center text-red-500">
            <p>Could not load intern data.</p>
            <p class="text-sm">{{ error.statusMessage }}</p>
        </div>

        <div v-else-if="data">
          <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
            <div class="flex items-start space-x-4">
              <img :src="data.intern.user.avatar || '/default-avatar.png'" alt="Avatar" class="w-16 h-16 rounded-full bg-gray-200">
              <div class="flex-1">
                <p class="font-bold text-lg text-gray-900">{{ data.intern.user.name }}</p>
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Ongoing</span>
                  <span>-</span>
                  <label class="flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer">
                    <div class="relative w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
                    <span class="ml-2 text-sm font-medium text-gray-700">Mark as Completed</span>
                  </label>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ data.intern.course }} - {{ data.intern.year }} Year</p>
                <p class="text-sm text-gray-500">{{ data.intern.school }}</p>
                <p class="text-sm text-gray-500 mt-2">Hours Completed: {{ data.intern.completed_hours }}/{{ data.intern.required_hours }}</p>
              </div>
            </div>
          </div>

          <!-- Tab Navigation -->
          <div class="flex border-b mb-4">
            <button class="py-2 px-4 text-gray-500">Personal Info</button>
            <button class="py-2 px-4 text-teal-500 border-b-2 border-teal-500 font-semibold">Time Logs</button>
          </div>

          <!-- Time Logs List -->
          <div class="space-y-4">
            <div v-for="log in data.timeLogs" :key="log.id" class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div class="flex justify-between items-center mb-3">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                  <span class="font-medium text-gray-700">{{ new Date(log.time_in).toLocaleDateString() }}</span>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <p class="text-gray-500">Time in:</p>
                  <p class="font-semibold text-gray-800">{{ new Date(log.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Time out:</p>
                  <p class="font-semibold text-gray-800">{{ log.time_out ? new Date(log.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Total Hours:</p>
                  <p class="font-semibold text-gray-800">{{ log.total_hours }} Hours</p>
                </div>
              </div>
              <button class="w-full py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg">Pending Approval</button>
            </div>
            
            <!-- Export Button -->
            <button class="w-full mt-4 py-2 px-4 border-2 border-teal-400 text-teal-500 font-semibold rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 7.414V13a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
              Export DTR
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>