import type { BulkApprovalApiResponse } from '~/interfaces/api';
import type { ApproveLogPayload, BulkApprovePayload } from '~/interfaces/time-logs';

export function approveLogApi(payload: ApproveLogPayload) {
    return $fetch('/api/approve-log', {
        method: 'PATCH',
        body: payload,
    });
}

export function bulkApproveLogsApi(payload: BulkApprovePayload) {
    return $fetch<BulkApprovalApiResponse>('/api/approve-all', {
        method: 'POST',
        body: payload,
    });
}


