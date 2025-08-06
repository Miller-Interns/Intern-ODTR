<!-- components/LogApprovalCard.vue -->
<script setup lang="ts">
	import type { RawTimeLog } from '~/types/composites'
	import useLogApproval from '~/composables/use-approve-logs'
	import { useLogDisplay } from '~/composables/use-log-display'
	import { useTimeLogState } from '~/composables/use-timelog-state'

	const props = defineProps<{
		log: RawTimeLog
		internName: string
	}>()

	const emit = defineEmits(['approved'])
	const { isApproving, approve } = useLogApproval()
	const { formattedDate, timeIn, timeOut, totalHours, overtime } = useLogDisplay(props.log)
	const { isPending } = useTimeLogState(props.log)
	const remarks = ref(props.log.remarks || '')

	async function handleApprove(closeModal: () => void) {
		const success = await approve(props.log, props.internName, remarks.value)
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
							<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formattedDate }}</p>
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
						:time-in="timeIn"
						:time-out="timeOut"
						:total-hours="totalHours"
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
						:time-in="timeIn"
						:time-out="timeOut"
						:total-hours="totalHours"
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
				:time-in="timeIn"
				:time-out="timeOut"
				:total-hours="totalHours"
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
