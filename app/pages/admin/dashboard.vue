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
							{{ pendingLogs?.length || 0 }}
						</UBadge>
					</div>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<p class="mt-1 text-base font-normal text-gray-500 dark:text-gray-400">{{ today }}</p>
				<UButton
					icon="i-lucide-check-check"
					label="Approve All"
					color="primary"
					variant="solid"
					:disabled="!pendingLogs || pendingLogs.length === 0 || isApproving"
					:loading="isApproving"
					@click="handleApproveAllClick"
				/>
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
				v-else-if="pendingLogs && pendingLogs.length > 0"
				class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
			>
				<DashboardLogs
					v-for="log in formattedLogs"
					:key="log.id"
					:log="log"
					@approved="refresh"
				/>
			</div>

			<div
				v-else
				class="mt-8 rounded-lg border-2 border-dashed border-gray-300 py-12 text-center dark:border-gray-700"
			>
				<UIcon
					name="i-lucide-circle-check"
					class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
				/>
				<p class="mt-2 text-base font-normal text-gray-600 dark:text-gray-300">No Pending Approvals</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">Everything is up to date!</p>
			</div>
		</main>
	</UContainer>
</template>

<script setup lang="ts">
	import type { ApproveLogPayload, RawPendingLogQueryResult } from '~/interfaces/time-logs'
	import type { DashboardLog } from '~/interfaces/time-logs'
	import { useBulkApproval } from '~/composables/useBulkApprove'

	const toast = useToast()
	const { approveAll, isApproving } = useBulkApproval()
	const { data: pendingLogs, pending, error, refresh } = useFetch<RawPendingLogQueryResult[]>('/api/timelogs/today')

	const formattedLogs = computed((): DashboardLog[] => {
		if (!pendingLogs.value) {
			return []
		}
		return pendingLogs.value.map((rawLog) => ({
			id: rawLog.id,
			status: rawLog.status,
			time_in: new Date(rawLog.time_in).toISOString(),
			time_out: rawLog.time_out ? new Date(rawLog.time_out).toISOString() : null,
			total_hours: rawLog.total_hours,
			intern_notes: rawLog.intern_notes,
			admin_remarks: rawLog.admin_remarks,
			intern_name: rawLog.intern.name || 'Unnamed Intern',
			intern_picture: rawLog.intern.intern_picture,
		}))
	})

	async function handleApproveAllClick() {
		if (!pendingLogs.value || pendingLogs.value.length === 0) {
			return
		}

		const logsPayload: ApproveLogPayload[] = pendingLogs.value
			.filter((log) => log.time_out)
			.map((log) => ({
				logId: log.id,
				admin_remarks: 'Bulk Approved',
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

		const success = await approveAll(logsPayload)
		if (success) {
			await refresh()
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
