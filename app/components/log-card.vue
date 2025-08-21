<template>
	<UCard class="w-full shadow-md">
		<template #header>
			<div class="flex items-start space-x-4">
				<slot name="header" />
			</div>
		</template>

		<div class="space-y-3">
			<div class="grid grid-cols-3 text-center">
				<div>
					<p class="text-xs font-medium text-gray-500 dark:text-gray-400">Time In</p>
					<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_in) }}</p>
				</div>
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400">Time Out</p>
					<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_out) }}</p>
				</div>
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400">Total Hours:</p>
					<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ totalHoursForDisplay }}</p>
				</div>
			</div>

			<div v-if="log.intern_notes">
				<p class="text-xs break-words text-gray-500 dark:text-gray-400">Intern Notes:</p>
				<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ log.intern_notes }}</p>
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

		<template
			v-if="!log.status"
			#footer
		>
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

	const props = defineProps<{ log: Log }>()
	const emit = defineEmits<{ (e: 'approved'): void }>()
	const { isApproving, approve } = useLogApproval()
	const isEditingRemarks = ref(false)
	const admin_remarks = defineModel<string | null>('admin_remarks')
	const remarksContainer = ref<HTMLDivElement | null>(null)

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
