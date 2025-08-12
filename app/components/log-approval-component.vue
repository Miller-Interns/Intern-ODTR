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
const adminRemarksText = ref(props.log.admin_remarks || '')
const dateDisplay = computed(() => formattedDate(props.log.time_in))
const timeInDisplay = computed(() => formatTimeOnly(props.log.time_in))
const timeOutDisplay = computed(() => formatTimeOnly(props.log.time_out))
const totalHoursDisplay = computed(() => formatHours(props.log.total_hours))

async function handleApprove(closeModal: () => void) {
	const success = await approve(props.log.id, adminRemarksText.value)

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
			<!-- This is the trigger for the modal -->
			<template #default>
				<UCard
					class="flex h-50 w-full cursor-pointer flex-col transition-all hover:-translate-y-1 hover:shadow-lg"
					:ui="{
						header: 'px-4 py-3 sm:px-6',
						body: 'flex-1 overflow-y-auto',
					}" role="button">
					<template #header>
						<div class="flex items-center justify-between">
							<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ dateDisplay }}</p>
							<UBadge class="font-base rounded-full" color="warning" variant="soft">
								Pending Approval
							</UBadge>
						</div>
					</template>
					<LogDetails :time-in="timeInDisplay" :time-out="timeOutDisplay" :total-hours="totalHoursDisplay" />
				</UCard>
			</template>

			<!-- Modal Content for Approval -->
			<template #content="{ close }">
				<UCard>
					<template #header>
						<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">{{ internName }}
						</h3>
					</template>

					<LogDetails :time-in="timeInDisplay" :time-out="timeOutDisplay" :total-hours="totalHoursDisplay" />

					<template #footer>
						<div class="flex flex-col gap-4">
							<!-- --- FIX: Display intern's notes for context (if they exist) --- -->
							<div v-if="log.intern_notes">
								<p class="font-medium text-gray-600 dark:text-gray-400">Intern Notes:</p>
								<p class="italic text-gray-800 dark:text-gray-200">"{{ log.intern_notes }}"</p>
							</div>
							<!-- Display Admin's Remarks -->
							<div v-if="log.admin_remarks">
								<p class="font-medium text-gray-600 dark:text-gray-400">Admin Remarks:</p>
								<p class="text-gray-800 dark:text-gray-200">{{ log.admin_remarks }}</p>
							</div>

							<!-- Admin's remarks section -->
							<div>
								<p class="text-sm font-semibold text-gray-500 dark:text-gray-400">Admin Remarks
									(Optional)</p>
								<UTextarea v-model="adminRemarksText" :rows="4" placeholder="Add notes for approval..."
									class="mt-1 w-full" />
							</div>
							<div class="flex justify-center">
								<UButton label="Approve" color="primary" :loading="isApproving"
									@click="handleApprove(close)" />
							</div>
						</div>
					</template>
				</UCard>
			</template>
		</UModal>

		<!-- Approved Logs (Static Card) -->
		<UCard v-else class="flex h-50 w-full flex-col" :ui="{ body: 'flex-1 overflow-y-auto' }">
			<template #header>
				<div class="flex items-center justify-between">
					<!-- --- FIX: Use the computed property for consistency --- -->
					<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ dateDisplay }}</p>
				</div>
			</template>

			<LogDetails :time-in="timeInDisplay" :time-out="timeOutDisplay" :total-hours="totalHoursDisplay" />

			<!-- --- FIX: Updated section to show both intern and admin notes correctly --- -->
			<div v-if="log.intern_notes || log.admin_remarks"
				class="mt-4 space-y-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-700">
				<!-- Display Intern's Notes -->
				<div v-if="log.intern_notes">
					<p class="font-medium text-gray-600 dark:text-gray-400">Intern Notes:</p>
					<p class="italic text-gray-800 dark:text-gray-200">"{{ log.intern_notes }}"</p>
				</div>
				<!-- Display Admin's Remarks -->
				<div v-if="log.admin_remarks">
					<p class="font-medium text-gray-600 dark:text-gray-400">Admin Remarks:</p>
					<p class="text-gray-800 dark:text-gray-200">{{ log.admin_remarks }}</p>
				</div>
			</div>
		</UCard>
	</div>
</template>