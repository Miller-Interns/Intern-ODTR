<template>
	<div v-if="pending" class="flex flex-col items-center justify-center gap-4 py-8 text-gray-500">
		<UIcon name="i-lucide-loader-2" class="h-8 w-8 animate-spin" />
		<p class="text-sm">Loading time logs...</p>
	</div>
	<UAlert
		v-else-if="error"
		icon="i-lucide-x-circle"
		color="error"
		variant="soft"
		title="Error Fetching Logs"
		description="Could not load the time logs for this intern. Please try again later."
	/>
	<div
		v-else-if="!timeLogs || timeLogs.length === 0"
		class="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 py-12 text-gray-500"
	>
		<UIcon name="i-lucide-calendar-off" class="h-10 w-10" />
		<p class="font-medium">No Time Logs Found</p>
		<p class="text-sm">This intern has not submitted any time logs yet.</p>
	</div>
	<div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<InternLogCard
			v-for="log in timeLogs"
			:key="log.id"
			:log="log"
			@approved="handleApproval"
		/>
	</div>
</template>

<script setup lang="ts">
	import InternLogCard from '~/components/intern-logs.vue' 
	import type { InternLog } from '~/types/TimeLog'

	const props = defineProps<{
		details: {
			internId: string
		}
	}>()

  const emit = defineEmits<{ (e: 'approved'): void }>()

	const {
		data: timeLogs,
		pending,
		error,
		refresh,
	} = useFetch<InternLog[]>(`/api/interns/${props.details.internId}/timelogs`)

	const handleApproval = () => {
		refresh()
    emit('approved')
	}
</script>