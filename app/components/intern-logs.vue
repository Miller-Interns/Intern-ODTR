	<template>
		<LogCard
			ref="logCardRef"
			:log="log"
			@approved="emit('approved')"
		>
			<template #header>
				<div class="flex items-center justify-between w-[327px]">
					<p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ dateDisplay }}</p>
					<UModal
						v-model:open="isApproveModalOpen"
						title="Confirmation"
					>
							<UBadge
								v-if="isPending && logCardRef"
								class="font-base rounded-full"
								color="warning"
								variant="soft"
								as="button"
							>
								Pending Approval
							</UBadge>

						<template #header>
							<h2 class="text-2xl font-bold dark:text-gray-400">Approve Time Log</h2>
						</template>
						<template #body>
							<p class="py-4 text-black dark:text-gray-400">
								Are you sure you want to approve {{ props.log.intern.name }}'s pending time log?
							</p>
						</template>
						<template #footer>
							<div class="flex w-full items-center justify-center gap-8">
								<UButton
									@click="isApproveModalOpen = false"
									color="primary"
									variant="outline"
									label="Cancel"
									class="text-md text-black"
								/>
								<UButton
									color="primary"
									label="Confirm"
									class="text-md text-white"
									@click="logCardRef.handleApprove()"
									:loading="logCardRef.isApproving"
								/>
							</div>
						</template>
					</UModal>
				</div>
			</template>

			<template #body-extra>
				<div v-if="!isPending && log.admin_remarks">
					<UDivider class="my-3" />
					<p class="text-xs font-medium text-gray-500">Admin Remarks:</p>
					<p class="text-sm font-semibold">{{ log.admin_remarks }}</p>
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
		import type { InternLog } from '~/types/TimeLog'
		import { useTimeLogState } from '~/composables/useTimelogStates'
		import { formattedDate } from '~/server/utils/formatters'

		const props = defineProps<{ log: InternLog }>()
		const emit = defineEmits<{ (e: 'approved'): void }>()
		const logCardRef = ref()
		const { isPending } = useTimeLogState(props.log)
		const dateDisplay = computed(() => formattedDate(props.log.time_in))
		const isApproveModalOpen = ref(false)

		const remarksButtonLabel = computed(() => {
			return props.log.admin_remarks ? 'Edit Remarks' : 'Add Remarks (Optional)'
		})
	</script>
