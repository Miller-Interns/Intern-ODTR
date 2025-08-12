<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useLogApproval } from '~/composables/useApproveLog'
import type { InternLogs } from '~/interfaces/interns'
import { formatHours, formatTimeOnly } from '~/utils/formatters'
import { calculateDisplayHours } from '~/utils/total-hours'

const props = defineProps<{
	log: InternLogs
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
const remarksText = ref(props.log.admin_remarks || '')
const remarksContainer = ref<HTMLDivElement | null>(null)
const remarksButtonLabel = computed(() => {
	return props.log.admin_remarks ? 'Edit Remarks' : 'Add Remarks'
})

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

const totalHoursForDisplay = computed(() => {
	if (props.log.status === true) {
		return formatHours(props.log.total_hours);
	}

	const { displayHours } = calculateDisplayHours(props.log.time_in, props.log.time_out);
	return formatHours(displayHours); 
});

</script>

<template>
	<UCard class="overflow-y-auto">
		<template #header>
			<div class="flex items-center space-x-3">
				<UAvatar :src="avatarUrl || ''" alt="intern.user.name ?? 'Intern'" size="3xl" />
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
					<p class="text-xs font-medium text-gray-900 dark:text-white">{{ totalHoursForDisplay }}</p>
				</div>
			</div>

			<!-- Display Intern's Notes (Read-only) -->
			<div v-if="log.intern_notes">
				<UDivider label="Intern Notes" />
				<p class="mt-2 text-sm font-normal text-gray-700 italic dark:text-gray-300">"{{ log.intern_notes }}"</p>
			</div>

			<!-- Admin Remarks Section (Editable) -->
			<div>
				<UDivider label="Admin Remarks" />
				<!-- Editing State -->
				<div v-if="isEditingRemarks" ref="remarksContainer" class="mt-2">
					<UTextarea v-model="remarksText" :rows="4" placeholder="Add notes for approval..." class="w-full" />
				</div>
			</div>

		</div>

		<template #footer>
			<div class="flex flex-col gap-3">
				<UButton v-if="!isEditingRemarks" :label="remarksButtonLabel" icon="i-lucide-plus" color="neutral"
					variant="outline" block @click="startEditingRemarks" />
				<UButton label="Approve Log" icon="i-lucide-check" color="primary" variant="solid" block
					:loading="isApproving" :disabled="isApproving" @click="handleApprove" />
			</div>
		</template>
	</UCard>
</template>