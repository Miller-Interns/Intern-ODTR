<script setup>
	const props = defineProps({
		log: { type: Object, required: true },
		isApproving: { type: Boolean, default: false },
	})

	const emit = defineEmits(['open-modal'])

	const formattedDate = new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	}).format(new Date(props.log.time_in))

	function formatTimeOnly(dateString) {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		})
	}

	function formatDuration(hours) {
		if (hours === null || hours === undefined) return '0 Hours'
		return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(hours)} Hours`
	}

	function handleCardClick() {
		if (props.log.status || props.isApproving) {
			return
		}
		emit('open-modal', props.log)
	}
</script>

<template>
	<UCard
		@click="handleCardClick"
		:class="[
			'overflow-hidden rounded-xl bg-white p-5 shadow-md transition-all',
			!log.status ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : '',
			isApproving && !log.status ? 'pointer-events-none opacity-50' : '',
		]"
	>
		<template #header>
			<div class="flex items-center justify-between">
				<div class="flex items-center font-medium text-gray-700 dark:text-gray-300">
					<UIcon
						name="i-lucide-calendar-days"
						class="mr-2 h-5 w-5"
					/>
					<span>{{ formattedDate }}</span>
				</div>

				<UBadge
					v-if="!log.status"
					color="primary"
					variant="solid"
					class="font-base rounded-full"
				>
					Pending Approval
				</UBadge>
			</div>
		</template>

		<div class="space-y-3">
			<!-- Info Grid -->
			<div class="grid grid-cols-3 text-center">
				<div>
					<span class="text-xs text-gray-500 dark:text-gray-400">Time in:</span>
					<p class="font-semibold text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_in) }}</p>
				</div>
				<div>
					<span class="text-xs text-gray-500 dark:text-gray-400">Time out</span>
					<p class="font-semibold text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_out) }}</p>
				</div>
				<div>
					<span class="text-xs text-gray-500 dark:text-gray-400">Total Hours</span>
					<p class="font-semibold text-gray-900 dark:text-white">{{ formatDuration(log.total_hours) }}</p>
				</div>
			</div>
		</div>

		<!-- Overtime & Remarks: Added dark mode text colors -->
		<div class="grid grid-cols-3 text-center text-sm">
			<div class="col-span-2 text-left text-gray-500 dark:text-gray-400">Overtime(if there is any):</div>
			<div class="font-semibold text-gray-900 dark:text-white">{{ formatDuration(log.overtime) }}</div>

			<!-- Remarks -->
			<div class="col-span-2 text-left text-gray-500 dark:text-gray-400">Notes/Remarks:</div>
			<div
				v-if="log.remarks"
				class="truncate font-semibold text-gray-900 italic dark:text-white"
			>
				"{{ log.remarks }}"
			</div>
			<div
				v-else
				class="text-gray-500"
			>
				(Optional)
			</div>
		</div>
	</UCard>
</template>
