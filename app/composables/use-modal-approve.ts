import type { TimeLogForUI } from '~/types/composites'

// This composable will manage the state for our one global approval modal.
// `useState` ensures the state is a singleton across the app.
export default function useApprovalModal() {
    const isModalOpen = useState<boolean>('is-approval-modal-open', () => false)
    const selectedLog = useState<TimeLogForUI | null>('approval-modal-log', () => null)
    const open = (log: TimeLogForUI) => {
        selectedLog.value = log
        isModalOpen.value = true
    }

    const close = () => {
        isModalOpen.value = false
        // A small delay prevents the modal content from flashing before the close animation is complete.
        setTimeout(() => {
            selectedLog.value = null
        }, 200)
    }

    return {
        isModalOpen,
        selectedLog,
        open,
        close,
    }
}