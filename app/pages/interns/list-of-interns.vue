<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { BatchData } from '~/interfaces/interfaces';

const route = useRoute();

// const batchId = route.params.id as string;
const batchId = '1';

const { data: batchData, pending, error } = await useFetch<BatchData>(`/api/batch/${batchId}`);
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen">
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <UButton to="/dashboard" icon="i-heroicons-arrow-left" variant="ghost" color="secondary" />
            <h1 class="text-lg font-bold ml-4 text-gray-900 dark:text-white">Active Interns</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="py-8">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <!-- Loading State -->
        <div v-if="pending" class="text-center py-12 text-gray-500">Loading Batch Details...</div>

        <!-- Error State -->
        <div v-else-if="error || !batchData" class="text-center py-12 text-red-500">
          Could not load batch details. Please try again.
        </div>

        <!-- Content State -->
        <UCard v-else :ui="{ body: 'p-4 sm:p-6' }">
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-base font-bold text-gray-900 dark:text-white">
                Batch Details
                <!-- Autocompletion works here for batchData.details.statusText -->
                <UBadge class="font-base rounded-full" color="primary">{{ batchData.details.statusText }}</UBadge>
              </h2>
            </div>
          </template>

          <!-- The grid of interns. `intern` is automatically typed as InternSummary -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink v-for="intern in batchData.interns" :key="intern.id" :to="`/interns/${intern.id}`" class="block">
              <div class="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800/50 h-full">
                <div class="flex items-center gap-3 p-3">
                  <!-- Autocompletion works here for intern.pictureUrl and intern.name -->
                  <UAvatar :src="intern.internPicture || undefined" :alt="intern.fullName" />
                  <p class="font-base text-black dark:text-white">{{ intern.fullName }}</p>
                </div>
                <hr class="border-gray-200 dark:border-gray-700" />
                <div class="p-3">
                  <p class="text-base text-black dark:text-white">
                    <!-- Autocompletion works here for intern.hoursCompleted and intern.requiredHours -->
                    Hours Completed: {{ intern.hoursCompleted ?? 0 }}/{{ intern.requiredHours }} hours
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>

          <template #footer>
            <UButton to="/interns/add-new-intern" block icon="i-heroicons-plus" variant="outline" size="xl" color="primary">
              Add Intern
            </UButton>
          </template>
        </UCard>
      </div>
    </main>
  </div>
</template>