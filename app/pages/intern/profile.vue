<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="isReady && data?.profile">
      <UForm :state="formState" :validate="validate" @submit="handleSaveChanges">
        <UCard class="mb-6">
          <InternProfileHeader 
            :intern="headerData" 
            :is-editing="isEditing"
            :preview-src="previewSrc"
            @upload-picture="handleFileUpload"
          />
           <input
            ref="fileInput"
            type="file"
            @change="handleFileChange"
            accept="image/*"
            class="hidden"
          />
        </UCard>
        <UCard class="mt-4">
          <AccountDetails 
            :details="isEditing ? formState : headerData" 
            :is-editing="isEditing"
            :is-password-visible="isPasswordVisible"
            :password-error="passwordError"
            @toggle-password-visibility="isPasswordVisible = !isPasswordVisible"
          />
          <div class="flex flex-col gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <template v-if="isEditing">
              <UButton type="submit" label="Save Changes" size="xl" block :loading="isSaving" />
              <UButton color="primary" variant="outline" label="Cancel" size="xl" block @click="cancelEdit" />
            </template>
            <template v-else>
              <UButton type="button" icon="i-heroicons-pencil-square" label="Edit Info" size="xl" block @click="enterEditMode" />
              <UButton 
                @click="isLogoutModalOpen = true" 
                block 
                size="xl" 
                label="Logout" 
                icon="i-heroicons-arrow-left-on-rectangle" 
                color="primary" 
                variant="outline"
              />
            </template>
          </div>
        </UCard>
      </UForm>
    </div>
    <div v-else class="text-center py-12">
      <UAlert v-if="error" icon="i-heroicons-exclamation-triangle" color="error" variant="soft" title="Error Loading Data" description="Could not find your profile data." />
      <div v-else class="flex flex-col items-center justify-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8" />
        <p>Loading your profile...</p>
      </div>
    </div>

		<UModal v-model:open="isLogoutModalOpen" title="Confirmation">
			<template #header>
				<h2 class="text-2xl font-bold">Logout?</h2>
			</template>
			<template #body>
				<p class="py-4">Are you sure you want to log out?</p>
			</template>
			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton @click="isLogoutModalOpen = false" color="primary" variant="outline" label="Cancel" />
					<UButton @click="performLogout" color="primary" label="Yes, Logout" />
				</div>
			</template>
		</UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfile } from '~/composables/useProfile'
import InternProfileHeader from '~/components/intern-profile-header.vue'
import AccountDetails from '~/components/intern-details.vue'
import { UAlert, UButton, UCard, UForm, UIcon, UModal } from '#components'
import type { InternDetails } from '~/types/Intern'

const fileInput = ref<HTMLInputElement | null>(null)

const {
  data,
  pending,
  error,
  isEditing,
  isSaving,
  isUploading,
  formState,
  previewSrc,
  isPasswordVisible,
  passwordError,
  isLogoutModalOpen,
  cancelEdit,
  validate,
  openFileInput,
  handleFileChange,
  handleFileUpload,
  enterEditMode,
  handleSaveChanges,
  performLogout,
} = useProfile(fileInput)

const isReady = computed(() => !pending.value && data.value?.profile);

const headerData = computed((): Partial<InternDetails> => {
  if (!isReady.value || !data.value?.profile) {
    return {};
  }
  const profile = data.value.profile;
  return {
    fullName: profile.name || '',
    internPicture: profile.intern_picture,
    status: profile.status,
    role: profile.role || '',
    course: profile.course || '',
    year: profile.year || '',
    school: profile.school,
    hoursCompleted: profile.hours_completed,
    requiredHours: profile.required_hours,
    firstName: profile.first_name,
    middleName: profile.middle_name || '',
    lastName: profile.last_name,
    email: profile.email,
    contactNumber: profile.contact_number,
    emergencyContactPerson: profile.emergency_contact_person,
    emergencyContactNumber: profile.emergency_contact_number,
    courseYear: `${profile.course || ''} - ${profile.year || ''}`,
    notes: profile.notes,
  };
});

definePageMeta({
  layout: 'intern' 
})
</script>