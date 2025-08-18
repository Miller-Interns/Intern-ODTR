import { z } from 'zod'
import { db } from '~/server/db'
import { createError } from 'h3'
import { timeLogService } from '~/server/service/time-logs.service'
import { internService } from '~/server/service/intern.service'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { checkAuthentication } from '~/server/utils/check-authentication'
import type { RequestContext } from '~/server/types/RequestContext'

const dtoSchema = z.object({
	logId: z.string().min(1, 'Log ID cannot be empty.'),
	admin_remarks: z.string().nullable().optional(),
})

const validateDTO = createSchemaValidator(dtoSchema)
export type ApproveSingleLogDTO = z.infer<typeof dtoSchema>

type ApproveSingleLogResult = {
	success: true
	logId: string
	updatedCompletedHours: number
}

function calculateWorkHours(timeIn: Date, timeOut: Date): number {
	const BREAK_HOURS = 1
	const grossDurationHours = (timeOut.getTime() - timeIn.getTime()) / (1000 * 60 * 60)
	return Math.max(0, grossDurationHours - BREAK_HOURS)
}

export const approveSingleLog = async (
	dto: ApproveSingleLogDTO,
	context: RequestContext
): Promise<ApproveSingleLogResult> => {
	// 1. Authentication and Validation (outside the transaction)
	const adminId = await checkAuthentication(context); const { logId, admin_remarks } = await validateDTO(dto)

	// 2. Start a database transaction to ensure atomicity
	return db.transaction().execute(async (trx) => {
		// Create a new context for this transaction
		const trxContext: RequestContext = { ...context, trx }

		// 3. Fetch the necessary data within the transaction
		const log = await timeLogService.getLogById(logId, trxContext)
		if (!log) {
			throw createError({ statusCode: 404, statusMessage: 'Log not found.' })
		}
		if (!log.time_out) {
			throw createError({
				statusCode: 400,
				statusMessage: 'This log cannot be approved because the intern has not logged out yet.',
			})
		}
		// if (log.status === true) {
		// 	console.warn(`Log ${logId} is already approved.`)
		// 	// To find the intern's hours, we still need to fetch them.
		// 	const intern = await internService.getInternById(log.intern_id, trxContext)
		// 	return { success: true, logId, updatedCompletedHours: intern?.hours_completed ?? 0 }
		// }

		const intern = await internService.getInternDetailsById(log.intern_id, trxContext)
		if (!intern) {
			// This case indicates data integrity issues, as a log should always have a valid intern
			throw createError({
				statusCode: 500,
				statusMessage: `Data integrity error: Intern with ID ${log.intern_id} not found for the given log.`,
			})
		}

		// 5. Handle cases where the log is already approved
		if (log.status === true) {
			console.warn(`Log ${logId} is already approved. No action was taken.`)
			return {
				success: true,
				logId,
				updatedCompletedHours: intern.hours_completed ?? 0,
			}
		}

		// 4. Perform Business Logic Calculations
		const totalHoursForLog = calculateWorkHours(log.time_in, log.time_out)
		const currentCompletedHours = intern.hours_completed ?? 0
		const newCompletedHours = currentCompletedHours + totalHoursForLog

		await timeLogService.approveLog(
			logId,
			adminId,
			{
				admin_remarks: admin_remarks || null,
				totalHours: totalHoursForLog,
			},
			trxContext
		)

		await internService.updateCompletedHours(
			intern.id,
			newCompletedHours,
			trxContext
		)

		return { success: true, logId, updatedCompletedHours: newCompletedHours }
	})
}