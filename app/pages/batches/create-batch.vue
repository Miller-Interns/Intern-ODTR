<template>
  <UApp>
    <div class="max-w-md mx-auto p-6 w-full">

      <div class="flex items-center space-x-4">
        <NuxtLink to="/batches">
          <UButton icon="i-lucide-corner-up-left" color=secondary variant="ghost" aria-label="Go back" />
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white ">
          Create Batch
        </h1>
      </div>
      <UForm state="formState" @submit="submit" class="space-y-6 ">

        <div class="flex space-x-4 ">
          <UFormGroup name="batchNumber" class="grow " required>
            <div>
              Batch Number : <span class="text-red-500">*</span>
            </div>
            <UInput class="w-full" v-model.trim="form.batch_number" placeholder="Batch" size="xl" />
          </UFormGroup>
        </div>

        <section class="items-center space-x-10 w-full max-w-md">
          <UFormGroup name="startDate" class="grow" required>

            <div>
              Start Date : <span class="text-red-500">*</span>
            </div>
            <UInput class="w-full" v-model="form.start_date" type="date" size="xl" />
          </UFormGroup>
        </section>

        <section class="items-center space-x-10 w-full max-w-md">
          <UFormGroup name="slectedSupervisorId" class="grow" required>

            <div>
              Intern Supervisor : <span class="text-red-500">*</span>
            </div>
            <USelect v-model="form.selectedSupervisorId" :items="supervisorList" placeholder="Select Intern Supervisor"
              value-key="value" class="w-48 items-center space-x-10 w-full max-w-md" />
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

import { useBatchForm  } from '~/components/batch-form';
const {
  form,         
  supervisorList, 
  isLoading,  
  error,        
  submit,        
} = useBatchForm();
</script>
