<template>
	<UContainer>
		<header class="mb-6 md:mb-8">
			<div class="flex flex-wrap items-start justify-between gap-4">
				<div>
					<div class="flex items-center gap-3">
						<h1 class="text-2xl font-bold text-gray-800 md:text-3xl dark:text-white">Pending Approvals</h1>
						<UBadge
							v-if="!pending"
							color="primary"
							variant="solid"
							size="sm"
							class="flex h-6 w-6 items-center justify-center rounded-full"
						>
							{{ dashboardLogs?.length || 0 }}
						</UBadge>
					</div>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<p class="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">{{ today }}</p>

				<UModal
					v-model:open="isApproveModalOpen"
					title="Confirmation"
				>
					<div v-if="dashboardLogs && dashboardLogs.length > 0">
						<UButton
							label="Approve All"
							icon="i-lucide-check-check"
							color="primary"
							variant="solid"
						/>
					</div>

					<template #header>
						<h2 class="text-2xl font-bold dark:text-gray-400">Approve Time Log</h2>
					</template>
					<template #body>
						<p class="py-4 text-black dark:text-gray-400">
							Are you sure you want to approve {{ props.log.intern_name }}'s pending time log?
						</p>
					</template>
					<template #footer>
						<div class="flex w-full items-center justify-center gap-8">
							<UButton
								@click="isApproveModalOpen = false"
								color="primary"
								variant="outline"
								label="Cancel"
								class="text-md text-black"
								block
							/>
							<UButton
								color="primary"
								label="Confirm"
								class="text-md text-white"
								:disabled="!dashboardLogs || dashboardLogs.length === 0 || isApproving"
								:loading="isApproving"
								@click="handleApproveAllClick"
								block
							/>
						</div>
					</template>
				</UModal>
			</div>
		</header>

		<main>
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
				v-else-if="error"
				icon="i-lucide-triangle-alert"
				color="error"
				variant="subtle"
				title="Failed to load data"
				:description="error.message"
			/>

			<div
				v-else-if="dashboardLogs && dashboardLogs.length > 0"
				class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
			>
				<DashboardLogs
					v-for="log in dashboardLogs"
					:key="log.id"
					:log="log"
					v-model:admin_remarks="remarksState[log.id]"
					@approved="refresh"
				/>
			</div>

			<div
				v-else
				class="mt-8 rounded-lg bg-white p-6 text-center shadow-md sm:p-8 dark:bg-gray-800"
			>
				<p class="text-gray-500 dark:text-gray-400">No pending approvals for today</p>
			</div>
		</main>
	</UContainer>
</template>

<script setup lang="ts">
	import type { ApproveLogPayload, DashboardLog } from '~/types/TimeLog'
	import { useBulkApproval } from '~/composables/useBulkApprove'

	const toast = useToast()
	const { approveAll, isApproving } = useBulkApproval()
	const { data: apiResponse, pending, error, refresh } = useFetch<{ logs: DashboardLog[] }>('/api/timelogs/today')
	const isApproveModalOpen = ref(false)
	const remarksState = reactive<Record<string, string>>({})
	const dashboardLogs = computed((): DashboardLog[] => apiResponse.value?.logs ?? [])
	const props = defineProps<{ log: DashboardLog }>()

	async function handleApproveAllClick() {
		const logsPayload: ApproveLogPayload[] = dashboardLogs.value
			.filter((log) => log.time_out)
			.map((log) => ({
				logId: log.id,
				admin_remarks: remarksState[log.id] ?? null,
			}))

		if (logsPayload.length === 0) {
			toast.add({
				title: 'No Completed Logs',
				description: 'There are no logs with a "Time Out" to approve.',
				color: 'info',
			})
			return
		}

		if (isApproving.value) return
		try {
			const success = await approveAll(logsPayload)
			if (success) {
				await refresh()
			}
		} catch (e) {
			toast.add({
				title: 'Error',
				description: 'An error occurred while approving logs.',
				color: 'error',
			})
		}
	}

	const today = new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(new Date())

	definePageMeta({
		layout: 'admin',
	})
</script>
