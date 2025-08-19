import { z } from 'zod'
import { approveSingleLog } from '~/server/use-case/time-logs/approve-single-log.use-case'
import type { RequestContext } from '~/server/types/RequestContext'
import type { ApproveSingleLogDTO } from '~/server/use-case/time-logs/approve-single-log.use-case'

const approveLogBodySchema = z.object({
	logId: z.string(),
	admin_remarks: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const parsedBody = approveLogBodySchema.parse(body)

	const dto: ApproveSingleLogDTO = {
		logId: parsedBody.logId,
		admin_remarks: parsedBody.admin_remarks,
	}

	const useCaseContext: RequestContext = {
		auth: event.context.auth ?? {},
	}

	const result = await approveSingleLog(dto, useCaseContext)
	return result
})
