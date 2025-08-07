import type { PendingTimeLog } from '~/types/composites'
import { useTimeLog } from '~/composables/useTimeLog'

export default function useLogApproval() {
    const isApproving = ref(false)
    const { calculateHours } = useTimeLog()
    const bus = useEventBus<void>('log:approved')
    const toast = useToast()


    const approve = async (logData: PendingTimeLog, internName: string, remarks: string): Promise<boolean> => {
        if (!logData) {
            console.error('approve function called without a log.')
            toast.add({ title: 'Internal Error', description: 'No log data provided.', color: 'error' })
            return false
        }

        isApproving.value = true
        try {
            const { totalHours, overtimeHours } = calculateHours(logData.time_in, logData.time_out)
            await $fetch('/api/approve-log', {
                method: 'PATCH',
                body: {
                    logId: logData.id,
                    remarks: remarks,
                    status: true,
                    total_hours: totalHours,
                    overtime: overtimeHours,
                },
            })
            bus.emit()
            toast.add({ title: 'Log Approved', description: `Log for ${internName} has been approved.`, color: 'success', icon: 'i-lucide-check-circle' })
            return true

        } catch (error: any) {
            console.error('Failed to approve log:', error)
            const errorMessage = error.data?.message || 'Please try again.'
            toast.add({ title: 'Approval Failed', description: errorMessage, color: 'error' })
            return false
        } finally {
            isApproving.value = false
        }
    }

    return {
        isApproving,
        approve,
    }
}
