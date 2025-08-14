<template>
	<div class="p-4 sm:p-6 lg:p-8">
		<div
			v-if="pending"
			class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
		>
			<USkeleton
				v-for="i in 3"
				:key="i"
				class="h-60 w-full"
			/>
		</div>

		<UAlert
			v-else-if="error || !form"
			icon="i-lucide-triangle-alert"
			color="error"
			variant="subtle"
			title="Error Loading Data"
			description="Could not find intern data."
		/>

		<UForm
			v-else
			:state="form"
			@submit="saveChanges"
		>
			<div class="mb-4 flex items-center justify-between">
				<UButton
					to="/admin/interns"
					icon="i-lucide-arrow-left"
					color="neutral"
					variant="ghost"
					aria-label="Back to interns list"
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

			<UTabs
				:items="tabItems"
				variant="link"
				:ui="{ trigger: 'grow' }"
				class="w-full gap-4"
				color="neutral"
			>
				<!-- Personal Info Tab -->
				<template #personalinfo>
					<UCard>
						<p class="text-gray-500">Personal information section.</p>
					</UCard>
				</template>

				<!-- Time Log Tab -->
				<template #timelog>
					<div class="space-y-4">
						<div
							v-if="data?.timeLogs && data.timeLogs.length > 0"
							class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
						>
							<InternLogs
								v-for="log in data.timeLogs"
								:key="log.id"
								:log="log"
								@approved="refresh"
							/>
						</div>

						<div
							v-else
							class="text-center text-gray-500"
						>
							No time logs found.
						</div>
					</div>

					<UButton
						label="Export DTR"
						color="primary"
						variant="solid"
						icon="i-heroicons-arrow-down-tray"
						block
						class="mt-6"
					/>
				</template>
			</UTabs>
		</UForm>
	</div>
</template>

<script setup lang="ts">
	import type { InternDetailsResponse } from '~/types/Api'

	const route = useRoute()

	const internId = computed(() => route.params.id as string)
	const { data, pending, error, refresh } = useFetch<InternDetailsResponse>(() => `/api/interns/${internId.value}`)

	const isEditing = ref(false)
	const avatarPreviewUrl = ref<string | null>(null)
	const form = computed(() => data.value?.intern)

	const tabItems = [
		{ slot: 'personalinfo', label: 'Personal Info' },
		{ slot: 'timelog', label: 'Time Log' },
	]

	async function saveChanges() {
		console.log('Saving changes to:', form.value)
		isEditing.value = false
	}

	async function handleStatusUpdate(newStatus: string) {
		console.log('Updating status to:', newStatus)
	}

	function handlePictureUpload(file: File) {
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

	definePageMeta({
		layout: 'admin',
	})
</script>
