<script setup lang="ts">
	import type { TimeLogForUI } from '../types/composites.js'

	const { log } = defineProps<{ log: TimeLogForUI }>()
	const emit = defineEmits(['approve-with-remarks'])

	const isEditingRemarks = ref(false)
	const remarksText = ref(log.remarks || '')
	const remarksContainer = ref<HTMLDivElement | null>(null)

	onClickOutside(remarksContainer, () => {
		isEditingRemarks.value = false
	})

	async function startEditingRemarks() {
		isEditingRemarks.value = true
		await nextTick()
		remarksContainer.value?.querySelector('textarea')?.focus()
	}

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
	<UCard>
		<template #header>
			<p class="text-base font-semibold text-gray-800 dark:text-white">{{ log.intern.name }}</p>
		</template>

		<!-- Main Content Body -->
		<div class="space-y-4">
			<!-- Info Grid -->
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
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatDuration(log.total_hours) }}</p>
				</div>
			</div>

			<!-- Overtime
			<div class="px-2 text-sm text-gray-500 dark:text-gray-400">
				Overtime (if there is any):
				<span class="ml-2 font-bold text-gray-900 dark:text-white">{{ formatDuration(log.overtime) }}</span>
			</div> -->

			<!-- Remarks Section -->
			<div
				v-if="isEditingRemarks"
				ref="remarksContainer"
			>
				<UTextarea
					v-model="remarksText"
					:rows="4"
					placeholder="Add notes or remarks..."
					class="w-full"
				/>
			</div>

			<!-- Remarks Display -->
			<div v-else-if="log.remarks">
				<UDivider label="Remarks" />
				<p class="mt-2 text-base font-normal text-gray-700 italic dark:text-gray-300">"{{ log.remarks }}"</p>
			</div>
		</div>

		<template #footer>
			<div class="flex flex-col gap-3">
				<UButton
					v-if="!isEditingRemarks"
					label="Add Remarks"
					icon="i-lucide-plus"
					color="neutral"
					variant="outline"
					block
					@click="isEditingRemarks = true"
				/>
				<UButton
					label="Approve"
					icon="i-lucide-check"
					color="primary"
					variant="solid"
					block
					@click="handleApprove"
				/>
			</div>
		</template>
	</UCard>
</template>
