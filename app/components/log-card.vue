<template>
	<UCard class="w-full">
		<template #header>
			<slot name="header" />
		</template>

		<div class="space-y-4">
			<div class="grid grid-cols-3 text-center">
				<div>
					<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Time In:</span>
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_in) }}</p>
				</div>
				<div>
					<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Time Out:</span>
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_out) }}</p>
				</div>
				<div>
					<span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Hours:</span>
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
	import { formatDuration, formatTimeOnly } from '~/server/utils/formatters'
	import { calculateDisplayHours } from '~/server/utils/total-hours'

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

	const totalHoursForDisplay = computed(() => {
		if (props.log.status === true) {
			return formatDuration(props.log.total_hours)
		}
		const timeIn = new Date(props.log.time_in)
		const timeOut = new Date(props.log.time_out)
		if (isNaN(timeIn.getTime()) || isNaN(timeOut.getTime())) {
			return formatDuration(null)
		}

		const durationMs = timeOut.getTime() - timeIn.getTime()
		const durationHours = durationMs / (1000 * 60 * 60)

		return formatDuration(durationHours)
	})

	defineExpose({
		isEditingRemarks,
		isApproving,
		remarksText,
		startEditingRemarks,
		handleApprove,
	})
</script>
