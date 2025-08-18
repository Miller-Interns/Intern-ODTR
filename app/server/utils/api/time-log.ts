import type { BulkApprovalApiResponse } from '~/types/Api'
import type { ApproveLogPayload, BulkApprovePayload } from '~/types/TimeLog'

export function approveLogApi(payload: ApproveLogPayload) {
	return $fetch('/api/timelogs/approve-log', {
		method: 'PATCH',
		body: payload,
	})
}

export function bulkApproveLogsApi(payload: BulkApprovePayload) {
	return $fetch<BulkApprovalApiResponse>('/api/timelogs/approve-all', {
		method: 'POST',
		body: payload,
	})
}
