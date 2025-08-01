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
        <div v-if="pending" class="text-center py-12 text-gray-500">Loading Batch Details...</div>
        <div v-else-if="error || !batchData" class="text-center py-12 text-red-500">Could not load batch details.</div>

        <UCard v-else :ui="{ body: 'p-4 sm:p-6' }">
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-base font-bold text-gray-900 dark:text-white ">Batch Details 
                <UBadge class="font-base rounded-full" color="primary" >{{batchData.details.statusText}}</UBadge>
              </h2>
            </div>
          </template>

          <!-- MODIFIED: Replaced space-y-4 with responsive grid classes -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NuxtLink v-for="intern in batchData.interns" :key="intern.id" :to="`/interns/${intern.id}`" class="block">
              <div class="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800/50 h-full">
                <div class="flex items-center gap-3 p-3">
                  <UAvatar :src="intern.pictureUrl || undefined" :alt="intern.name" />
                  <p class="font-base text-black dark:text-white">{{ intern.name }}</p>
                </div>
                <hr class="border-gray-200 dark:border-gray-700" />
                <div class="p-3">
                  <p class="text-base text-black dark:text-white">
                    Hours Completed: {{ intern.hoursCompleted ?? 0 }}/{{ intern.requiredHours }} hours
                  </p>
                </div>
              </div>
            </NuxtLink>
          </div>

          <template #footer>
            <UButton to="/interns/new" block icon="i-heroicons-plus" variant="outline" size="xl" color="primary">
              Add Intern
            </UButton>
          </template>
        </UCard>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

interface InternInfo {
  id: string;
  name: string;
  pictureUrl: string | null;
  hoursCompleted: number | null;
  requiredHours: number;
}

interface BatchData {
  details: {
    id: string;
    batchNumber: string;
    statusText: string;
  };
  interns: InternInfo[];
}

const route = useRoute();
const batchId = '1';

const { data: batchData, pending, error } = await useFetch<BatchData>(`/api/batch/${batchId}`);
</script>