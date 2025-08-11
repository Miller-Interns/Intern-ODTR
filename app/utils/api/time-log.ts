import type { BulkApprovalApiResponse } from '~/interfaces/api';
import type { ApproveLogPayload, BulkApprovePayload } from '~/interfaces/time-logs';

export function approveLogApi(payload: ApproveLogPayload) {
    return $fetch('/api/timelogs/approve-log', {
        method: 'PATCH',
        body: payload,
    });
}

export function bulkApproveLogsApi(payload: BulkApprovePayload) {
    return $fetch<BulkApprovalApiResponse>('/api/timelogs/approve-all', {
        method: 'POST',
        body: payload,
    });
}


