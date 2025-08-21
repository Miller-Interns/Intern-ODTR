import { approveLogApi } from '~/server/utils/api/time-log'

export function useLogApproval() {
	const isApproving = ref(false)
	const toast = useToast()

	const approve = async (logId: string, admin_remarks: string | null): Promise<boolean> => {
		isApproving.value = true
		try {
			await approveLogApi({ logId, admin_remarks })
			toast.add({ title: 'Log Approved', color: 'success' })
			return true
		} catch (error: any) {
			const errorMessage = error.data?.statusMessage || 'Approval failed.'
			toast.add({ title: 'Error', description: errorMessage, color: 'error' })
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
