<script setup lang="ts">
	import { onClickOutside } from '@vueuse/core'
	import useLogApproval from '~/composables/use-approve-logs'
	import { useFormatting } from '@/composables/use-formatting'
	import type { PendingTimeLog } from '../types/composites.js'

	const toast = useToast()
	const { formatTimeOnly } = useFormatting()
	const { isApproving, approve } = useLogApproval()
	const { calculateMinutes, formatMinutesAsHours } = useTimeLogCalculator()

	const props = defineProps<{
		log: PendingTimeLog
	}>()

	const calculatedPreview = computed(() => {
		return calculateMinutes(props.log.time_in, props.log.time_out)
	})

	const avatarUrl = computed(() => {
		if (props.log.intern.intern_picture) {
			return `/uploads/avatars/${props.log.intern.intern_picture}`
		}
		return null
	})

	const isEditingRemarks = ref(false)
	const remarksText = ref(props.log.remarks || '')
	const remarksContainer = ref<HTMLDivElement | null>(null)

	onClickOutside(remarksContainer, () => {
		isEditingRemarks.value = false
	})

	async function startEditingRemarks() {
		isEditingRemarks.value = true
		await nextTick()
		remarksContainer.value?.querySelector('textarea')?.focus()
	}

	async function handleApprove() {
		if (!props.log.intern.name) {
			console.error('Attempted to approve a log for an intern with no name.', props.log)
			toast.add({
				title: 'Approval Failed',
				description: 'Cannot approve a log for an intern without a name.',
				color: 'error',
			})
			return
		}
		await approve({ id: props.log.id, time_in: props.log.time_in, time_out: props.log.time_out }, props.log.intern.name, remarksText.value)
	}
</script>

<template>
	<UCard class="h-90 overflow-y-auto">
		<template #header>
			<div class="flex items-center space-x-3">
				<UAvatar
					:src="avatarUrl || ''"
					alt="intern.user.name ?? 'Intern'"
					size="3xl"
				/>
				<p class="text-base font-semibold text-gray-800 dark:text-white">{{ log.intern.name }}</p>
			</div>
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
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatMinutesAsHours(calculatedPreview.totalMinutes) }}</p>
				</div>
			</div>

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
				<p class="mt-2 text-base font-normal text-gray-700 italic dark:text-gray-300">Intern Notes: "{{ log.remarks }}"</p>
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
					@click="startEditingRemarks"
				/>
				<UButton
					label="Approve"
					icon="i-lucide-check"
					color="primary"
					variant="solid"
					block
					:loading="isApproving"
					:disabled="isApproving"
					@click="handleApprove"
				/>
			</div>
		</template>
	</UCard>
</template>
