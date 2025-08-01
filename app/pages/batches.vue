<script setup lang="ts">
import {capitalize} from '~/server/db/utils/format'
import { type BatchWithInternCount } from '~/interfaces/batch-response';
import { formatDate } from '~/server/db/utils/format'
import { getTodayDateString } from '~/composables/today-date';



definePageMeta({
    path: '/',
    layout: 'batch'
})


const { data: allBatches, pending, error } = await useFetch<BatchWithInternCount[]>('/api/batches/batch');



const triggerServerStatusUpdate = async () => {
    try {
        const updatedBatchList = await $fetch<BatchWithInternCount[]>('/api/batches/status', {
            method: 'PATCH'
        });
        allBatches.value = updatedBatchList;

    } catch (e) {
        console.error('Client: Failed to trigger the server-side status update:', e);
    }

};

watchEffect((onInvalidate) => {
    const batches = allBatches.value;

    if (!batches || batches.length === 0) {
        return;
    }

    console.log("watchEffect is running with loaded batches.");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const needsUpdate = batches.some(batch =>
        batch.status === 'INCOMING' && new Date(batch.start_date) <= today
    );

    if (needsUpdate) {
        triggerServerStatusUpdate();
    }


});

const endTime = async (batchId: string) => {

    try {
        const today = getTodayDateString()
        const batchComplete = await $fetch<BatchWithInternCount[]>('api/batches/endTime', {
            method: 'PATCH',
            body: {
                id: batchId,
                end_date: today,
            }
        });
        allBatches.value = batchComplete;
    }
    catch (error: any) {
        console.error('Failed to update batch end time:', error);

    }
}


const currentBatches = computed(() => {
    if (!allBatches.value) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(today)
    return allBatches.value.filter(batch => batch.end_date === null);
});

const previousBatches = computed(() => {
    if (!allBatches.value) return [];
    return allBatches.value.filter(batch => batch.end_date !== null);
});



</script>
<template>

  <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto font-sans">

    
    <div v-if="pending">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Manage Batch</h2>
      <USkeleton class="h-56 w-full mb-4" />
      <USkeleton class="h-12 w-full mb-8" />
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Previous Batches</h2>
      <USkeleton class="h-48 w-full" />
    </div>

    <div v-else-if="error">
      <UCard >
        <template #header>
          <h2 class="text-xl font-bold text-red-600">Error</h2>
        </template>
        <p>Could not load batches. Please try again later.</p>
        <pre class="mt-4 p-2 bg-red-50 rounded-md text-red-700 text-xs">{{ error.message }}</pre>
      </UCard>
    </div>

 
    <div v-else class="flex flex-col gap-y-10">
      <section>
        <h2 class="text-regular font-bold text-gray-800 dark:text-gray-100 mb-4 md:text-3xl">Manage Batch</h2>
        
        <div v-if="currentBatches.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
          <div v-for="batch in currentBatches" :key="batch.id">
           
            <UCard :ui="{ footer:  'py-3 px-4 sm:px-6'  }"
        
            class="flex flex-col space-y-1 shadow-[0_5px_15px_rgba(0,0,0,0.1),_0_3px_6px_rgba(0,0,0,0.08)]
        dark:shadow-[0_5px_15px_rgba(0,0,0,0.3),_0_3px_6px_rgba(0,0,0,0.25)] ">
              <template #header>
                <div class="flex justify-between items-center">
                  <div class="flex left gap-3">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Batch {{ batch.batch_number }}</h3>
                    <UBadge class="rounded-full"  color=primary variant=solid size="md">{{ capitalize(batch.status) }}</UBadge>
                    </div>
                          <div class="flex right items-center">
                    <NuxtLink :to="`/editBatch?id=${batch.id}`">
                      <UButton icon="i-lucide-pencil-line" color=secondary variant="ghost" size="sm" aria-label="Edit Batch" />
                    </NuxtLink>
                          </div>
                </div>
              </template>
             
              
              <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300 flex-grow">
                <div>
                  <p class="font-medium text-gray-800 dark:text-gray-100">{{ batch.intern_count ?? 0}}/5 Interns</p>
                  <p class="text-gray-500 dark:text-gray-400">({{ 5 - (batch.intern_count ?? 0) }} Slots Available)</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Started in</p>
                  <p class="font-medium">{{ formatDate(batch.start_date) }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Intern Supervisor</p>
                  <p class="font-medium">{{ batch.supervisor_name || 'N/A' }}</p>
                </div>
              </div>
              

               <template #footer>
        
                 <UButton class="py-2.5" :to="`/viewBatch?id=${batch.id}`" label="View Batch Details" color=primary variant="outline" block />
              
                </template>

            </UCard>

       
            <div class="mt-3 flex flex-col py-5">
             
              <UButton class="py-2.5" @click="endTime(batch.id)" label="Mark Batch As Completed" color=primary variant=solid block />
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 dark:text-gray-400 mt-4">No active batches.</p>
      </section>

      
      <section class="mt-3 flex flex-col  mb-4">
        <NuxtLink to="/createBatch">
          <UButton class="py-2.5" icon="i-lucide-plus"  label="Create Batch" variant=solid color=primary  block size=xl />
        </NuxtLink>
      </section>

    
      <section>
        <h2 class="text-regular font-bold text-gray-800 dark:text-gray-100 mb-4 md:text-3xl">Previous Batches</h2>
        
        <div v-if="previousBatches.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <UCard v-for="batch in previousBatches" :key="batch.id">
            <template #header>
              <div class="flex left items-center gap-3">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Batch {{ batch.batch_number }}</h3>
                <UBadge class="rounded-full" color=primary variant=solid size="md">{{ capitalize(batch.status) }}</UBadge>
              </div>
            </template>
            <div class="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-100">{{ batch.intern_count ?? 0 }}/5 Interns</p>
                <p class="text-gray-500 dark:text-gray-400">(All Slots have been filled)</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">Started on</p>
                <p class="font-medium">{{ formatDate(batch.start_date) }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">Ended On</p>
                <p class="font-medium">{{ formatDate(batch.end_date) }}</p>
              </div>
              <div>
                <p class="text-gray-500 dark:text-gray-400">Intern Supervisor</p>
                <p class="font-medium">{{ batch.supervisor_name || 'N/A' }}</p>
              </div>
            </div>
          </UCard>
        </div>
        <p v-else class="text-gray-500 dark:text-gray-400 mt-4">No previous batches found.</p>
      </section>
      
    </div>
    
  
  </div>
</template>

