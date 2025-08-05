<!-- components/LogApprovalCard.vue -->
<script setup lang="ts">
	import { ref } from 'vue'
	import type { PropType } from 'vue'
	import type { TimeLogForUI } from '~/types/composites'
	import { useFormatting } from '@/composables/use-formatting'

	const { formatTimeOnly, formatDuration } = useFormatting()

	const props = defineProps({
		log: {
			type: Object as PropType<TimeLogForUI>,
			required: true,
		},
		internName: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['approved'])

	const isApproving = ref(false)
	const remarks = ref(props.log.remarks || '')
	const toast = useToast()

	// A computed property to determine which version of the component to render
	const isPending = computed(() => !props.log.status)

	async function handleApprove(closeModal: () => void) {
		if (isApproving.value) return
		isApproving.value = true

		try {
			await $fetch('/api/admin/approval/internlog', {
				method: 'POST',
				body: {
					logIds: [props.log.id],
					remarks: remarks.value,
				},
			})

			toast.add({ title: 'Log Approved!', color: 'success' })

			// On success, close the modal and tell the parent to refresh
			closeModal()
			emit('approved')
		} catch (err) {
			console.error('Failed to approve log:', err)
			toast.add({ title: 'Approval Failed', description: 'Could not approve the log.', color: 'error' })
		} finally {
			isApproving.value = false
		}
	}
</script>

<template>
	<div v-if="isPending">
		<UModal>
			<template #default>
				<UCard
					class="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
					:ui="{ body: 'px-4 py-4 sm:p-6' }"
				>
					<template #header>
						<div class="flex items-center justify-between">
							<span>{{ new Date(log.time_in).toLocaleDateString() }}</span>
							<UBadge
								color="primary"
								variant="solid"
							>
								Pending
							</UBadge>
						</div>
					</template>

					<div class="text-center font-semibold">{{ log.total_hours?.toFixed(1) || 0 }} Hours</div>
				</UCard>
			</template>

			<template #content="{ close }">
				<UCard>
					<template #header>
						<h3 class="text-base font-semibold">Approve Log for {{ internName }}</h3>
					</template>

					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4 text-center">
							<div>
								<p class="text-sm text-gray-500">Time In</p>
								<p class="font-medium">{{ formatTimeOnly(log.time_in) }}</p>
							</div>
							<div>
								<p class="text-sm text-gray-500">Time Out</p>
								<p class="font-medium">{{ formatTimeOnly(log.time_out) }}</p>
							</div>
						</div>
						<UFormGroup
							label="Add or Edit Remarks"
							name="remarks"
						>
							<UTextarea
								v-model="remarks"
								placeholder="Optional notes for the intern..."
							/>
						</UFormGroup>
					</div>

					<template #footer>
						<div class="flex justify-end gap-3">
							<UButton
								color="neutral"
								variant="ghost"
								label="Cancel"
								@click="close"
							/>
							<UButton
								label="Approve"
								:loading="isApproving"
								@click="handleApprove(close)"
							/>
						</div>
					</template>
				</UCard>
			</template>
		</UModal>
	</div>

	<div v-else>
		<UCard
			class="cursor-default opacity-60"
			:ui="{ body: 'px-4 py-4 sm:p-6' }"
		>
			<template #header>
				<div class="flex items-center justify-between">
					<span>{{ new Date(log.time_in).toLocaleDateString() }}</span>
					<UBadge
						color="primary"
						variant="solid"
					>
						Approved
					</UBadge>
				</div>
			</template>
			<div class="text-center font-semibold">{{ log.total_hours?.toFixed(1) || 0 }} Hours</div>
		</UCard>
	</div>
</template>
