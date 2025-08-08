<script setup lang="ts">
	import type { TimeLogEntry } from '~/interfaces/time-logs'
	import { useBulkApproval } from '~/composables/useBulkApprove'

	const toast = useToast()
	const { data: pendingLogs, pending, error, refresh } = useFetch<TimeLogEntry[]>('/api/log')
	const { isApproving, approveAll } = useBulkApproval()
	const bus = useEventBus<void>('log:approved')

	bus.on(() => {
		refresh()
	})

	async function handleApproveAllClick() {
		if (!pendingLogs.value) {
			toast.add({ title: 'No logs to approve.', color: 'warning' })
			return
		}

		const logIdsToApprove = pendingLogs.value
			.filter((log) => log.time_out) // Only logs with a time_out can be approved.
			.map((log) => log.id)

		if (logIdsToApprove.length === 0) {
			toast.add({ title: 'No completed logs to approve.', color: 'info' })
			return
		}

		const success = await approveAll(logIdsToApprove)
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
</script>

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
					v-for="log in pendingLogs"
					:key="log.id"
					:log="log"
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
