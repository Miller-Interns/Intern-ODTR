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
	import type { DashboardLog, TimeLogEntry } from '~/types/TimeLogs'
	import { formatHours, formatTimeOnly } from '~/server/utils/formatters'
	import { calculateDisplayHours } from '~/server/utils/total-hours'

	type Log = DashboardLog | TimeLogEntry

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
			return formatHours(props.log.total_hours)
		}
		const { displayHours } = calculateDisplayHours(props.log.time_in, props.log.time_out)
		return formatHours(displayHours)
	})

	defineExpose({
		isEditingRemarks,
		isApproving,
		remarksText,
		startEditingRemarks,
		handleApprove,
	})
</script>
