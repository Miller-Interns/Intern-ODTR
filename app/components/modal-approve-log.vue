<script setup lang="ts">
	import type { TimeLogForUI } from '~/types/composites'
	import { useApprovalModal } from '~/composables/use-approval-modal'

	// const props = defineProps({
	// 	modelValue: { type: Boolean, default: false },
	// 	log: { type: Object as PropType<TimeLogForUI | null>, default: null },
	// 	internName: { type: String, default: 'Intern' },
	// })

	// const emit = defineEmits(['update:modelValue', 'approve-with-remarks'])

	const { isModalOpen, selectedLog: log, internName, isApproving, close, approveWithRemarks } = useApprovalModal()
	const isEditingRemarks = ref(false)
	const remarksText = ref('')

	watch(log, (newLog) => {
		if (newLog) {
			remarksText.value = newLog.remarks || ''
			isEditingRemarks.value = false
		}
	})

	function formatTimeOnly(dateString: string | null) {
		if (!dateString) return 'N/A'
		return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
	}

	function formatDuration(hours: number | null | undefined) {
		if (hours === null || hours === undefined) return '0 Hours'
		return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(hours)} Hours`
	}

	function handleApprove() {
		approveWithRemarks(remarksText.value)
	}
</script>

<template>
	<UModal v-model="isModalOpen">
		<UCard
			v-if="log"
			divide="divide-y divide-gray-100 dark:divide-gray-800"
			class="w-full max-w-lg"
		>
			<template #header>
				<h3 class="text-center text-lg font-bold text-gray-800 dark:text-white">
					{{ internName }}
				</h3>
			</template>

			<!-- Time Details Grid -->
			<div class="mb-6 grid grid-cols-3 gap-2 text-center">
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400">Time in</p>
					<p class="font-bold text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_in) }}</p>
				</div>
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400">Time out</p>
					<p class="font-bold text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_out) }}</p>
				</div>
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400">Total Hours</p>
					<p class="font-bold text-gray-900 dark:text-white">{{ formatDuration(log.total_hours) }}</p>
				</div>
			</div>

			<p class="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
				Overtime (if there is any):
				<span class="font-bold text-gray-900 dark:text-white">{{ formatDuration(log.overtime) }}</span>
			</p>

			<div
				v-if="isEditingRemarks"
				class="mt-4"
			>
				<label
					for="remarks"
					class="mb-2 block text-sm font-semibold text-gray-800 dark:text-white"
				>
					Note and Remarks:
				</label>
				<UTextarea
					id="remarks"
					v-model="remarksText"
					:rows="4"
					placeholder="Note and Remarks"
					class="w-full"
				/>
			</div>

			<!-- Remarks Display -->
			<div
				v-else-if="log.remarks"
				class="border-t border-gray-200 pt-3 dark:border-gray-700"
			>
				<p class="text-xs font-semibold text-gray-500 dark:text-gray-400">Remarks:</p>
				<p class="text-sm text-gray-700 italic dark:text-gray-300">"{{ log.remarks }}"</p>
			</div>

			<template #footer>
				<div class="flex flex-col gap-3">
					<UButton
						v-if="!isEditingRemarks"
						color="neutral"
						variant="outline"
						block
						icon="i-lucide-plus"
						@click="isEditingRemarks = true"
					>
						Add/Edit Remarks
					</UButton>

					<UButton
						color="primary"
						variant="solid"
						block
						@click="handleApprove"
					>
						Approve
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
