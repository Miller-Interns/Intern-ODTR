<script setup lang="ts">
import { computed } from 'vue';
import type { ActiveInternsApiResponse } from '~/types/composites';
const { data, pending, error } = await useFetch<ActiveInternsApiResponse>(`/api/admin/approval/active-interns`);

const batchStatus = computed(() => {
  if (!data.value) {
    return { text: 'Loading...', class: 'bg-gray-200 text-gray-800' };
  }

  if (data.value.batch.status) {
    return { text: 'Ongoing', class: 'bg-green-200 text-green-800' };
  } else {
    return { text: 'Completed', class: 'bg-blue-200 text-blue-800' };
  }
});
</script>

<template>
  <div class="bg-gray-100 min-h-screen font-sans">
    <div class="max-w-md mx-auto bg-white min-h-screen">
      <!-- Header -->
      <header class="p-4 flex items-center">
        <button class="text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 class="text-xl font-bold text-gray-800 ml-4">Active Interns</h1>
      </header>

      <!-- Main Content -->
      <main class="p-4">
        <!-- Loading State -->
        <div v-if="pending" class="text-center text-gray-500">Loading...</div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center text-red-500">
            <p>Could not load data.</p>
            <p class="text-sm">{{ error.statusMessage }}</p>
        </div>

        <!-- Data Loaded State -->
        <div v-else-if="data" class="bg-white rounded-lg shadow-md p-4">
          <!-- Batch Details Header -->
          <div class="flex justify-between items-center pb-3 border-b">
            <h2 class="text-lg font-bold text-gray-800">Batch {{ data.batch.batch_number }} Details</h2>
            <span :class="batchStatus.class" class="text-xs font-semibold px-3 py-1 rounded-full">
              {{ batchStatus.text }}
            </span>
          </div>

          <!-- Interns List -->
          <div class="space-y-3 mt-4">
            <NuxtLink
              v-for="intern in data.interns"
              :key="intern.id"
              :to="`/admin/manage/${intern.id}`"
              >
             <InternCard :intern="intern" />
          </NuxtLink>
          </div>

          <!-- Add Intern Button -->
          <div class="mt-4">
            <button class="w-full flex items-center justify-center py-2 px-4 border-2 border-teal-400 text-teal-500 font-semibold rounded-lg hover:bg-teal-50 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add Intern
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>