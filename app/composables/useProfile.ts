import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Selectable } from 'kysely'
import type { Intern, User } from '~/server/db/types'

type ProfileDataResponse = {
	profile: Selectable<Intern> & { email: string; name: string | null }
}

type FormError = {
	path: string
	message: string
}

export function useProfile(fileInput: Ref<HTMLInputElement | null>) {
	const { clear } = useUserSession()
	const router = useRouter()
	const toast = useToast()
	const isPasswordVisible = ref(false)
	const passwordError = ref<string | undefined>(undefined)
	const isLogoutModalOpen = ref(false)
	const isEditing = ref(false)
	const isSaving = ref(false)
	const isUploading = ref(false)
	const previewSrc = ref<string | null>(null)
	const avatarFile = ref<File | null>(null)

	const formState = ref({
		firstName: '',
		middleName: '',
		lastName: '',
		email: '',
		password: '',
		contactNumber: '',
		emergencyContactPerson: '',
		emergencyContactNumber: '',
		school: '',
		courseYear: '',
		requiredHours: 0,
		role: '',
		notes: '',
	})

	const { data, pending, error, refresh } = useFetch<ProfileDataResponse>('/api/profile/fetch', {
		server: false,
	})

	const validate = (state: any): FormError[] => {
		const errors = []
		if (state.password && state.password.length > 0 && state.password.length < 6) {
			const message = 'Password must be at least 6 characters'
			errors.push({ path: 'password', message: message })
			passwordError.value = message
		}
		return errors
	}

	function openFileInput() {
		fileInput.value?.click()
	}

	function stageFile(file: File) {
		avatarFile.value = file;
		previewSrc.value = URL.createObjectURL(file);
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement
		const file = input.files?.[0]
		if (file) {
			stageFile(file);
		}
	}
	
	function handleFileUpload(file: File) {
		if (file) {
			stageFile(file);
		}
	}

	function enterEditMode() {
		if (data.value?.profile) {
			const profile = data.value.profile
			formState.value = {
				firstName: profile.first_name,
				middleName: profile.middle_name || '',
				lastName: profile.last_name,
				email: profile.email,
				password: '',
				contactNumber: profile.contact_number || '',
				emergencyContactPerson: profile.emergency_contact_person || '',
				emergencyContactNumber: profile.emergency_contact_number || '',
				school: profile.school,
				courseYear: `${profile.course || ''} - ${profile.year || ''}`,
				requiredHours: profile.required_hours,
				role: profile.role || '',
				notes: profile.notes || '',
			}
			isEditing.value = true
		}
	}

	function cancelEdit() {
		isEditing.value = false
		passwordError.value = undefined
		previewSrc.value = null; 
		avatarFile.value = null;
	}

	async function handleSaveChanges() {
		passwordError.value = undefined
		isSaving.value = true
		try {
			if (avatarFile.value) {
				isUploading.value = true;
				const formData = new FormData()
				formData.append('picture', avatarFile.value)
				await $fetch('/api/profile/picture', {
					method: 'POST',
					body: formData,
				})
				isUploading.value = false;
			}

			const [course, year] = formState.value.courseYear.split('-').map(s => s.trim());
			const payload = {
				first_name: formState.value.firstName,
				middle_name: formState.value.middleName,
				last_name: formState.value.lastName,
				email: formState.value.email,
				password: formState.value.password,
				contact_number: formState.value.contactNumber,
				emergency_contact_person: formState.value.emergencyContactPerson,
				emergency_contact_number: formState.value.emergencyContactNumber,
				school: formState.value.school,
				course: course,
				year: year,
				required_hours: formState.value.requiredHours,
				role: formState.value.role,
				notes: formState.value.notes,
			}
			await $fetch('/api/profile/update', { method: 'PUT', body: payload })
			
			toast.add({ title: 'Profile updated successfully!', color: 'success' })
			isEditing.value = false
			await refresh()
		} catch (err: any) {
			toast.add({ title: 'Error', description: err.data?.message || 'Could not update profile.', color: 'error' })
		} finally {
			isSaving.value = false
			isUploading.value = false;
			avatarFile.value = null;
			previewSrc.value = null;
		}
	}

	async function performLogout() {
		isLogoutModalOpen.value = false
		await $fetch('/api/auth/logout', { method: 'POST' })
		await clear()
		await router.push('/login')
	}

	return {
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
	}
}