<script setup lang="ts">
	import type { TimeLogEntry } from '~/interfaces/time-logs'
	import { useLogApproval } from '~/composables/useApproveLog'
	import { useTimeLogState } from '~/composables/useTimelogStates'
	import { formatHours, formatTimeOnly, formattedDate } from '~/utils/formatters'

	const props = defineProps<{
		log: TimeLogEntry
		internName: string
	}>()

	const emit = defineEmits<{
		(e: 'approved'): void
	}>()

	const { isApproving, approve } = useLogApproval()
	const { isPending } = useTimeLogState(props.log)
	const remarks = ref(props.log.remarks || '')

	const dateDisplay = computed(() => formattedDate(props.log.time_in))
	const timeInDisplay = computed(() => formatTimeOnly(props.log.time_in))
	const timeOutDisplay = computed(() => formatTimeOnly(props.log.time_out))
	const totalHoursDisplay = computed(() => formatHours(props.log.total_hours))

	async function handleApprove(closeModal: () => void) {
		const success = await approve(props.log.id, remarks.value)

		if (success) {
			closeModal()
			emit('approved')
		}
	}
</script>

<template>
	<div>
		<!-- Pending Logs (Clickable to open Modal) -->
		<UModal v-if="isPending">
			<template #default>
				<UCard
					class="flex h-50 w-full cursor-pointer flex-col transition-all hover:-translate-y-1 hover:shadow-lg"
					:ui="{
						header: 'px-4 py-3 sm:px-6',
						body: 'flex-1 overflow-y-auto',
					}"
					role="button"
				>
					<template #header>
						<div class="flex items-center justify-between">
							<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ dateDisplay }}</p>
							<UBadge
								class="font-base rounded-full"
								color="warning"
								variant="soft"
							>
								Pending Approval
							</UBadge>
						</div>
					</template>

					<LogDetails
						:time-in="timeInDisplay"
						:time-out="timeOutDisplay"
						:total-hours="totalHoursDisplay"
					/>
				</UCard>
			</template>

			<!-- Modal Content for Approval -->
			<template #content="{ close }">
				<UCard>
					<template #header>
						<h3 class="text-base leading-6 font-semibold text-gray-900 dark:text-white">{{ internName }}</h3>
					</template>

					<LogDetails
						:time-in="timeInDisplay"
						:time-out="timeOutDisplay"
						:total-hours="totalHoursDisplay"
					/>

					<template #footer>
						<div class="flex flex-col gap-4">
							<div>
								<p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Add Remarks (Optional)</p>
								<UTextarea
									v-model="remarks"
									:rows="4"
									placeholder="Add notes or remarks..."
									class="mt-1 w-full"
								/>
							</div>
							<div class="flex justify-center">
								<UButton
									label="Approve"
									color="primary"
									:loading="isApproving"
									@click="handleApprove(close)"
								/>
							</div>
						</div>
					</template>
				</UCard>
			</template>
		</UModal>

		<!-- Approved Logs -->
		<UCard
			v-else
			class="flex h-50 w-full flex-col"
			:ui="{ body: 'flex-1 overflow-y-auto' }"
		>
			<template #header>
				<div class="flex items-center justify-between">
					<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formattedDate }}</p>
				</div>
			</template>

			<LogDetails
				:time-in="timeInDisplay"
				:time-out="timeOutDisplay"
				:total-hours="totalHoursDisplay"
			/>

			<div
				v-if="log.remarks"
				class="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400"
			>
				<p class="font-medium">Intern Notes:</p>
				<p>{{ log.remarks }}</p>
			</div>
		</UCard>
	</div>
</template>
