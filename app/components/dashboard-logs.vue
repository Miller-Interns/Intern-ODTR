<template>
	<LogCard
		ref="logCardRef"
		:log="log"
		v-model:admin_remarks="admin_remarks"
		@approved="bus.emit()"
	>
		<template #header>
			<div class="flex items-center space-x-3">
				<UAvatar
					:src="avatarUrl || ''"
					alt="Intern"
					size="3xl"
				/>
				<p class="text-base font-semibold">{{ log.intern_name }}</p>
			</div>
		</template>

		<template #footer>
			<div
				v-if="logCardRef"
				class="flex flex-col gap-3"
			>
				<UButton
					v-if="!logCardRef.isEditingRemarks"
					:label="remarksButtonLabel"
					icon="i-lucide-plus"
					color="neutral"
					variant="outline"
					block
					@click="logCardRef.startEditingRemarks()"
				/>

				<UModal
					v-model:open="isApproveModalOpen"
					title="Confirmation"
				>
					<UButton
						label="Approve Log"
						icon="i-lucide-check"
						color="primary"
						variant="solid"
						block
					/>
					<template #header>
						<h2 class="text-2xl font-bold dark:text-gray-400">Approve Time Log</h2>
					</template>
					<template #body>
						<p class="py-4 text-black dark:text-gray-400">Are you sure you want to approve {{ log.intern_name }}'s pending time log?</p>
					</template>
					<template #footer>
						<div class="flex w-full items-center justify-center gap-8">
							<UButton
								@click="isApproveModalOpen = false"
								color="primary"
								variant="outline"
								label="Cancel"
								class="text-md text-black"
								block
							/>
							<UButton
								color="primary"
								label="Confirm"
								class="text-md text-white"
								:loading="logCardRef.isApproving"
								:disabled="logCardRef.isApproving"
								@click="logCardRef.handleApprove()"
								block
							/>
						</div>
					</template>
				</UModal>
			</div>
		</template>
	</LogCard>
</template>

<script setup lang="ts">
	import type { DashboardLog } from '~/types/TimeLog'

	const props = defineProps<{ log: DashboardLog }>()
	const bus = useEventBus<void>('log:approved')
	const logCardRef = ref()
	const admin_remarks = defineModel<string | null>('admin_remarks')
	const isApproveModalOpen = ref(false)

	const avatarUrl = computed(() => {
		if (props.log.intern_picture) {
			return `/uploads/avatars/${props.log.intern_picture}`
		}
		return null
	})

	const remarksButtonLabel = computed(() => {
		return admin_remarks.value ? 'Edit Remarks' : 'Add Remarks'
	})
</script>
