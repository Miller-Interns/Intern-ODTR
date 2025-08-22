import type { ExportTimeLogsResponse, FormattedTimeLog } from '~/server/response/export-logs.response'

function escapeCsvField(field: any): string {
	const stringField = String(field ?? '')
	return stringField.includes(',') ? `"${stringField}"` : stringField
}

export function formatTimelogsToCsv(data: ExportTimeLogsResponse): string {
	const { intern, timelogs } = data
	const csvLines: string[] = []

	csvLines.push('Miller Dev Internship Daily Time Record')
	csvLines.push(`Intern Name: ${intern.name}`)
	csvLines.push(`Official Hours: ${intern.officialHours}`)
	csvLines.push('')

	const tableHeaders = ['Date', 'Approved By', 'Time In', 'Time Out', 'No. of Hours']

	csvLines.push(tableHeaders.join(','))
	let totalHours = 0

	timelogs.forEach((log: FormattedTimeLog) => {
		const row = [
			escapeCsvField(log.date),
			escapeCsvField(log.approvedBy),
			escapeCsvField(log.timeIn),
			escapeCsvField(log.timeOut),
			escapeCsvField(log.noOfHours),
		]
		csvLines.push(row.join(','))

		totalHours += Number(log.noOfHours) || 0
	})

	csvLines.push('')
	csvLines.push(`,,,,Total No. of Hours: ${totalHours}`)
	return csvLines.join('\n')
}
