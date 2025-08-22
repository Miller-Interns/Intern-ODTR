import type { BulkApprovalApiResponse } from '~/types/Api'
import type { ApproveLogPayload, BulkApprovePayload } from '~/types/TimeLog'

export function approveLogApi(payload: ApproveLogPayload) {
	return $fetch('/api/timelog/admin/approve-log', {
		method: 'PATCH',
		body: payload,
	})
}

export function bulkApproveLogsApi(payload: BulkApprovePayload) {
	return $fetch<BulkApprovalApiResponse>('/api/timelog/admin/approve-all', {
		method: 'POST',
		body: payload,
	})
}
