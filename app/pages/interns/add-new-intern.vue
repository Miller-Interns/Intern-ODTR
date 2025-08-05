<template>
  <UContainer class="py-8">
    <div class="flex items-center gap-4 mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        color="secondary"
        variant="ghost"
        size="xl"
        class="-ml-4"
        aria-label="Back"
        @click="$router.back()"
      />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add Intern</h1>
    </div>
    <UForm :state="state" class="space-y-8" @submit="onSubmit">
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
          <UInput v-model="state.password" type="password" placeholder="Enter Password" size="xl" class="w-full"/>
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
            :loading="isSchoolsLoading"
            @create="onCreate"
            placeholder="Select or enter a new school" 
            size="xl"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Course and Year Level:" name="courseYear" required>
          <UInput v-model="state.courseYear" placeholder="Enter Course and Year Level eg.BSCPE - 3rd Year" size="xl" class="w-full"/>
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
import type { FormSubmitEvent } from '#ui/types'
import { UInput } from '#components'

const router = useRouter()

const { data: schools, pending: isSchoolsLoading } = useAsyncData('schools', () => {
  return $fetch<string[]>('/api/school')
}, {
  default: () => []
})

const schoolOptions = ref<string[]>([])

watch(schools, (newSchools) => {
  if (newSchools) {
    schoolOptions.value = [...newSchools]
  }
}, { immediate: true }) 

function onCreate(newItem: string) {
  schoolOptions.value.push(newItem)
}

const state = reactive({
  firstName: undefined,
  middleName: undefined,
  lastName: undefined,
  contactNumber: undefined,
  emergencyContactPerson: undefined,
  emergencyContactNumber: undefined,
  email: undefined,
  password: undefined,
  school: undefined,
  courseYear: undefined,
  requiredHours: undefined,
  role: undefined,
  note: undefined,
})

const isLoading = ref(false)
const toast = useToast()

async function onSubmit (event: FormSubmitEvent<any>) {
  isLoading.value = true
  try {
    const { error } = await useFetch('/api/add_interns', {
      method: 'POST',
      body: event.data,
    })

    if (error.value) {
      toast.add({
        title: 'Error Creating Intern',
        description: error.value.data?.statusMessage || 'An unexpected error occurred.',
        color: 'error'
      })
    } else {
      toast.add({
        title: 'Success!',
        description: 'Intern has been added successfully.',
        color: 'success'
      })
       router.push('/interns/list-of-interns')
    }
  } catch (err) {
    toast.add({
      title: 'Network Error',
      description: 'Could not connect to the server. Please try again.',
      color: 'error'
    })
  } finally {
    isLoading.value = false
  }
}
</script>