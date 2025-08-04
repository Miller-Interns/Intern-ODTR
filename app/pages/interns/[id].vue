<script setup lang="ts">
import { defineAsyncComponent, ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { FormSubmitEvent } from '#ui/types'
import type { TabsItem } from '#ui/types'
import type { Status } from '~/generated/prisma'
import InternProfileHeader from '~/components/intern-profile-header.vue'
import type { InternDetails } from '~/interfaces/interfaces'
import { UAlert, UButton, UCard, UForm, UIcon, UTabs, UModal} from '#components'

const AccountDetails = defineAsyncComponent(() => import('~/components/intern-details.vue'))
const TimeLog = defineAsyncComponent(() => import('~/components/time-log.vue')) 
const route = useRoute()
const toast = useToast()
const internId = route.params.id as string
const isEditing = ref(false)
const newAvatarFile = ref<File | null>(null)  
const avatarPreviewUrl = ref<string | null>(null)  
const isModalOpen = ref(false)
const items: TabsItem[] = [
  { slot: 'personalinfo', label: 'Personal Info' },
  { slot: 'timelog', label: 'Time Log' },
]

const { data: form, pending, error, refresh } = await useFetch<InternDetails>(`/api/interns_details/${internId}`)

function startEditing() {
  isEditing.value = true
}

async function cancelEditing() {
  newAvatarFile.value = null
  avatarPreviewUrl.value = null

  await refresh()
  isEditing.value = false
  toast.add({ title: 'Edit cancelled', color: 'info' })
}

async function saveChanges(event: FormSubmitEvent<InternDetails>) {
  if (!form.value) return
  const savingToast = toast.add({ title: 'Saving changes...', color: 'secondary' })
  try {
    if (newAvatarFile.value) {
      const formData = new FormData()
      formData.append('avatar', newAvatarFile.value)
      await $fetch(`/api/interns/${internId}/upload-picture`, {
        method: 'POST',
        body: formData,
      })
    }

    await $fetch(`/api/interns_details/${internId}`, {
      method: 'PUT',
      body: event.data,
    })

    toast.update(savingToast.id, { title: 'Intern details updated successfully!', color: 'success' })
    isEditing.value = false
    
    newAvatarFile.value = null
    avatarPreviewUrl.value = null
    await refresh()

  } catch (err: any) {
    toast.update(savingToast.id, { title: 'Error Saving', description: err.data?.statusMessage || 'Could not save changes.', color: 'error' })
  }
}

async function markAsCompleted() {
  isModalOpen.value = false
  if (!form.value) return

  const statusToast = toast.add({ title: 'Updating status...', color: 'secondary' })
  try {
    const payload = { ...form.value, status: 'COMPLETED' }
    await $fetch(`/api/interns_details/${internId}`, {
      method: 'PUT',
      body: payload,
    })
    toast.update(statusToast.id, { title: 'Intern marked as Completed!', color: 'success' })
    await refresh()
  } catch (err: any)
  {
    toast.update(statusToast.id, { title: 'Error Updating Status', description: err.data?.statusMessage || 'Could not update status.', color: 'error' })
  }
}

function handleStatusUpdate(newStatus: Status) {
  if (!form.value) return
  form.value.status = newStatus
}

function handlePictureUpload(file: File) {
  if (!form.value) return
  newAvatarFile.value = file

  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value)
  }
  avatarPreviewUrl.value = URL.createObjectURL(file)
}

onUnmounted(() => {
  if (avatarPreviewUrl.value) {
    URL.revokeObjectURL(avatarPreviewUrl.value)
  }
})
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="pending" class="text-center py-12 text-black dark:text-white">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      <p>Loading intern details...</p>
    </div>
    <UAlert v-else-if="error || !form" icon="i-heroicons-exclamation-triangle" color="error" variant="soft" title="Error Loading Data" description="Could not find intern data." />
    <UForm v-else :state="form" @submit="saveChanges">
      <div class="flex items-center justify-between mb-4">
        <UButton to="/interns/list-of-interns" icon="i-heroicons-arrow-left-20-solid" color="secondary" variant="ghost" label="Back to Interns" size="xl"/>
      </div>
      <UCard class="mb-6">
        <InternProfileHeader 
          :intern="form" 
          :is-editing="isEditing"
          :preview-src="avatarPreviewUrl"
          @update:status="handleStatusUpdate" 
          @upload-picture="handlePictureUpload" 
        />
      </UCard>
      <UTabs :items="items" variant="link" :ui="{ trigger: 'grow' }"  class="w-full">
        <template #personalinfo>
          <UCard class="mt-4">
            <AccountDetails :details="form" :is-editing="isEditing" />
            <div class="flex flex-col gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <template v-if="isEditing">
                <UButton type="submit" label="Save Changes" size="xl" block  />
                <UButton color="primary" variant="outline" label="Cancel" size="xl" block @click="cancelEditing" />
              </template>
              <template v-else>
                <UButton type="button" icon="i-heroicons-pencil-square" label="Edit Info" size="xl" block @click="startEditing" />
                <UModal title="Mark as Completed?" close-icon="i-lucide-arrow-right" v-model="isModalOpen">
                  <UButton v-if="form.status !== 'COMPLETED'" icon="i-heroicons-check-badge" color="primary" variant="outline" label="Mark as Completed" size="xl" block @click="isModalOpen = true" />
                  <template #header ="{close}">
                    <div class="flex flex-col items-left text-left p-4">
                      <h3 class="text-xl font-bold text-black dark:text-white">Are you sure to mark as completed intern?</h3>
                      <h4 class="mt-2 text-sm text-black dark:text-white">This action cannot be undone.</h4>
                      <div class="mt-6 flex space-x-3 justify-center">
                        <UButton label="Cancel" color="primary" variant="outline" class="px-6 py-2.5 " @click="close" />
                        <UButton label="Confirm" color="primary" variant="solid" class="px-6 py-2.5" @click="markAsCompleted" />
                      </div>
                    </div>
                  </template>
                </UModal>
              </template>
            </div>
          </UCard>
        </template>
        <template #timelog>
          <UCard class="mt-4">
            <TimeLog :details="form" />
          </UCard>
        </template>
      </UTabs>
    </UForm>
  </div>
</template>