import { bulkApproveLogsApi } from '~/utils/api/time-log';
import type { ApproveLogPayload, BulkApprovePayload } from '~/interfaces/time-logs';

export function useBulkApproval() {
    const isApproving = ref(false);
    const toast = useToast();
    const approveAll = async (logsToApprove: ApproveLogPayload[]): Promise<boolean> => {
        if (!logsToApprove || logsToApprove.length === 0) {
            toast.add({ title: 'No logs selected to approve.', color: 'warning' });
            return false;
        }

        isApproving.value = true;
        try {
            const payload: BulkApprovePayload = {
                logs: logsToApprove,
            };
            const response = await bulkApproveLogsApi(payload);

            toast.add({ title: 'Success', description: response.message, color: 'success' });
            return true;
        } catch (error: any) {
            console.error('Failed to approve all logs:', error);
            const errorMessage = error.data?.statusMessage || 'Could not approve all logs.';
            toast.add({ title: 'Approval Failed', description: errorMessage, color: 'error' });
            return false;
        } finally {
            isApproving.value = false;
        }
    };

    return {
        isApproving,
        approveAll,
    };
}