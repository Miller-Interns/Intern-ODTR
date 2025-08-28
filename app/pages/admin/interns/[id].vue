<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="pending" class="text-center py-12 text-black dark:text-white">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
      <p>Loading intern details...</p>
    </div>
    <UAlert v-else-if="error || !form" icon="i-heroicons-exclamation-triangle" color="error" variant="soft" title="Error Loading Data" description="Could not find intern data." />
    <UForm v-else-if="form && form.internId" :state="form" @submit="saveChanges">
      <div class="flex items-center justify-between mb-4">
        <UButton
          icon="i-lucide-arrow-left"
          color="secondary"
          variant="ghost"
          size="xl"
          class="-ml-4"
          aria-label="Back"
          @click="goBack"
        />
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
            <AccountDetails 
              :details="form" 
              :is-editing="isEditing"
              :is-password-visible="isPasswordVisible"
              :password-error="passwordError"
              @toggle-password-visibility="isPasswordVisible = !isPasswordVisible"
            />
            <div class="flex flex-col gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <template v-if="isEditing">
                <UButton type="submit" label="Save Changes" size="xl" block :loading="isSaving" />
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
        <template #internlog>
          <UCard class="mt-4">
            <InternLog :details="{ internId: form.internId }" 
              @approved="handleLogApproval" />
          </UCard>
          <UButton
						label="Export DTR"
						color="primary"
						variant="solid"
						icon="i-heroicons-arrow-down-tray"
						block
						class="mt-6"
						:loading="isExporting"
						@click="handleExport"
					/>
        </template>
      </UTabs>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import type { TabsItem } from '#ui/types'
import { useInternProfile } from '~/composables/useInternProfle'
import InternProfileHeader from '~/components/intern-profile-header.vue'
import { UAlert, UButton, UCard, UForm, UIcon, UTabs, UModal } from '#components'
import { useFileDownloader } from '~/composables/useFileDownloader'

const { isExporting, downloadFile } = useFileDownloader()
const AccountDetails = defineAsyncComponent(() => import('~/components/intern-details.vue'))
const InternLog = defineAsyncComponent(() => import('~/components/time-log.vue')) 
const route = useRoute()
const router = useRouter()
const internId = route.params.id as string

function handleLogApproval() {
  console.log('Approval event received on main page. Refreshing profile data!')
  if (refreshProfile) {
    refreshProfile()
  }
}

function goBack(){
  router.back()
}

const items: TabsItem[] = [
  { slot: 'personalinfo', label: 'Personal Info' },
  { slot: 'internlog', label: 'Time Log' },
]

const {
  form,
  pending,
  error,
  isEditing,
  avatarPreviewUrl,
  isModalOpen,
  refresh: refreshProfile,
  isPasswordVisible,
  passwordError,
  isSaving,
  startEditing,
  cancelEditing,
  saveChanges,
  markAsCompleted,
  handleStatusUpdate,
  handlePictureUpload,
} = useInternProfile(internId)

const handleExport = () => {
		const exportUrl = `/api/interns/${internId}/export`
		downloadFile(exportUrl, 'timelogs.csv')
	}


definePageMeta({
  layout: 'admin'
})
</script>