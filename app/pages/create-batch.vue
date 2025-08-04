<template>
<UApp>
  <div class="max-w-md mx-auto p-6 w-full">

    <div class="flex items-center space-x-4">
      <UButton icon="i-lucide-corner-up-left" color=secondary variant="ghost" aria-label="Go back" @click="goBack" />
      <h1 class="text-xl font-bold text-gray-900 dark:text-white ">
        Create Batch
      </h1>
    </div>


    <UForm state="formState" @submit="submitBatch" class="space-y-6 ">

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
      <UButton type="submit" text=regular label="Save Batch" :loading="isLoading" color=primary block size="lg"
        class="mt-8" />


      <!-- <UAlert v-if="successMessage" icon="i-heroicons-check-circle" color=success variant="subtle"
        :title="successMessage" @close="successMessage = ''" />
      <UAlert v-if="errorMessage" icon="i-heroicons-x-circle" color=error variant="subtle" :title="errorMessage"
        @close="errorMessage = ''" /> -->
    </UForm>
  </div>
</UApp>
</template>

<script setup lang="ts">
import { Status } from "~/enums/status";
import { type BatchApiResponse } from '~/interfaces/interfaces';
import { getTodayDateString } from '~/composables/today-date';



definePageMeta({
  path: "/createBatch",
});

const router = useRouter()
const toast= useToast()
const batchNumber = ref<string>('');
const startDate = ref<string>('');

;


const selectedSupervisorId = ref<string>('');

const isLoading = ref<boolean>(false);
const successMessage = ref<string>('');
const errorMessage = ref<string>('');




onMounted(() => {
  startDate.value = getTodayDateString();
  selectedSupervisorId.value = '';

});

function goBack() {
  router.push('/'), 1500;
}


  const todayString = getTodayDateString();


async function submitBatch() {
  console.log("Submit function started.");

  if (!selectedSupervisorId.value) {
    errorMessage.value = 'Please select a supervisor.';
    return;
  }

  successMessage.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  const statusToSet = startDate.value > todayString ? Status.INCOMING : Status.ONGOING;
  console.log("into to $fetch...");
  try {
    console.log("Attempting to $fetch...");

    const response = await $fetch<BatchApiResponse>('/api/batches/Post-batch', {
      method: 'POST',
      body: {
        batch_number: batchNumber.value,
        start_date: startDate.value,
        status: statusToSet,
        supervisorId: selectedSupervisorId.value,

      },
    });
    console.log("API response received:", response);
    if (response.success) {
        toast.add({
      title: 'Batch create Successful',
      description: `Successfully created Batch ${batchNumber.value}`,
        
    })

      batchNumber.value = '';
      startDate.value = getTodayDateString();
      router.push('/');
    }
  } catch (error: any) {
    errorMessage.value = error.data?.statusMessage || 'An unexpected error occurred.';
  } finally {
    isLoading.value = false;
  }
}

const { data: supervisorList } = await useFetch('/api/batches/admin', {
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
