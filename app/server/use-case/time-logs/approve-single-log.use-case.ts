import { z } from 'zod'
import { jwtDecode } from 'jwt-decode'
import { db } from '~/server/db'
import type { DB } from '~/server/db/types'
import type { Transaction } from 'kysely'
import { createError } from 'h3'
import { timeLogService } from '~/server/service/time-logs.service'
import { internService } from '~/server/service/intern.service'
import { createSchemaValidator } from '~/server/utils/create-schema-validator'
import { checkAuthentication } from '~/server/utils/check-authentication'
import type { RequestContext } from '~/server/types/RequestContext'

interface JwtPayload {
	userId: string;
	email: string;
	iat: number;
	exp: number;
}

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

export async function approveLogLogic(
	trx: Transaction<DB>,
	context: RequestContext,
	logId: string,
	adminId: string,
	admin_remarks: string | null,
) {
	// Create a context that uses the provided transaction
	const trxContext: RequestContext = { ...context, trx }

	// 3. Fetch the necessary data
	const log = await timeLogService.getLogById(logId, trxContext)
	if (!log) {
		throw createError({ statusCode: 404, statusMessage: `Log not found: ${logId}` })
	}
	if (!log.time_out) {
		throw createError({
			statusCode: 400,
			statusMessage: `Log ${logId} cannot be approved because the intern has not logged out yet.`,
		})
	}

	const intern = await internService.getInternDetailsById(log.intern_id, trxContext)
	if (!intern) {
		throw createError({
			statusCode: 500,
			statusMessage: `Data integrity error: Intern with ID ${log.intern_id} not found for log ${logId}.`,
		})
	}

	// 5. Handle cases where the log is already approved
	if (log.status === true) {
		console.warn(`Log ${logId} is already approved. No action was taken.`)
		// Return the existing hours when no action is taken
		return { updatedCompletedHours: intern.hours_completed ?? 0 }
	}

	// 4. Perform Business Logic Calculations
	const totalHoursForLog = calculateWorkHours(log.time_in, log.time_out)
	const currentCompletedHours = intern.hours_completed ?? 0
	const newCompletedHours = currentCompletedHours + totalHoursForLog

	// 6. Persist changes to the database
	await timeLogService.approveLog(logId, adminId, { admin_remarks, totalHours: totalHoursForLog }, trxContext)
	await internService.updateCompletedHours(intern.id, newCompletedHours, trxContext)

	return { updatedCompletedHours: newCompletedHours }
}

export const approveSingleLog = async (dto: ApproveSingleLogDTO, context: RequestContext): Promise<ApproveSingleLogResult> => {
	const authPayload = await checkAuthentication(context);
	let adminId: string;
	if (typeof authPayload === 'object' && authPayload !== null) {
		adminId = (authPayload as any).userId;
	} else {
		adminId = authPayload as string;
	}

	const { logId, admin_remarks } = await validateDTO(dto);

	const { updatedCompletedHours } = await db.transaction().execute(async (trx) => {
		return approveLogLogic(trx, context, logId, adminId, admin_remarks || null);
	});

	return { success: true, logId, updatedCompletedHours };
}
