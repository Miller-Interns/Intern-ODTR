<template>
	<UCard class="w-full">
		<template #header>
			<slot name="header" />
		</template>

		<div class="space-y-4">
			<div class="grid grid-cols-3 text-center">
				<div>
					<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Time In:</span>
					<!-- No change needed here, the function name is the same -->
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_in) }}</p>
				</div>
				<div>
					<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Time Out:</span>
					<!-- No change needed here, the function name is the same -->
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_out) }}</p>
				</div>
				<div>
					<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Hours:</span>
					<!-- This now relies on the cleaner computed property -->
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ totalHoursForDisplay }}</p>
				</div>
			</div>

			<div v-if="log.intern_notes">
				<UDivider label="Intern Notes" />
				<p class="mt-2 text-sm font-normal text-gray-700 italic dark:text-gray-300">"{{ log.intern_notes }}"</p>
			</div>

			<slot name="body-extra" />

			<div>
				<UDivider label="Admin Remarks" />
				<div
					v-if="isEditingRemarks"
					ref="remarksContainer"
					class="mt-2"
				>
					<UTextarea
						v-model="remarksText"
						:rows="4"
						placeholder="Add notes for approval..."
						class="w-full"
					/>
				</div>
			</div>
		</div>

		<template #footer>
			<slot name="footer" />
		</template>
	</UCard>
</template>

<script setup lang="ts">
	import { onClickOutside } from '@vueuse/core'
	import { useLogApproval } from '~/composables/useApproveLog'
	import type { DashboardLog, InternLog } from '~/types/TimeLog'
	// REFACTOR 1: Update import path and remove unused calculator
	import { formatDuration, formatTimeOnly } from '~/server/utils/formatters'

	type Log = DashboardLog | InternLog

	const props = defineProps<{
		log: Log
	}>()

	const emit = defineEmits<{
		(e: 'approved'): void
	}>()

	const { isApproving, approve } = useLogApproval()

	const isEditingRemarks = ref(false)
	const remarksText = ref(props.log.admin_remarks || '')
	const remarksContainer = ref<HTMLDivElement | null>(null)

	onClickOutside(remarksContainer, () => {
		isEditingRemarks.value = false
	})

	async function startEditingRemarks() {
		isEditingRemarks.value = true
		await nextTick()
		remarksContainer.value?.querySelector('textarea')?.focus()
	}

	async function handleApprove() {
		const success = await approve(props.log.id, remarksText.value)
		if (success) {
			emit('approved')
			isEditingRemarks.value = false
		}
	}

	// REFACTOR 2: Create a computed property for raw hour *calculation*.
	// This mirrors the server-side logic for consistency.
	const calculatedHours = computed<number | null>(() => {
		// If the log is approved, use the definitive `total_hours` from the database.
		if (props.log.status === true) {
			return props.log.total_hours
		}

		// For pending logs, calculate the potential hours for display purposes.
		if (!props.log.time_in || !props.log.time_out) {
			return null
		}

		const timeIn = new Date(props.log.time_in)
		const timeOut = new Date(props.log.time_out)

		// Check for invalid dates
		if (isNaN(timeIn.getTime()) || isNaN(timeOut.getTime())) {
			return null
		}

		const BREAK_HOURS = 1
		const grossDurationHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60)

		return Math.max(0, grossDurationHours - BREAK_HOURS)
	})

	// REFACTOR 3: The display computed is now extremely simple.
	// Its only job is to *format* the result from the calculation.
	const totalHoursForDisplay = computed(() => {
		return formatDuration(calculatedHours.value)
	})

	defineExpose({
		isEditingRemarks,
		isApproving,
		remarksText,
		startEditingRemarks,
		handleApprove,
	})
</script>
