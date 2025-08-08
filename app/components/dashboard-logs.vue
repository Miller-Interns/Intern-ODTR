<script setup lang="ts">
	import { onClickOutside } from '@vueuse/core'
	import { useLogApproval } from '~/composables/useApproveLog'
	import type { TimeLogEntry } from '~/interfaces/time-logs'
	import { formatHours, formatTimeOnly } from '~/utils/formatters'

	const props = defineProps<{
		log: TimeLogEntry
	}>()

	const { isApproving, approve } = useLogApproval()
	const bus = useEventBus<void>('log:approved')

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
		const success = await approve(props.log.id, remarksText.value)
		if (success) {
			bus.emit()
		}
	}
</script>

<template>
	<UCard class="overflow-y-auto">
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
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ formatHours(log.total_hours) }}</p>
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
