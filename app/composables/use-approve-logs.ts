import type { TimeLogForUI } from '~/types/composites'

export default function useLogApproval() {
    const isApproving = ref(false)
    const bus = useEventBus<void>('log:approved')
    const toast = useToast()

    // const bus = useEventBus<void>('log:approved')

    const approve = async (log: TimeLogForUI, remarks: string): Promise<boolean> => {
        if (!log) {
            console.error('approve function called without a log.')
            return false
        }

        isApproving.value = true
        try {
            await $fetch('/api/admin/approval/approval', {
                method: 'PATCH',
                body: {
                    logId: log.id,
                    remarks: remarks,
                    status: true,
                    total_hours: log.total_hours,
                    overtime: log.overtime,
                },
            })
            bus.emit()
            toast.add({ title: 'Log Approved', description: `Log for ${log.intern.name} has been approved.`, color: 'success', icon: 'i-lucide-check-circle' })
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
