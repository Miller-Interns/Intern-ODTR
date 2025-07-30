<script setup lang="ts">
	import { ref } from 'vue'
	import type { TimeLogForUI } from '../types/composites.js'

	const { log } = defineProps<{ log: TimeLogForUI }>()
	const emit = defineEmits(['approve-with-remarks'])

	const isEditingRemarks = ref(false)
	const remarksText = ref(log.remarks || '')

	function formatTimeOnly(dateString: string | null): string {
		if (!dateString) return 'N/A'
		const date = new Date(dateString)
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		})
	}

	function formatDuration(hours: number | null | undefined): string {
		if (hours === null || hours === undefined) return '0 Hours'
		const formattedHours = new Intl.NumberFormat('en-US', {
			maximumFractionDigits: 2,
		}).format(hours)
		return `${formattedHours} Hours`
	}

	function handleApprove() {
		emit('approve-with-remarks', {
			id: log.id,
			remarks: remarksText.value,
		})
	}
</script>

<template>
	<div class="overflow-hidden rounded-xl bg-white p-5 shadow-md">
		<p class="mb-4 text-lg font-bold text-gray-800">{{ log.intern.name }}</p>

		<div class="mb-4 grid grid-cols-3 text-center">
			<div>
				<span class="text-xs text-gray-500">Time in</span>
				<p class="font-bold text-gray-900">{{ formatTimeOnly(log.time_in) }}</p>
			</div>
			<div>
				<span class="text-xs text-gray-500">Time out</span>
				<p class="font-bold text-gray-900">{{ formatTimeOnly(log.time_out) }}</p>
			</div>
			<div>
				<span class="text-xs text-gray-500">Total Hours</span>
				<p class="font-bold text-gray-900">{{ formatDuration(log.total_hours) }}</p>
			</div>
		</div>

		<div class="px-2 text-sm">
			<span class="text-gray-500">Overtime (if there is any):</span>
			<span class="ml-2 font-bold text-gray-900">{{ formatDuration(log.overtime) }}</span>
		</div>

		<div
			v-if="isEditingRemarks"
			class="mt-4"
		>
			<label
				for="remarks"
				class="mb-2 block text-sm font-semibold text-gray-800"
			>
				Note/Remarks:
			</label>
			<textarea
				id="remarks"
				v-model="remarksText"
				rows="4"
				class="w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
				placeholder="Note and Remarks"
			></textarea>
		</div>

		<!-- Remarks Display (optional) -->
		<div
			v-if="log.remarks"
			class="mt-4 border-t border-gray-100 pt-3"
		>
			<p class="text-xs font-semibold text-gray-500">Remarks:</p>
			<p class="text-sm italic text-gray-700">"{{ log.remarks }}"</p>
		</div>

		<!-- Action Buttons -->
		<div class="mt-6 flex flex-col gap-3">
			<button
				v-if="!isEditingRemarks"
				@click="isEditingRemarks = true"
				class="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-2 h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
						clip-rule="evenodd"
					/>
				</svg>
				Add/Edit Remarks
			</button>

			<button
				@click="handleApprove"
				class="w-full rounded-full bg-teal-500 px-4 py-3 font-bold text-white shadow-sm transition-colors hover:bg-teal-600"
			>
				Approve
			</button>
		</div>
	</div>
</template>
