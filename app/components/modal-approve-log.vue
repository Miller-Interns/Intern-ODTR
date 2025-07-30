<script setup lang="ts">
	import type { TimeLogForUI } from '~/types/composites'

	const props = defineProps({
		modelValue: { type: Boolean, default: false },
		log: { type: Object as PropType<TimeLogForUI | null>, required: true },
		internName: { type: String, default: 'Intern' },
	})

	const emit = defineEmits(['update:modelValue', 'approve-with-remarks'])

	const isEditingRemarks = ref(false)
	const remarksText = ref(props.log?.remarks || '')

	watch(
		() => props.log,
		(newLog) => {
			remarksText.value = newLog?.remarks || ''
			isEditingRemarks.value = false
		},
	)

	function formatTimeOnly(dateString: string | null) {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
	}

	function formatDuration(hours: number | null | undefined) {
		if (hours === null || hours === undefined) return '0 Hours'
		return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(hours)} Hours`
	}

	function handleApprove() {
		if (props.log) {
			emit('approve-with-remarks', {
				id: props.log.id,
				remarks: remarksText.value,
			})
			handleClose()
		}
	}

	function handleClose() {
		emit('update:modelValue', false)
	}
</script>

<template>
	<div
		v-if="modelValue && log"
		@click.self="handleClose"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
	>
		<!-- Modal Content -->
		<div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
			<h3 class="mb-4 text-lg font-bold text-gray-800">{{ internName }}</h3>

			<!-- Time Details Grid -->
			<div class="mb-6 grid grid-cols-3 gap-2">
				<div>
					<p class="text-xs text-gray-500">Time in</p>
					<p class="font-bold text-gray-900">{{ formatTimeOnly(log.time_in) }}</p>
				</div>
				<div>
					<p class="text-xs text-gray-500">Time out</p>
					<p class="font-bold text-gray-900">{{ formatTimeOnly(log.time_out) }}</p>
				</div>
				<div>
					<p class="text-xs text-gray-500">Total Hours</p>
					<p class="font-bold text-gray-900">{{ formatDuration(log.total_hours) }}</p>
				</div>
			</div>
			<p class="mb-6 text-sm text-gray-500">
				Overtime (if there is any):
				<span class="font-bold text-gray-900">{{ formatDuration(log.overtime) }}</span>
			</p>

			<!-- Remarks Editing -->
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

			<!-- Remarks Display -->
			<div
				v-else-if="log.remarks"
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
	</div>
</template>
