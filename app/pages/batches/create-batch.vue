<template>
  <UApp>
    <div class="max-w-md mx-auto p-6 w-full">

      <div class="flex items-center space-x-4">
        <NuxtLink to="/batches">
          <UButton icon="i-lucide-arrow-left" color=secondary variant="ghost" aria-label="Go back" />
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white ">
          Create Batch
        </h1>
      </div>
      <UForm state="formState" @submit="submit" class="space-y-4 ">

        <div class="flex space-x-4 ">
          <UFormField name="batchNumber" class="grow " :error="batchNumberError">
            <div>
              Batch Number : <span class="text-red-500">*</span>
            </div>

            <UInput class="w-full" v-model.trim="form.batch_number" placeholder="Batch" size="xl"  />

          </UFormField>
        </div>
        <!-- 
        <section class="items-center  space-x-10 w-full max-w-md">
          <UFormGroup  name="startDate" class="grow" required>

            <div>
              Start Date : <span class="text-red-500">*</span>
            </div>
            <UInput class="w-full"  v-model="form.start_date" type="date" size="xl" />
          </UFormGroup>
      
        </section> -->



        <section class="items-center  space-x-10 w-full max-w-md">
          <UFormField name="startDate" class="grow" :error="startDateError" >

            <div class="flex items-center gap-2">

              <UInput v-model="form.start_date" color="neutral" variant="outline" icon="i-lucide-calendar"
                class="grow" />
              <UPopover>
                <UButton class='bottom-end ' icon="i-lucide-calendar" color="neutral" variant="subtle" />

                <template #content>
                  <UCalendar class="
              p-10 text-lg" v-model="calendarDate" />
                </template>
              </UPopover>
            </div>


          </UFormField>

        </section>

        <section class="items-center space-x-10 w-full max-w-md">
          <UFormField name="slectedSupervisorId" class="grow" :error="supervisorError">

            <div>
              Intern Supervisor : <span class="text-red-500">*</span>
            </div>
            <USelect
              class=" w-48 items-center w-full max-w-md box-shadow-[0px 4px 6px -2px #0000000D] box-shadow-[0px 10px 15px -3px #0000001A]"
              v-model="form.selectedSupervisorId" :items="supervisorList" placeholder="Intern Supervisor" icon="icon"
              value-key="value" />
          </UFormField>
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

import { useBatchForm } from '~/components/batch-form';




const {
     startDateError,
    batchNumberError,
    supervisorError,
  form,
  supervisorList,
  calendarDate,
  isLoading,
  error,
  submit,
} = useBatchForm();
</script>
