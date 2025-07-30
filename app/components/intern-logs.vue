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
	<div
		@click="handleCardClick"
		:class="[
			'overflow-hidden rounded-xl bg-white p-5 shadow-md transition-all',
			!log.status ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : '',
			isApproving && !log.status ? 'pointer-events-none opacity-50' : '',
		]"
	>
		<!-- Card Header with Date -->
		<div class="mb-4 flex items-center font-semibold text-gray-600">
			<div class="flex items-center text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<span>{{ formattedDate }}</span>
			</div>

			<span
				v-if="!log.status"
				class="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800"
			>
				Pending Approval
			</span>
		</div>

		<!-- Info Grid -->
		<div class="mb-4 grid grid-cols-3 text-center">
			<div>
				<span class="text-xs text-gray-500">Time in</span>
				<p class="text-sm font-bold text-gray-900">{{ formatTimeOnly(log.time_in) }}</p>
			</div>
			<div>
				<span class="text-xs text-gray-500">Time out</span>
				<p class="text-sm font-bold text-gray-900">{{ formatTimeOnly(log.time_out) }}</p>
			</div>
			<div>
				<span class="text-xs text-gray-500">Total Hours</span>
				<p class="text-sm font-bold text-gray-900">{{ formatDuration(log.total_hours) }}</p>
			</div>
		</div>

		<!-- Overtime & Remarks -->
		<div class="space-y-1 px-2 text-sm">
			<div>
				<span class="text-gray-500">Overtime (if there is any):</span>
				<span class="ml-2 font-bold text-gray-900">{{ formatDuration(log.overtime) }}</span>
			</div>
			<div>
				<span class="text-gray-500">Notes/Remarks:</span>
				<span
					v-if="log.remarks"
					class="ml-2 italic text-gray-800"
				>
					"{{ log.remarks }}"
				</span>
				<span
					v-else
					class="ml-2 text-gray-400"
				>
					(Optional)
				</span>
			</div>
		</div>
	</div>
</template>
