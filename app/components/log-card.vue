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
						v-model="admin_remarks"
						:rows="4"
						placeholder="Add notes for approval..."
						class="w-full"
					/>
				</div>
				<div
					v-else-if="admin_remarks"
					class="mt-2"
				>
					<p class="text-sm font-normal text-gray-700 dark:text-gray-300">{{ admin_remarks }}</p>
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

	type Log = DashboardLog | InternLog

	const props = defineProps<{
		log: Log
	}>()

	const emit = defineEmits<{
		(e: 'approved'): void
	}>()

	const { isApproving, approve } = useLogApproval()

	const isEditingRemarks = ref(false)

	const admin_remarks = defineModel<string | null>('admin_remarks')

	const remarksContainer = ref<HTMLDivElement | null>(null)

	watch(admin_remarks, (newValue) => {
		console.log(`Remarks for log ${props.log.id} changed to:`, newValue)
	})

	onClickOutside(remarksContainer, () => {
		if (!admin_remarks.value || admin_remarks.value.trim() === '') {
			isEditingRemarks.value = false
		}
	})

	async function startEditingRemarks() {
		isEditingRemarks.value = true
		await nextTick()
		remarksContainer.value?.querySelector('textarea')?.focus()
	}

	async function handleApprove() {
		const success = await approve(props.log.id, admin_remarks.value ?? null)
		if (success) {
			emit('approved')
			isEditingRemarks.value = false
		}
	}

	const calculatedHours = computed<number | null>(() => {
		if (props.log.status === true) {
			return props.log.total_hours
		}

		if (!props.log.time_in || !props.log.time_out) {
			return null
		}

		const timeIn = new Date(props.log.time_in)
		const timeOut = new Date(props.log.time_out)

		if (isNaN(timeIn.getTime()) || isNaN(timeOut.getTime())) {
			return null
		}

		const BREAK_HOURS = 1
		const grossDurationHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60)

		return Math.max(0, grossDurationHours - BREAK_HOURS)
	})

	const totalHoursForDisplay = computed(() => {
		return formatDuration(calculatedHours.value)
	})

	defineExpose({
		isEditingRemarks,
		isApproving,
		startEditingRemarks,
		handleApprove,
	})
</script>
