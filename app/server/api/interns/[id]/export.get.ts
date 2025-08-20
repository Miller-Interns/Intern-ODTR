import { internFactory } from '~/server/factory/intern.factory'
import { getInternDetails } from '~/server/use-case/interns/get-intern-details.use-case'
import type { RequestContext } from '~/server/types/RequestContext'
import { exportInternTimeLogs } from '~/server/use-case/interns/export-intern-timelogs.use-case'

export default defineEventHandler(async (event) => {
	const internId = event.context.params?.internId

	try {
		const csvString = await exportInternTimeLogs({ internId }, event.context)

		setResponseHeaders(event, {
			'Content-Type': 'text/csv',
			'Content-Disposition': `attachment; filename="timelogs-${internId}-${new Date().toISOString().split('T')[0]}.csv"`,
		})

		return csvString
	} catch (error) {
		throw error
	}
})
