<template>
  <UContainer class="py-8">
    <div class="flex items-center gap-4 mb-6">
      <UButton
        icon="i-lucide-arrow-left"
        color="secondary"
        variant="ghost"
        size="xl"
        class="-ml-4"
        aria-label="Back"
        :to="batchId ? `admin/batches/${batchId}` : '/batches'"
      />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Intern</h1>
    </div>
    
    <UForm :schema="AddInternSchema" :state="state" class="space-y-8" @submit="handleFormSubmit">
      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Intern details:</h2>
        
        <UFormField label="First Name:" name="firstName" required>
          <UInput v-model="state.firstName" placeholder="Enter First Name" size="xl" class="w-full"/>
        </UFormField>
        
        <UFormField label="Middle Name (Optional):" name="middleName">
          <UInput v-model="state.middleName" placeholder="Enter Middle Name" size="xl" class="w-full"/>
        </UFormField>

        <UFormField label="Last Name:" name="lastName" required>
          <UInput v-model="state.lastName" placeholder="Enter Last Name" size="xl" class="w-full"/>
        </UFormField>

        <UFormField label="Email:" name="email" required>
          <UInput v-model="state.email" placeholder="Enter Email Address" size="xl" class="w-full"/>
        </UFormField>

        <UFormField label="Password:" name="password" required>
          <UInput
            v-model="state.password"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Enter Password"
            size="xl"
            class="w-full">
            <template #trailing>
              <UButton
                :icon="isPasswordVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                variant="link"
                color="secondary"
                :padded="false"
                aria-label="Toggle password visibility"
                @click="isPasswordVisible = !isPasswordVisible"
              />
            </template>
          </UInput>
        </UFormField>

        <UFormField label="Contact Number:" name="contactNumber" >
          <UInput v-model="state.contactNumber" placeholder="Enter Contact Number" size="xl" class="w-full"/>
        </UFormField>

        <UFormField label="Emergency Contact Person:" name="emergencyContactPerson" >
          <UInput v-model="state.emergencyContactPerson" placeholder="Enter Emergency Contact Person" size="xl" class="w-full"/>
        </UFormField>

        <UFormField label="Emergency Contact Number:" name="emergencyContactNumber" >
          <UInput v-model="state.emergencyContactNumber" placeholder="Enter Emergency Contact Number" size="xl" class="w-full"/>
        </UFormField>
      </div>

      <div class="space-y-6">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Internship information:</h2>
        <UFormField label="School:" name="school" required>
          <UInputMenu
            v-model="state.school"
            create-item="always"
            :items="schoolOptions"
            @create="onCreate"
            placeholder="Select or enter a new school Eq. Negros Oriental State University" 
            size="xl"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Course and Year Level:" name="courseYear" required>
          <UInput v-model="state.courseYear" placeholder="Enter Course and Year Level eg.BS in Computer Engineering - 3rd Year" size="xl" class="w-full"/>
        </UFormField>

        <UFormField label="Required hours:" name="requiredHours" required>
          <UInput v-model.number="state.requiredHours" type="number" placeholder="Enter Required hours" size="xl" class="w-full"/>
        </UFormField>

        <UFormField label="Role/Position :" name="role">
          <UInput v-model="state.role" placeholder="Role/Position" size="xl" class="w-full"/>
        </UFormField>

        <UFormField label="Note/Remarks (Optional):" name="note">
          <UTextarea v-model="state.note" placeholder="Note and Remarks" size="xl" class="w-full"/>
        </UFormField>
      </div>
      
      <UButton
        type="submit"
        label="Save Intern"
        color="primary"
        size="lg"
        block
        :loading="isLoading"
      />
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from 'vue'
import type { FormSubmitEvent } from '#ui/types'
import { AddInternSchema, type AddInternDTO } from '~/types/Intern'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isLoading = ref(false)
const isPasswordVisible = ref(false)

const batchId = computed(() => route.query.batchId as string | undefined)

onMounted(() => {
  if (!batchId.value){
    toast.add({ title: 'Error', description: 'No batch was selected. Redirecting.', color: 'error' })
    navigateTo('/batches')
  }
})

type SchoolResponse = { school: string }
type SchoolOption = { label: string }

const { data: schoolsData, pending: isSchoolsLoading } = await useFetch<SchoolResponse[]>('/api/school', { lazy: true })
const schoolOptions = ref<SchoolOption[]>([])
watch(schoolsData, (newSchoolsData) => {
  if (Array.isArray(newSchoolsData)) {
    schoolOptions.value = newSchoolsData.map(s => ({ label: s.school }))
  }
}, { immediate: true })

const state = reactive({
  batchId: batchId.value,
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  school: undefined as SchoolOption | undefined,
  courseYear: '',
  requiredHours: undefined as number | undefined,
  middleName: '',
  contactNumber: '',
  emergencyContactPerson: '',
  emergencyContactNumber: '',
  role: '',
  note: '',
})

watch(batchId, (newBatchId) => {
  state.batchId = newBatchId
})


function onCreate(newSchoolLabel: string) {
  const newSchoolOption: SchoolOption = { label: newSchoolLabel }
  if (!schoolOptions.value.some(s => s.label === newSchoolLabel)) {
    schoolOptions.value.push(newSchoolOption)
  }
  state.school = newSchoolOption
}

async function handleFormSubmit(event: FormSubmitEvent<AddInternDTO>) {

  try {
    let schoolName = ''
    if (typeof event.data.school === 'object' && event.data.school?.label) {
      schoolName = event.data.school.label
    } else if (typeof event.data.school === 'string') {
      schoolName = event.data.school
    }
    
    const submissionPayload = {
      ...event.data,
      school: schoolName,
    }

    await $fetch('/api/interns', {
      method: 'POST',
      body: submissionPayload,
    })

    toast.add({ title: 'Success!', description: 'Intern has been added successfully.', color: 'success' })
    await router.push(`/admin/batches/${batchId.value}`)

  } catch (error: any) {
    console.error('Failed to add intern:', error)
    const errorMessage = error.data?.statusMessage || 'An unexpected error occurred.'
    toast.add({ title: 'Submission Failed', description: errorMessage, color: 'error' })
  } finally {
    isLoading.value = false
  }
}
</script>