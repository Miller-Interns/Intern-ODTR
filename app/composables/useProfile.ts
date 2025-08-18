import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { Selectable } from 'kysely'
import type { Intern, User } from '~/server/db/types'

type ProfileDataResponse = {
	profile: Selectable<Intern> & { email: string; name: string | null }
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

	const formState = ref({
		first_name: '',
		middle_name: '',
		last_name: '',
		email: '',
		password: '',
		contact_number: '',
		emergency_contact_person: '',
		emergency_contact_number: '',
		school: '',
		course: '',
		year: '',
		required_hours: 0,
		role: '',
		notes: '',
	})

	const { data, pending, error, refresh } = useFetch<ProfileDataResponse>('/api/profile/fetch')

	function openFileInput() {
		fileInput.value?.click()
	}

	async function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement
		const file = input.files?.[0]
		if (!file) return

		isUploading.value = true
		const formData = new FormData()
		formData.append('picture', file)

		try {
			await $fetch('/api/profile/picture', {
				method: 'POST',
				body: formData,
			})
			toast.add({ title: 'Profile picture updated!', color: 'success' })
			await refresh()
		} catch (err: any) {
			toast.add({ title: 'Error', description: err.data?.message || 'Could not upload picture.', color: 'error' })
		} finally {
			isUploading.value = false
			if (fileInput.value) fileInput.value.value = ''
		}
	}

	function enterEditMode() {
		if (data.value?.profile) {
			const profile = data.value.profile
			formState.value = {
				...formState.value,
				first_name: profile.first_name,
				middle_name: profile.middle_name || '',
				last_name: profile.last_name,
				email: profile.email,
				contact_number: profile.contact_number,
				emergency_contact_person: profile.emergency_contact_person,
				emergency_contact_number: profile.emergency_contact_number,
				school: profile.school,
				course: profile.course,
				year: profile.year,
				required_hours: profile.required_hours,
				role: profile.role || '',
				notes: profile.notes || '',
			}
			isEditing.value = true
		}
	}

	async function handleSaveChanges() {
		isSaving.value = true
		try {
			const payload = { ...formState.value }
			await $fetch('/api/profile/update', { method: 'PUT', body: payload })
			toast.add({ title: 'Profile updated successfully!', color: 'success' })
			isEditing.value = false
			await refresh()
		} catch (err: any) {
			toast.add({ title: 'Error', description: err.data?.message || 'Could not update profile.', color: 'error' })
		} finally {
			isSaving.value = false
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
		isPasswordVisible,
		passwordError,
		isLogoutModalOpen,
		openFileInput,
		handleFileChange,
		enterEditMode,
		handleSaveChanges,
		performLogout,
	}
}
