<template>
	<div class="bg-black-50 flex min-h-screen flex-col pb-40">
		<header class="p-4">
			<h1 class="text-black-800 text-2xl font-bold">Time Logs</h1>
		</header>

		<div v-if="pending" class="flex flex-1 items-center justify-center">
			<p>Loading Time Logs...</p>
		</div>

		<div v-else-if="error" class="flex flex-1 items-center justify-center text-center text-red-500">
			<p>
				Could not load time logs.
				<br />
				Please try again later.
			</p>
		</div>

		<div v-else-if="data?.timeLogs" class="space-y-4 px-4">
			<div v-if="data.timeLogs.length === 0" class="text-center">
				<UCard class="text-md p-3 text-gray-500 shadow-lg">
					<p>No time logs recorded yet. Once you log time, it will show up here.</p>
				</UCard>
			</div>

			<UCard v-for="log in data.timeLogs" class="shadow-lg" :key="log.id">
				<template #header>
					<div class="flex items-center justify-between">
						<p class="text-black-700 font-semibold">{{ formattedDate(log.time_in) }}</p>
						<UBadge v-if="!log.status" color="warning" variant="soft">
							Pending Approval
						</UBadge>
					</div>
				</template>
				<div>
					<div class="grid grid-cols-3">
						<div class="flex justify-center">
							<div class="text-left">
								<p class="text-black-500 text-sm">Time in</p>
								<p class="font-medium">{{ formatTime(log.time_in) }}</p>
							</div>
						</div>
						<div class="flex justify-center">
							<div class="text-left">
								<p class="text-black-500 text-sm">Time out</p>
								<p class="font-medium">{{ formatTime(log.time_out) }}</p>
							</div>
						</div>
						<div class="flex justify-center">
							<div class="text-left">
								<p class="text-black-500 text-sm">Total Hours</p>
								<p class="font-medium">{{ log.total_hours.toFixed(1) }} Hours</p>
							</div>
						</div>
					</div>
					<div v-if="log.intern_notes || log.admin_remarks"
						class="mt-4 space-y-2 border-t border-gray-200 pt-4 text-left">
						<div v-if="log.intern_notes">
							<p class="text-black-500 text-sm">Intern Notes:</p>
							<p class="text-black-800 bg-black-50 rounded-md p-2 text-sm">{{ log.intern_notes }}</p>
						</div>
						<div v-if="log.admin_remarks">
							<p class="text-black-500 text-sm">Admin Remarks:</p>
							<p class="text-black-800 rounded-md bg-blue-50 p-2 text-sm">{{ log.admin_remarks }}</p>
						</div>
					</div>
				</div>
			</UCard>
		</div>

		<div class="fixed right-0 bottom-20 left-0 p-4">
			<UButton block size="lg" icon="i-heroicons-arrow-down-tray" @click="exportDTR"
				:disabled="!data || data.timeLogs.length === 0">
				Export DTR
			</UButton>
		</div>
		<LayoutBottomNav />
	</div>
</template>

<script setup lang="ts">
const { pending,
	error,
	data,
	formattedDate,
	formatTime,
	exportDTR
} = useTimeLogs()
</script>
