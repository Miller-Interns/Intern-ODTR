<template>

  <div class="max-w-md mx-auto p-6 w-full h-full">

    <div class="flex items-center space-x-4">
      <UButton icon="i-lucide-corner-up-left" color=secondary variant="ghost" aria-label="Go back" @click="goBack" />
      <h1 class="text-xl font-bold text-gray-900 dark:text-white ">
        Edit Batch
      </h1>
    </div>


    <UForm :state="{}" @submit="submitBatch" class="space-y-6 ">

      <div class="flex space-x-4 ">
        <UFormGroup name="batchNumber" class="grow " required>
          <div>
            Batch Number : <span class="text-red-500">*</span>
          </div>
          <UInput class="w-full" v-model.trim="batchNumber" placeholder="Batch" size="xl" />
        </UFormGroup>
      </div>


    
      <section class="items-center space-x-10 w-full max-w-md">
        <UFormGroup name="startDate" class="grow" required>

          <div>
            Start Date : <span class="text-red-500">*</span>
          </div>
          <UInput class="w-full" v-model="startDate" type="date" size="xl" />
        </UFormGroup>
      </section>

      <section class="items-center space-x-10 w-full max-w-md">
        <UFormGroup name="slectedSupervisorId" class="grow" required>

          <div>
            Intern Supervisor : <span class="text-red-500">*</span>
          </div>
          <USelect v-model="selectedSupervisorId" :items="supervisorList" placeholder="Select Intern Supervisor" value-key="value"
            class="w-48 items-center space-x-10 w-full max-w-md" />
        </UFormGroup>
      </section>

  




      <UButton type="submit" text=regular label="Save Batch" :loading="isSubmitting" color=primary block size="lg"
        class="mt-8" />


      <UAlert v-if="successMessage" icon="i-heroicons-check-circle" color=success variant="subtle"
        :title="successMessage" @close="successMessage = ''" />
      <UAlert v-if="errorMessage" icon="i-heroicons-x-circle" color=error variant="subtle" :title="errorMessage"
        @close="errorMessage = ''" />
    </UForm>
  </div>
</template>


<script setup lang="ts">
import { Status } from "~/enums/status";
import { type BatchWithInternCount} from '~/interfaces/batch-response';
import { getTodayDateString } from '~/composables/today-date';
import {format} from 'date-fns'

definePageMeta({
  path: '/editBatch'
});


const route = useRoute();
const router = useRouter();
const batchId = route.query.id as string;


const batchData = ref<BatchWithInternCount | null>(null);
const pending = ref(true);
const fetchError = ref<Error | null>(null);


const batchNumber = ref('');
const startDate =ref<string>('');
const selectedSupervisorId = ref<string>('');

const todayString =  getTodayDateString();

console.log("start")
console.log(startDate)
console.log("today")
console.log(todayString)
const isSubmitting = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

function goBack() {
  router.push('/'), 1500;
}

onMounted(async () => {
  if (!batchId) {
    fetchError.value = new Error("No Batch ID found in the URL.");
    pending.value = false;
    return;
  }
  try {
    batchData.value = await $fetch<BatchWithInternCount>('/api/batches/single', {
      method: 'GET',
      query: {
        id: batchId
      }
    });
  } catch (err: any) {
    fetchError.value = err;
  } finally {
    pending.value = false;
  }
});

watchEffect(() => {
  if (batchData.value) {
    batchNumber.value = batchData.value.batch_number.toString();
    startDate.value=format(new Date(batchData.value.start_date), 'yyyy-MM-dd');
  }
});


async function submitBatch() {
  
const statusToSet = startDate.value > todayString ? Status.INCOMING : Status.ONGOING;
  if (!selectedSupervisorId.value) {
    errorMessage.value = "Please select a supervisor.";
    return;
  }

  try {
    await $fetch<BatchWithInternCount>(`/api/batches/edit`, {
      method: 'PATCH',
      body: {
        id: batchId,
        batch_number: batchNumber.value,
        start_date: startDate.value,
        status: statusToSet,
        supervisorId: selectedSupervisorId.value,
      },
    });
    isSubmitting.value = true;
    errorMessage.value = '';
    successMessage.value = 'Batch updated successfully! Redirecting...';
    setTimeout(() => router.push('/'), 1500);

  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'An unexpected error occurred.';
  } finally {
    isSubmitting.value = false;
  }
}


const { data: supervisorList, pending: status } = await useFetch('/api/batches/admin', {
  key: 'typicode-users',
  transform: (data: { id: string, name: string }[]) => {
    return data?.map(user => ({
      label: user.name,
      value: String(user.id),
    }))
  },
  lazy: true
})
</script>
