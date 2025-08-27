<template>
  <UApp>
    <UContainer>
    <div class=" items-start gap-4 max-w-md mx-auto w-full">

      <div class="flex items-center space-x-4 mb-4">
        <UButton icon="i-lucide-arrow-left" color=secondary variant="ghost" aria-label="Go back" @click="goBack"/>
          <h1 class="text-2xl font-semibold md:text-2xl  text-gray-900 dark:text-white ">
            Edit Batch
          </h1>
      </div>

      <UForm :state="{}" @submit="submit" class="space-y-6 ">
        <div class="flex space-x-4 ">
          <UFormField name="batchNumber" class="grow " :error="batchNumberError()">
            <div>
              Batch Number : <span class="text-red-500">*</span>
            </div>
            
            <UInput class="w-full"  v-model.trim="form.batch_number" placeholder="Batch" size="xl" />
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
          <UFormGroup name="slectedSupervisorId" class="grow"  :error="supervisorError()">
            <div>
              Intern Supervisor : <span class="text-red-500">*</span>
            </div>
            <USelect v-model="form.selectedSupervisorId" :items="supervisorList" 
              value-key="value" class="w-48 items-center space-x-10 w-full max-w-md" />
          </UFormGroup>
        </section>

        <UButton type="submit" text=regular label="Save Batch" :loading="isLoading" color=primary block size="lg"
          class="mt-8" />
      </UForm>
    </div>
    </UContainer>
  </UApp>
</template>

<script setup lang="ts">
import { useBatchForm } from '~/components/batch-form';
import { useRoute } from 'vue-router'

const route = useRoute();
const router = useRouter()

function goBack(){
  router.back()
}
const batchId = route.query.id as string;
definePageMeta({
		layout: 'admin',
	})

const {
   batchNumberError,
    startDateError,
    supervisorError,
  form,       
  supervisorList,  
  calendarDate,
  isLoading,     
  submit,      
} = useBatchForm(batchId);

</script>
