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
							v-if="timeLogs.length > 0"
							class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
						>
							<InternLogs
								v-for="log in timeLogs"
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
					<UModal
						v-model:open="isExporting"
						fullscreen
						:ui="{
							overlay: 'bg-black/60 bg-transparent',
						}"
					>
						<UButton
							label="Export DTR"
							color="primary"
							variant="solid"
							icon="i-heroicons-arrow-down-tray"
							block
							class="mt-6"
							@click="handleExport"
						/>

						<!-- <template #body>
							<div class="flex h-full items-center justify-center bg-black/50">
								<UIcon
									name="i-lucide-loader-circle"
									class="h-12 w-12 animate-spin text-white"
								/>
							</div>
						</template> -->

						<template #body>
							<div class="flex h-full items-center justify-center bg-black/60">
								<div class="flex flex-col items-center">
									<UIcon
										name="i-lucide-loader-circle"
										class="h-12 w-12 animate-spin text-white"
									/>

									<p class="mt-4 text-lg font-semibold text-white">Exporting DTR</p>
								</div>
							</div>
						</template>
					</UModal>
				</template>
			</UTabs>
		</UForm>
	</div>
</template>

<script setup lang="ts">
	import type { InternDetailsResponse } from '~/types/Api'
	import type { InternLog } from '~/types/TimeLog'

	const route = useRoute()
	const internId = computed(() => route.params.id as string)
	const { data, pending, error, refresh } = useFetch<InternDetailsResponse>(() => `/api/interns/${internId.value}`)
	const form = computed(() => data.value?.intern)
	const timeLogs = computed<InternLog[]>(() => data.value?.timeLogs ?? [])
	const isEditing = ref(false)
	const avatarPreviewUrl = ref<string | null>(null)
	const isExporting = ref(false)
	const exportError = ref<string | null>(null)

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

	const handleExport = async () => {
		isExporting.value = true
		exportError.value = null

		try {
			const response = await $fetch.raw(`/api/interns/export`)
			const blob = response._data

			if (!(blob instanceof Blob)) {
				throw new Error('The server response was not a file.')
			}

			const url = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			const disposition = response.headers.get('content-disposition')
			let filename = 'timelogs.csv'

			if (disposition && disposition.includes('filename=')) {
				const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
				const matches = filenameRegex.exec(disposition)
				if (matches != null && matches[1]) {
					filename = matches[1].replace(/['"]/g, '')
				}
			}

			link.setAttribute('download', filename)
			document.body.appendChild(link)

			link.click()
			document.body.removeChild(link)
			URL.revokeObjectURL(url)
		} catch (error: any) {
			console.error('Export failed:', error)
			exportError.value = 'Failed to export time logs. Please try again.'
		} finally {
			isExporting.value = false
		}
	}

	definePageMeta({
		layout: 'admin',
	})
</script>
