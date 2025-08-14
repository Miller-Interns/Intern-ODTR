import type { Kysely } from 'kysely'
import type { DB } from '~/server/db/types'
import { approveLog } from '~/server/service/approve-log.service'

export async function useApproveSingleLog(db: Kysely<DB>, logId: string, admin_remarks: string | null, adminId: string) {
	await approveLog(db, logId, admin_remarks, adminId)
	return { success: true }
}
