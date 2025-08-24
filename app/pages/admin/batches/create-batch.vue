<template>
  <UApp>
    <div class="max-w-md mx-auto p-6 w-full">

      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin/batches">
          <UButton icon="i-lucide-arrow-left" color=secondary variant="ghost" aria-label="Go back" />
        </NuxtLink>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white ">
          Create Batch
        </h1>
      </div>
      <UForm state="formState" @submit="submit" class="space-y-4 ">

        <div class="flex space-x-4 ">
          <UFormField name="batchNumber" class="grow " :error="batchNumberError()">
            <div>
              Batch Number : <span class="text-red-500">*</span>
            </div>

            <UInput class="w-full" v-model.trim="form.batch_number" placeholder="Batch" size="xl" />

          </UFormField>
        </div>



        <section class=" space-x-10 w-full max-w-md">
          <UFormField name="startDate" class="grow" :error="startDateError()">
            <div>
              Start Date : <span class="text-red-500">*</span>
            </div>
            <div class="flex gap-2 ">

              <UInput v-model="form.start_date" color="neutral" variant="outline" class="grow">
                <template #trailing>
                  <UPopover>
                    <UButton trailing-icon="i-lucide-calendar" variant="link" :padded="false" />

                    <template #content>
                      <UCalendar class="max-w-[326px] max-h-[308px] text-xl p-3 text-base font-semibold" v-model="calendarDate" />
                    </template>
                  </UPopover>
                </template>
              </UInput>
            </div>
          </UFormField>
        </section>

        <section class="items-center space-x-10 w-full max-w-md">
          <UFormField name="slectedSupervisorId" class="grow" :error="supervisorError()">

            <div>
              Intern Supervisor : <span class="text-red-500">*</span>
            </div>
            <USelect
              class=" w-48 items-center w-full max-w-md box-shadow-[0px 4px 6px -2px #0000000D] box-shadow-[0px 10px 15px -3px #0000001A]"
              v-model="form.selectedSupervisorId" :items="supervisorList" placeholder="Intern Supervisor" icon="icon"
              value-key="value" />
          </UFormField>
        <p v-if="error.message" class="text-red-500 mt-2 text-sm">
  {{ error.message }}
</p>
        </section>
        <UButton type="submit" text=regular label="Save Batch" :loading="isLoading" color=primary block size="lg"
          class="mt-8" />

    
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
