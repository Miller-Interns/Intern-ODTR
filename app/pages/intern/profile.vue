<template>
	<div class="bg-black-50 flex min-h-screen flex-col pb-20">

		<div v-if="pending" class="flex flex-1 items-center justify-center">
			<p>Loading Profile...</p>
		</div>

		<div v-else-if="error" class="flex flex-1 items-center justify-center text-center text-red-500">
			<p>
				Could not load profile data.
				<br />
				Please try again later.
			</p>
		</div>

		<div v-else-if="data?.profile" class="space-y-6 p-4">
			<UCard class="shadow-lg">
				<div class="flex items-start gap-4">
					<div class="relative w-max">
						<UAvatar :src="data.profile.intern_picture || undefined" alt="Avatar" class="h-16 w-16" />
						<button @click="openFileInput"
							class="bg-opacity-60 hover:bg-opacity-80 absolute right-0 bottom-0 flex items-center justify-center rounded-full bg-black p-1 transition">
							<UIcon v-if="!isUploading" name="i-heroicons-camera" class="text-xs text-white" />
							<UIcon v-else name="i-heroicons-arrow-path" class="animate-spin text-sm text-white" />
						</button>
						<input ref="fileInput" type="file" @change="handleFileChange" accept="image/*" class="hidden" />
					</div>
					<div>
						<h1 class="text-lg font-bold">{{ data.profile.name || 'Intern Name' }}</h1>
						<UBadge v-if="data.profile.status === Status.ONGOING" color="success" variant="soft"
							class="mt-1">
							Ongoing
						</UBadge>
						<UBadge v-else-if="data.profile.status === Status.COMPLETED" color="secondary" variant="soft"
							class="mt-1">
							Completed
						</UBadge>
						<UBadge v-else color="primary" variant="soft" class="mt-1">
							Incoming
						</UBadge>
						<p class="text-black-500 mt-1 text-sm">{{ data.profile.role || 'No Role Assigned' }}</p>
						<p class="text-black-500 text-sm">{{ data.profile.course }} - {{ data.profile.year }}</p>
						<p class="text-black-500 text-sm">{{ data.profile.school }}</p>
						<p class="text-black-500 text-sm">Hours: {{ data.profile.hours_completed }} / {{
							data.profile.required_hours }}</p>
					</div>
				</div>
			</UCard>

			<div class="relative py-2">
				<div class="relative flex justify-center"><span class="bg-black-50 text-black-500 px-2 text-sm">Personal
						Info</span></div>
				<div class="border-black-300 w-full border-t" />
			</div>

			<!-- VIEW MODE -->
			<div v-if="!isEditing" class="space-y-6">
				<section>
					<h2 class="text-black-800 mb-4 text-xl font-bold">Intern details</h2>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">First Name</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.first_name }}</h2>
					</div>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">Middle Name</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.middle_name || 'N/A' }}</h2>
					</div>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">Last Name</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.last_name }}</h2>
					</div>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">Email</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.email }}</h2>
					</div>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">Contact Number</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.contact_number }}</h2>
					</div>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">Emergency Contact Person</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.emergency_contact_person }}
						</h2>
					</div>
					<div>
						<h1 class="text-black-500 text-sm">Emergency Contact Number</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.emergency_contact_number }}
						</h2>
					</div>
				</section>
				<section>
					<h2 class="text-black-800 mb-4 text-xl font-bold">Internship information</h2>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">School</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.school }}</h2>
					</div>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">Course and Year Level</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.course }} - {{
							data.profile.year }}</h2>
					</div>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">Required Hours</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.required_hours }}</h2>
					</div>
					<div class="pb-5">
						<h1 class="text-black-500 text-sm">Role/Position</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.role || 'N/A' }}</h2>
					</div>
					<div>
						<h1 class="text-black-500 text-sm">Note/Remarks(Optional)</h1>
						<h2 class="text-black-800 text-left font-semibold">{{ data.profile.notes || 'None' }}</h2>
					</div>
				</section>
				<div class="space-y-2 pt-4">
					<UButton @click="enterEditMode" block size="lg" icon="i-heroicons-pencil-square">
						Edit Info
					</UButton>
					<UModal v-model:open="isLogoutModalOpen" title="Confirmation">
						<UButton @click="isLogoutModalOpen = true" block size="lg"
							icon="i-heroicons-arrow-left-on-rectangle" color="primary">
							Logout
						</UButton>
						<template #header>
							<h2 class="text-2xl font-bold">Logout?</h2>
						</template>
						<template #body>
							<p class="py-4 text-black">Are you sure you want to log out?</p>
						</template>
						<template #footer>
							<div class="flex justify-end gap-2">
								<UButton @click="isLogoutModalOpen = false" color="primary" variant="outline"
									label="Cancel" class="text-md text-black" />
								<UButton @click="performLogout" color="primary" label="Yes, Logout"
									class="text-md text-white" />
							</div>
						</template>
					</UModal>
				</div>
			</div>

			<!-- EDIT MODE -->
			<div v-else class="space-y-6">
				<UForm :state="formState" @submit="handleSaveChanges">
					<section class="space-y-4">
						<h2 class="mb-2 text-xl font-bold">Intern details</h2>
						<UFormField label="First Name" name="firstName" required class="text-sm">
							<UInput v-model="formState.first_name" class="w-full" placeholder="First Name"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Middle Initial (Optional)" name="middleName">
							<UInput v-model="formState.middle_name" class="w-full" placeholder="Middle Initial"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Last Name" name="lastName" required>
							<UInput v-model="formState.last_name" class="w-full" placeholder="Last Name"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Email" name="email" required>
							<UInput v-model="formState.email" type="email" class="w-full" placeholder="Email"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="New Password (leave blank to keep current)" name="password">
							<UInput v-model="formState.password" :type="isPasswordVisible ? 'text' : 'password'"
								revealable="false" placeholder="Password" class="w-full"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" :class="passwordError
										? 'border-red-500 focus:border-red-500 focus:ring-red-500'
										: 'focus:border-primary-500 focus:ring-primary-500 border-gray-300'
									">
								<template #trailing>
									<UButton :icon="isPasswordVisible ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
										variant="link" color="neutral" :padded="false"
										@click="isPasswordVisible = !isPasswordVisible" />
								</template>
							</UInput>
						</UFormField>
						<UFormField label="Contact Number" name="contact_number">
							<UInput v-model="formState.contact_number" class="w-full" placeholder="Contact Number"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Emergency Contact Person" name="emergency_contact_person">
							<UInput v-model="formState.emergency_contact_person" class="w-full"
								placeholder="Emergency Contact Person"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Emergency Contact Number" name="emergency_contact_number">
							<UInput v-model="formState.emergency_contact_number" class="w-full"
								placeholder="Emergency Contact Number"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
					</section>
					<section class="mt-6 space-y-4">
						<h2 class="mb-2 text-xl font-bold">Internship information</h2>
						<UFormField label="School" name="school" required>
							<UInput v-model="formState.school" class="w-full" placeholder="School"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Course" name="course" required>
							<UInput v-model="formState.course" class="w-full" placeholder="Course"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Year Level" name="year" required>
							<UInput v-model="formState.year" class="w-full" placeholder="Year Level"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Required hours" name="required_hours" required>
							<UInput v-model.number="formState.required_hours" type="number" class="w-full"
								placeholder="Required Hours" :ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Role/Position" name="role">
							<UInput v-model="formState.role" class="w-full" placeholder="Role/Position"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
						<UFormField label="Note/Remarks (Optional)" name="notes">
							<UTextarea v-model="formState.notes" class="w-full"
								placeholder="Any additional notes or remarks" :rows="3"
								:ui="{ base: 'text-lg placeholder:text-md w-full' }" />
						</UFormField>
					</section>
					<div class="flex gap-2 pt-6">
						<UButton type="submit" :loading="isSaving" block size="lg">
							Save Changes
						</UButton>
						<UButton @click="isEditing = false" block size="lg" color="primary">
							Cancel
						</UButton>
					</div>
				</UForm>
			</div>
		</div>
		<LayoutBottomNav />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProfile } from '~/composables/useProfile'
import { Status } from '~/enum/enums'

const fileInput = ref<HTMLInputElement | null>(null)
const {
	data,
	pending,
	error,
	isEditing,
	isSaving,
	isUploading,
	formState,
	isPasswordVisible,
	passwordError,
	isLogoutModalOpen,
	openFileInput,
	handleFileChange,
	enterEditMode,
	handleSaveChanges,
	performLogout,
} = useProfile(fileInput)
</script>
