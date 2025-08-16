<template>

    <div class="p-4 sm:p-6 lg:p-8 min-w-[327px] min-h-[336px] mx-auto font-sans ">
      <div v-if="pending">
        <h2 class="text-2xl font-semi-bold text-gray-800 dark:text-gray-100 mb-4 ">Manage Batch</h2>
        <USkeleton class="h-56 w-full mb-4" />
        <USkeleton class="h-12 w-full mb-8" />
 
      </div>

      <div v-else-if="error">
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold text-red-600">Error</h2>
          </template>
          <p>Could not load batches. Please try again later.</p>
          <pre class="mt-4 p-2 bg-red-50 rounded-md text-red-700 text-xs">{{ error.message }}</pre>
        </UCard>
      </div>


      <div v-else class="flex flex-col ">
        <section>
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 ">Manage</h2>
          <div v-if="currentBatches.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px] ">
            <div v-for="batch in currentBatches" :key="batch.id">

              <UCard :ui="{ footer: 'py-3 px-4 sm:px-6' }" class="flex flex-col space-y-1 shadow-[0_5px_15px_rgba(0,0,0,0.1),_0_3px_6px_rgba(0,0,0,0.08)]
        box-shadow-[ 0px 4px 4px 0px #00000040] ">
                <template #header>
                  <div class="flex justify-between  items-center gap-x-3">
                    <h3 class="text-xl  font-semibold text-gray-900 dark:text-white">Batch {{ batch.batch_number }}</h3>
                    <UBadge class="rounded-full" :color="batch.status == 'ONGOING' || batch.status == 'INCOMING' ? 'success' : 'primary'" variant=soft size="md">{{ capitalize(batch.status) }}
                    </UBadge>
                  </div>
                </template>


                <div class="min-w-[279px] min-h-[138px] text-sm text-gray-700 dark:text-gray-300 flex justify-between items-start ">
                  <div class="space-y-[12px]">
                    <div>
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400">No. of Interns</p>
                      <div v-if="batch.intern_count > 0">
                        <p class="font-medium" color=secondary>{{ batch.intern_count }} Intern added</p>
                      </div>
                      <div v-else>
                        <p class="font-medium" color=secondary>No Intern added Yet</p>
                      </div>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Started in</p>
                      <p class="font-medium">{{ formatDate(batch.start_date) }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Intern Supervisor</p>
                      <p class="font-medium">{{ batch.supervisor_name || 'N/A' }}</p>
                    </div>
                  </div>
                  <NuxtLink :to="`batches/edit-batch?id=${batch.id}`">
                    <UButton icon="i-lucide-pen" color=primary variant="ghost" class="min-w-[20px] min-h-[20px]"
                      aria-label="Edit Batch" />
                  </NuxtLink>
                </div>

                <template #footer>
                  <UButton class="py-2.5" :to="`/viewBatch?id=${batch.id}`" label="View Batch Details" color=primary
                    variant="outline" block />
                  <div class="mt-3">
                    <UModal v-model:open="openModal" :dismissible="false">
                      <UButton label="Mark Batch As Completed" class="py-2.5" color="primary" variant="outline"
                        @click="openConfirmationModal(batch.id)" block />

                      <template #header="{ close }">
                        <div class="flex flex-col items-left text-left p-4">
                          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Mark as Completed</h3>
                          <h4 class="mt-2 text-sm text-gray-500 dark:text-gray-400">Are you sure you want to mark all
                            interns
                            in the batch as completed</h4>

                          <div class="mt-6 flex space-x-3 justify-center">
                            <UButton label="Cancel" color="primary" variant="outline" class="px-6 py-2.5 "
                              @click="close" />
                            <UButton label="Confirm" color="primary" variant="solid" class="px-6 py-2.5"
                              @click="endTime" />

                          </div>
                        </div>
                      </template>
                    </UModal>
                  </div>
                </template>
              </UCard>
            </div>
          </div>
          <p v-else class="text-regular text-gray-500 dark:text-gray-400 items-center mt-4 flex flex-col py-[112px] shadow-[0_5px_15px_rgba(0,0,0,0.1),_0_3px_6px_rgba(0,0,0,0.08)]
        box-shadow-[ 0px 4px 4px 0px #00000040] ">No active batches.</p>
        </section>

        <section class="w-full mt-3 flex flex-col  mb-4 bottom-0 left-1/2 -translate-x-1/2 p-4 z-50 fixed">
          <NuxtLink to="/batches/create-batch">
            <UButton  icon="i-lucide-plus" label="Create Batch" variant=solid color=primary block
              size=xl />
          </NuxtLink>
        </section>

        <section class="py-10 pb-40">
          <div v-if="previousBatches.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <UCard v-for="batch in previousBatches" :key="batch.id">
              <template #header>
                <div class="flex justify-between  items-center gap-x-3">
                    <h3 class="text-xl  font-semibold text-gray-900 dark:text-white">Batch {{ batch.batch_number }}</h3>
                    <UBadge class="rounded-full" color=neutral variant=soft size="md">{{ capitalize(batch.status) }}
                    </UBadge>
                  </div>
              </template>
              <div class="space-y-[12px] text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <p class="font-medium text-gray-500 dark:text-gray-400">No. of Interns</p>
                      <div v-if="batch.intern_count > 0">
                        <p class="font-medium" color=secondary>{{ batch.intern_count }} Intern added</p>
                      </div>
                      <div v-else>
                        <p class="font-medium" color=secondary>No Intern Added Yet</p>
                      </div>
                    </div>
                    <div>
                      <p class="font-medium text-gray-500 dark:text-gray-400">Started in</p>
                      <p class="font-medium">{{ formatDate(batch.start_date) }}</p>
                    </div>
                     <div>
                      <p class="font-medium text-gray-500 dark:text-gray-400">Ended on</p>
                      <p class="font-medium">{{ formatDate(batch.end_date) }}</p>
                    </div>
                    <div>
                      <p class="font-medium text-gray-500 dark:text-gray-400">Intern Supervisor</p>
                      <p class="font-medium">{{ batch.supervisor_name || 'N/A' }}</p>
                    </div>
              </div>
              <template #footer>
                <UButton class="py-2.5" :to="`/viewBatch?id=${batch.id}`" label="View Batch Details" color=primary
                  variant="outline" block />

              </template>
            </UCard>
          </div>
        </section>
      </div>
    </div>

</template>

<script setup lang="ts">
import { capitalize } from '~/server/db/utils/format'
import { type BatchWithInternCount } from '~/types/Types';
import { formatDate } from '~/server/db/utils/format'
import { getTodayDateString } from '~/composables/today-date';

definePageMeta({
  layout: 'batch'
})
const allBatches = ref<BatchWithInternCount[]>([]);
const pending = ref(false);
const error = ref<Error | null>(null);
const toast = useToast()
const data = await $fetch<BatchWithInternCount[]>('/api/batches/batch');
allBatches.value = data;

const openModal = ref(false)
const selectedBatchId = ref<string | null>(null);
const openConfirmationModal = (batchId: string) => {
  selectedBatchId.value = batchId;
  openModal.value = true;
};

const triggerServerStatusUpdate = async () => {
  try {
    const updatedBatchList = await $fetch<BatchWithInternCount[]>('/api/batches/status', {
      method: 'PATCH'
    });

    if (updatedBatchList) {
      const updatedBatches = await $fetch<BatchWithInternCount[]>('/api/batches/batch');
      allBatches.value = updatedBatches;
    } else {
      throw new Error('API indicated a failure without throwing an error.');
    }

  } catch (error: any) {
    console.error('Failed to update batch end time:', error);
    toast.add({
      title: 'Update Failed',
      description: error.data?.message || 'Could not complete the batch. Please try again.',

    });
  }
};
watchEffect((onInvalidate) => {
  const batches = allBatches.value;
  if (!batches || batches.length === 0) {
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const needsUpdate = batches.some(batch =>
    batch.status === 'INCOMING' && new Date(batch.start_date) <= today
  );

  if (needsUpdate) {
    triggerServerStatusUpdate();
  }
});


const endTime = async () => {
  if (!selectedBatchId.value) {
    console.error("No batch selected to end.");
    toast.add({
      title: 'Error',
      description: 'Please select a batch first.',
    });
    return;
  }

  try {
    const today = new Date();

    const response = await $fetch('/api/batches/end-time', {
      method: 'PATCH',
      body: {
        id: selectedBatchId.value,
        end_date: today.toISOString(), // Send as ISO string for consistency
      }
    });


    if (response) {

      openModal.value = false;
      toast.add({
        title: 'Batch Completed Successfully',
        description: 'The batch has been marked as completed.',

      });
      const updatedBatches = await $fetch<BatchWithInternCount[]>('/api/batches/batch');
      allBatches.value = updatedBatches;
    } else {
      throw new Error('API indicated a failure without throwing an error.');
    }

  } catch (error: any) {
    console.error('Failed to update batch end time:', error);
    toast.add({
      title: 'Update Failed',
      description: error.data?.message || 'Could not complete the batch. Please try again.',

    });
  }
};
const currentBatches = computed(() => {
  if (!allBatches.value) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allBatches.value.filter(batch => batch.end_date === null);
});
const previousBatches = computed(() => {
  if (!allBatches.value) return [];
  return allBatches.value.filter(batch => batch.end_date !== null);
});
defineShortcuts({
  o: () => openModal.value = !openModal.value
})
</script>
