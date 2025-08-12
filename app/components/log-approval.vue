<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import type { TimeLogEntry } from '~/interfaces/time-logs'
import { useLogApproval } from '~/composables/useApproveLog'
import { useTimeLogState } from '~/composables/useTimelogStates'
import { formatHours, formatTimeOnly, formattedDate } from '~/utils/formatters'
import { calculateDisplayHours } from '~/utils/total-hours'

const props = defineProps<{
    log: TimeLogEntry
    internName: string
}>()

const emit = defineEmits<{
    (e: 'approved'): void
}>()

const isEditingRemarks = ref(false)
const adminRemarksText = ref(props.log.admin_remarks || '')
const remarksContainer = ref<HTMLDivElement | null>(null)

const { isApproving, approve } = useLogApproval()
const { isPending } = useTimeLogState(props.log)
const dateDisplay = computed(() => formattedDate(props.log.time_in))

const remarksButtonLabel = computed(() => {
    return props.log.admin_remarks ? 'Edit Remarks' : 'Add Remarks (Optional)'
})

const totalHoursForDisplay = computed(() => {
    if (props.log.status === true) {
        return formatHours(props.log.total_hours);
    }

    const { displayHours } = calculateDisplayHours(props.log.time_in, props.log.time_out);
    return formatHours(displayHours);
});

async function handleApprove() {
    const success = await approve(props.log.id, adminRemarksText.value)
    if (success) {
        emit('approved')
        isEditingRemarks.value = false
    }
}

async function startEditingRemarks() {
    isEditingRemarks.value = true
    await nextTick()
    remarksContainer.value?.querySelector('textarea')?.focus()
}

onClickOutside(remarksContainer, () => {
    if (isEditingRemarks.value) {
        isEditingRemarks.value = false
    }
})

</script>

<template>
    <UCard class="w-full" :ui="{
        body: 'sm:px-4 sm:py-4',
        footer: 'sm:px-4 sm:py-2',
    }">
        <template #header>
            <div class="flex items-center justify-between">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ dateDisplay }}</p>
                <UBadge v-if="isPending" class="font-base rounded-full" color="warning" variant="soft" as="button"
                    @click="handleApprove" :loading="isApproving">
                    Pending Approval
                </UBadge>
            </div>
        </template>

        <!-- Main Content Body -->
        <div class="space-y-4">
            <div class="grid grid-cols-3 text-center">
                <div>
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Time In</span>
                    <p class="font-medium text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_in) }}</p>
                </div>
                <div>
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Time Out</span>
                    <p class="font-medium text-gray-900 dark:text-white">{{ formatTimeOnly(log.time_out) }}</p>
                </div>
                <div>
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Hours</span>
                    <p class="font-medium text-gray-900 dark:text-white">{{ totalHoursForDisplay }}</p>
                </div>
            </div>

            <div v-if="log.intern_notes">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Intern Notes:</p>
                <p class="text-sm italic text-gray-800 dark:text-gray-200">"{{ log.intern_notes }}"</p>
            </div>

            <div v-if="!isPending && log.admin_remarks">
                <UDivider class="my-3" />
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Remarks:</p>
                <p class="text-sm text-gray-800 dark:text-gray-200">{{ log.admin_remarks }}</p>
            </div>

            <div>
                <UDivider label="Admin Remarks" />
                <div v-if="isEditingRemarks" ref="remarksContainer" class="mt-2">
                    <UTextarea v-model="adminRemarksText" :rows="4" placeholder="Add notes for approval..." class="w-full" />
                </div>
            </div>
        </div>

        <template #footer>
            <div v-if="isPending" class="flex flex-col gap-3">
                <UButton v-if="!isEditingRemarks" :label="remarksButtonLabel" icon="i-lucide-plus" color="neutral"
                    variant="ghost" block @click="startEditingRemarks" />

            </div>

        </template>
    </UCard>
</template>