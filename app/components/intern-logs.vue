<template>
	<LogCard
		ref="logCardRef"
		:log="log"
		@approved="emit('approved')"
	>
		<template #header>
			<div class="flex items-center justify-between">
				<p class="text-sm font-semibold text-gray-900 dark:text-white">{{ dateDisplay }}</p>
				<UBadge
					v-if="isPending && logCardRef"
					class="font-base rounded-full"
					color="warning"
					variant="soft"
					as="button"
					@click="logCardRef.handleApprove()"
					:loading="logCardRef.isApproving"
				>
					Pending Approval
				</UBadge>
			</div>
		</template>

		<template #body-extra>
			<div v-if="!isPending && log.admin_remarks">
				<UDivider class="my-3" />
				<p class="text-sm font-medium text-gray-500">Admin Remarks:</p>
				<p class="text-sm">{{ log.admin_remarks }}</p>
			</div>
		</template>

		<template #footer>
			<div
				v-if="logCardRef && isPending"
				class="flex flex-col gap-3"
			>
				<UButton
					v-if="!logCardRef.isEditingRemarks"
					icon="i-lucide-plus"
					color="neutral"
					variant="ghost"
					:label="remarksButtonLabel"
					block
					@click="logCardRef.startEditingRemarks()"
				/>
			</div>
		</template>
	</LogCard>
</template>

<script setup lang="ts">
	import type { TimeLogEntry } from '~/interfaces/time-logs'
	import { useTimeLogState } from '~/composables/useTimelogStates'
	import { formattedDate } from '~/utils/formatters'

	const props = defineProps<{ log: TimeLogEntry }>()
	const emit = defineEmits<{ (e: 'approved'): void }>()
	const logCardRef = ref()
	const { isPending } = useTimeLogState(props.log)
	const dateDisplay = computed(() => formattedDate(props.log.time_in))
	const remarksButtonLabel = computed(() => {
		return props.log.admin_remarks ? 'Edit Remarks' : 'Add Remarks (Optional)'
	})
</script>
