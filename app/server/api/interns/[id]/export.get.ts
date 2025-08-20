import { defineEventHandler, setResponseHeaders } from 'h3'
import { exportInternTimeLogs } from '~/server/use-case/time-logs/export.use-case'

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
